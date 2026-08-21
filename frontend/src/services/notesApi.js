import axiosInstance from "../utils/axiosInstance";

export const getNotes = (params) => axiosInstance.get("/get-all-notes", { params });
export const searchNotes = (query) => axiosInstance.get("/search-notes", { params: { query } });
export const addNote = (note) => axiosInstance.post("/add-note", note);
export const updateNote = (noteId, changes) => axiosInstance.patch(`/api/notes/${noteId}`, changes);
export const removeNote = (noteId) => axiosInstance.delete(`/delete-note/${noteId}`);
