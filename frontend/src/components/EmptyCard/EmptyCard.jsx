const EmptyCard = ({ title, message }) => {
    return (
        <div className="empty-state">
            <div className="empty-state__title">
                {title}
            </div>
            <p className="empty-state__message">
                {message}
            </p>
        </div>
    )
}

export default EmptyCard
