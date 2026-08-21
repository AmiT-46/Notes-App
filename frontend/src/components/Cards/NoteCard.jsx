import { FiBookmark, FiTrash2 } from "react-icons/fi";

export function NoteCard({ title, date, content, tags, isPinned, onOpen, onDelete, onPinNote}){
    const openOnKeyboard = (event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
        }
    };

    const keepCardClosed = (event, action) => {
        event.stopPropagation();
        action();
    };

    return (
            <article className='note-card' role="button" tabIndex="0" onClick={onOpen} onKeyDown={openOnKeyboard}>
                <div className='note-card__header'>
                    <div>
                        <h6 className='note-card__title'>{title}</h6>
                        <span className='note-card__date'>{new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))}</span>
                    </div>
                    <div>
                        <button className={`note-card__icon-action ${isPinned ? "note-card__icon-action--pinned" : ""}`} onClick={(event) => keepCardClosed(event, onPinNote)} aria-label={isPinned ? "Unpin note" : "Pin note"} title={isPinned ? "Unpin note" : "Pin note"}>
                            <FiBookmark aria-hidden="true" />
                        </button>
                    </div>
                </div>

            <p className='note-card__content'>{content?.slice(0,60)}</p>

            <div className='note-card__footer'>
                <div className='note-card__tags'>{tags.map((item)=> `#${item} `)}</div>
                <button className='note-card__icon-action note-card__icon-action--delete' onClick={(event) => keepCardClosed(event, onDelete)} aria-label="Delete note" title="Delete note">
                    <FiTrash2 aria-hidden="true" />
                </button>
            </div>
        </article>
    )
}
