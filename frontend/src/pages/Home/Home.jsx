import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { NoteCard } from "../../components/Cards/NoteCard";
import { NoteDetail } from "../../components/Cards/NoteDetail";
import { ProfilePanel } from "../../components/Cards/ProfilePanel";
import { AddNotes } from "./AddNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { FiPlus } from "react-icons/fi";

Modal.setAppElement("#root");

const Home = () => {
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
  
  const [isSearch, SetIsSearch] = useState(false);

  const navigate = useNavigate();

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
    await getAllNotes();
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch {
      console.log("An unexpected error occured. Please try again");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occured. Please Try again.");
      }
    }
  };

  // Search for a Note
  const onSearchNote = async (query) => {
    try{
        const response = await axiosInstance.get("/search-notes", {
            params: { query },
        });

        SetIsSearch(true);
        setAllNotes(response.data?.notes || []);
    } catch (error) {
        console.log(error);
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
        
    try{
        const response = await axiosInstance.put('/update-note-pinned/' + noteId, {
            isPinned : !noteData.isPinned,
        });
        
        if(response.data && response.data.note){
            showToastMessage("Note Pinned Successfully");
            getAllNotes();
        }
    } catch(error) {
        console.log(error);
    }
  }

  const handleClearSearch = () => {
    SetIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [notesResponse, userResponse] = await Promise.all([
          axiosInstance.get("/get-all-notes"),
          axiosInstance.get("/get-user"),
        ]);

        if (notesResponse.data?.notes) setAllNotes(notesResponse.data.notes);
        if (userResponse.data?.user) setUserInfo(userResponse.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    void loadDashboard();
  }, [navigate]);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} onOpenProfile={() => { setProfileSession((session) => session + 1); setIsProfileOpen(true); }} />

      <main className="dashboard">
        {allNotes.length > 0 ? (
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
        onRequestClose={() => {}}
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
          getAllNotes={getAllNotes}
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
