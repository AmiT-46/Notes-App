process.env.MONGODB_URI = "mongodb://example.test/notes";
process.env.ACCESS_TOKEN_SECRET = "test-secret-that-is-long-enough";

const request = require("supertest");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const app = require("../src/app");

jest.mock("../models/user.model");
jest.mock("../models/note.model");

describe("API security and note endpoints", () => {
  beforeEach(() => jest.clearAllMocks());

  test("rejects invalid signup input", async () => {
    const response = await request(app).post("/create-account").send({ fullName: "A", email: "invalid", password: "short" });
    expect(response.status).toBe(400);
  });

  test("rejects requests to protected endpoints without a token", async () => {
    const response = await request(app).get("/get-all-notes");
    expect(response.status).toBe(401);
  });

  test("creates, updates, and deletes a note for an authenticated user", async () => {
    const token = require("jsonwebtoken").sign({ sub: "507f1f77bcf86cd799439011" }, process.env.ACCESS_TOKEN_SECRET);
    const note = { _id: "507f191e810c19729de860ea", title: "First", content: "Body", tags: [], isPinned: false };
    Note.create.mockResolvedValue(note);
    Note.findOneAndUpdate.mockResolvedValue({ ...note, isPinned: true });

    const create = await request(app).post("/add-note").set("Authorization", `Bearer ${token}`).send({ title: "First", content: "Body", tags: [] });
    expect(create.status).toBe(201);
    const update = await request(app).patch(`/api/notes/${note._id}`).set("Authorization", `Bearer ${token}`).send({ isPinned: true });
    expect(update.status).toBe(200);
    expect(update.body.note.isPinned).toBe(true);

    Note.findOneAndDelete.mockResolvedValue(note);
    const deletion = await request(app).delete(`/delete-note/${note._id}`).set("Authorization", `Bearer ${token}`);
    expect(deletion.status).toBe(200);
  });

  test("rejects a legacy plaintext password", async () => {
    User.findOne.mockResolvedValue({ password: "plaintext" });
    const response = await request(app).post("/login").send({ email: "user@example.com", password: "long-enough" });
    expect(response.status).toBe(403);
  });

  test("searches note title and content by partial substring", async () => {
    const token = require("jsonwebtoken").sign({ sub: "507f1f77bcf86cd799439011" }, process.env.ACCESS_TOKEN_SECRET);
    const sort = jest.fn().mockResolvedValue([{ title: "Planning ideas", content: "My idea" }]);
    Note.find.mockReturnValue({ sort });

    const response = await request(app).get("/search-notes?query=pla").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.notes).toHaveLength(1);
    expect(Note.find).toHaveBeenCalledWith(expect.objectContaining({
      $or: expect.arrayContaining([expect.objectContaining({ title: { $regex: "pla", $options: "i" } })]),
    }));
  });
});
