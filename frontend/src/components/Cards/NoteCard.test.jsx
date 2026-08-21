import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NoteCard } from "./NoteCard";

describe("NoteCard", () => {
  it("renders a note title, preview, and tags", () => {
    const markup = renderToStaticMarkup(<NoteCard title="Planning" content="A concise preview" date="2026-08-21T00:00:00.000Z" tags={["work"]} isPinned={false} onOpen={() => {}} onDelete={() => {}} onPinNote={() => {}} />);
    expect(markup).toContain("Planning");
    expect(markup).toContain("A concise preview");
    expect(markup).toContain("#work");
  });
});
