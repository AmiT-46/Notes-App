import { useEffect, useState } from "react";
import { NoteCard } from "../../components/Cards/NoteCard";
import { NoteDetail } from "../../components/Cards/NoteDetail";
import { ProfilePanel } from "../../components/Cards/ProfilePanel";
import { AddNotes } from "./AddNotes";
import Modal from "react-modal";
import { getUser } from "../../services/authApi";
import { getNotes, removeNote, searchNotes, updateNote } from "../../services/notesApi";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { FiPlus } from "react-icons/fi";

Modal.setAppElement("#root");

const Home = ({ onNavbarChange }) => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [openNoteDetail, setOpenNoteDetail] = useState({ isShown: false, data: null, session: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileSession, setProfileSession] = useState(0);

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const handleOpenNote = (noteDetails) => {
    setOpenNoteDetail((current) => ({ isShown: true, data: noteDetails, session: current.session + 1 }));
  };

  const handleNoteSaved = async (updatedNote) => {
    setOpenNoteDetail((current) => ({ ...current, data: updatedNote }));
    setAllNotes((notes) => notes.map((note) => note._id === updatedNote._id ? updatedNote : note));
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await getNotes();

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch {
      showToastMessage("Unable to load notes. Please try again.", "error");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    if (!window.confirm(`Delete “${data.title}”? This cannot be undone.`)) return;
    const noteId = data._id;

    try {
      const response = await removeNote(noteId);

      if (response.data && !response.data.error) {
        setAllNotes((notes) => notes.filter((note) => note._id !== noteId));
        showToastMessage("Note deleted successfully", "success");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(error.response?.data?.message || "Unable to delete note", "error");
      }
    }
  };

  // Search for a Note
  const onSearchNote = async (query) => {
    try{
        const response = await searchNotes(query);

        setIsSearch(true);
        setAllNotes(response.data?.notes || []);
    } catch (error) {
        showToastMessage(error.response?.data?.message || "Unable to search notes", "error");
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
        
    try{
        const response = await updateNote(noteId, {
            isPinned : !noteData.isPinned,
        });
        
        if(response.data && response.data.note){
            setAllNotes((notes) => notes.map((note) => note._id === noteId ? response.data.note : note));
            showToastMessage(noteData.isPinned ? "Note unpinned successfully" : "Note pinned successfully", "success");
        }
    } catch(error) {
        showToastMessage(error.response?.data?.message || "Unable to update note", "error");
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    onNavbarChange({
      userInfo,
      onSearchNote,
      handleClearSearch,
      onOpenProfile: () => {
        setProfileSession((session) => session + 1);
        setIsProfileOpen(true);
      },
    });

    return () => onNavbarChange(null);
  }, [userInfo]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [notesResponse, userResponse] = await Promise.all([
          getNotes(),
          getUser(),
        ]);

        if (notesResponse.data?.notes) setAllNotes(notesResponse.data.notes);
        if (userResponse.data?.user) setUserInfo(userResponse.data.user);
      } catch (error) { showToastMessage(error.response?.data?.message || "Unable to load dashboard", "error"); }
      finally { setIsLoading(false); }
    };

    void loadDashboard();
  }, []);

  return (
    <>
      <main className="dashboard">
        {isLoading ? <div className="dashboard-loading" role="status">Loading your notes…</div> : allNotes.length > 0 ? (
          <div className="notes-grid">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onOpen={() => handleOpenNote(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
            title={isSearch ?`Not Found` : `Empty`} 
            message={
                isSearch
                    ? `Oops! No notes found matching your search`
                    : `Start creating your first Note! Click the 'Add Note' button to note down your thoughts, ideas, and reminders. Let's get started.`
                } />
        )}
      </main>

      <button
        className="floating-add-button"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
        aria-label="Add note"
        title="Add note"
      >
        <FiPlus aria-hidden="true" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        overlayClassName="note-modal-overlay"
        contentLabel=""
        className="note-modal"
      >
        <AddNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
            // console.log("On close function invoked");
          }}
          onAdded={(note) => setAllNotes((notes) => [note, ...notes])}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Modal
        isOpen={openNoteDetail.isShown}
        onRequestClose={() => setOpenNoteDetail({ isShown: false, data: null, session: 0 })}
        overlayClassName="note-detail-overlay"
        className="note-detail-panel"
        contentLabel="Note details"
      >
        <NoteDetail
          key={openNoteDetail.session}
          note={openNoteDetail.data}
          onClose={() => setOpenNoteDetail({ isShown: false, data: null, session: 0 })}
          onSaved={handleNoteSaved}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onRequestClose={() => setIsProfileOpen(false)}
        overlayClassName="profile-panel-overlay"
        className="profile-panel-modal"
        contentLabel="Profile settings"
      >
        <ProfilePanel
          key={profileSession}
          userInfo={userInfo}
          onClose={() => setIsProfileOpen(false)}
          onSaved={(updatedUser) => setUserInfo(updatedUser)}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
