const { z } = require("zod");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid note id");
const tag = z.string().trim().min(1).max(30);
const noteFields = {
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(10000),
  tags: z.array(tag).max(10),
};

const schemas = {
  signup: z.object({ fullName: z.string().trim().min(1).max(100), email: z.string().trim().email(), password: z.string().min(8).max(128) }),
  login: z.object({ email: z.string().trim().email(), password: z.string().min(8).max(128) }),
  profile: z.object({ fullName: z.string().trim().min(1).max(100).optional(), currentPassword: z.string().min(8).max(128).optional(), newPassword: z.string().min(8).max(128).optional() }).refine((value) => value.fullName !== undefined || value.currentPassword !== undefined || value.newPassword !== undefined, "No profile changes provided").refine((value) => (value.currentPassword === undefined) === (value.newPassword === undefined), "Current and new passwords are required"),
  createNote: z.object(noteFields),
  updateNote: z.object({ title: noteFields.title.optional(), content: noteFields.content.optional(), tags: noteFields.tags.optional(), isPinned: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0, "No changes provided"),
  noteParams: z.object({ noteId: objectId }),
  notesQuery: z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(20) }),
  searchQuery: z.object({ query: z.string().trim().min(1).max(200) }),
};

function validate(schema, location = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[location]);
    if (!result.success) return res.status(400).json({ error: true, message: result.error.issues[0].message });
    req[location] = result.data;
    return next();
  };
}

module.exports = { schemas, validate };
