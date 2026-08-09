import { useState } from "react";
import moment from "moment";
import { FiSave, FiX } from "react-icons/fi";
import { TagInput } from "../Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

export function NoteDetail({ note, onClose, onSaved, showToastMessage }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!note) return null;

  const saveNote = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await axiosInstance.put(`/edit-note/${note._id}`, { title: title.trim(), content: content.trim(), tags });
      await onSaved(response.data.note);
      showToastMessage("Note saved successfully", "success");
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this note. Please try again.");
      showToastMessage("Unable to save note", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="note-detail" onSubmit={saveNote}>
      <header className="note-detail__header">
        <div className="note-detail__heading">
          <p className="note-detail__eyebrow">EDITING NOTE</p>
          <input className="note-detail__title-input" value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Note title" />
          <p className="note-detail__date">Created {moment(note.createdOn).format("Do MMMM YYYY, h:mm A")}</p>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Discard changes and close note" title="Close">
          <FiX aria-hidden="true" />
        </button>
      </header>

      <textarea className="note-detail__content-input" value={content} onChange={(event) => setContent(event.target.value)} aria-label="Note content" />

      <div className="note-detail__tags-editor">
        <label className="form-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="form-error form-error--spaced">{error}</p>}

      <footer className="note-detail__footer">
        <span className="note-detail__pin-state">{note.isPinned ? "Pinned" : "Not pinned"}</span>
        <div className="note-detail__actions">
          <button className="button button--secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="button button--primary" type="submit" disabled={isSaving}>
            <FiSave aria-hidden="true" /> {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </footer>
    </form>
  );
}
