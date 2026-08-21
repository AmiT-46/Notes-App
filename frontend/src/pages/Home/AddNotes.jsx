import { useState } from "react";
import { FiFileText, FiPlus, FiX } from "react-icons/fi";
import { TagInput } from "../../components/Input/TagInput";
import { addNote } from "../../services/notesApi";

export function AddNotes({ onAdded, onClose, showToastMessage }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addNewNote = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await addNote({ title: title.trim(), content: content.trim(), tags });
      if (response.data?.note) {
        onAdded(response.data.note);
        showToastMessage("Note added successfully", "success");
        onClose();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add your note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
        <form className="note-form" onSubmit={addNewNote}>

          <header className="note-form__header">
            <div className="note-form__heading">
              <p className="note-form__eyebrow">NEW NOTE</p>
              <h2 className="note-form__title">Capture an idea</h2>
            </div>

            <button
              className="note-form__close"
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div className="note-form__body">

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="new-note-title"
              >
                TITLE
              </label>

              <input
                id="new-note-title"
                type="text"
                className="note-form__title-input"
                placeholder="Give your note a title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group form-group--spaced">
              <label
                className="form-label"
                htmlFor="new-note-content"
              >
                CONTENT
              </label>

              <textarea
                id="new-note-content"
                className="note-form__content-input"
                placeholder="Start writing your thoughts..."
                rows={10}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>

            <div className="note-form__tags">
              <label className="form-label">TAGS</label>
              <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && (
              <p className="form-error form-error--spaced">
                {error}
              </p>
            )}

          </div>

          <footer className="note-form__footer">
            <button
              className="button button--secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="button button--primary"
              type="submit"
              disabled={isSaving}
            >
              <FiPlus aria-hidden="true" />
              {isSaving ? "Adding..." : "Add note"}
            </button>
          </footer>

        </form>
    </div>
  );
}
