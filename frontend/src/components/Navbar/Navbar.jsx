import { Link, useNavigate } from "react-router-dom";
import { ProfileInfo } from "../Cards/ProfileInfo";
import { SearchBar } from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, onOpenProfile })=>{

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
    }


    return (
        <header className="navbar">
            <div className="navbar__brand-wrap"><Link to="/" className="navbar__brand">NOTES</Link></div>
            <div className="navbar__center">
                {userInfo && onSearchNote && <SearchBar onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />}
            </div>
            <div className="navbar__actions">
                {userInfo ? <ProfileInfo userInfo={userInfo} onLogout={onLogout} onOpenProfile={onOpenProfile || (() => navigate("/dashboard"))} /> : <>
                    <Link to="/login" className="button button--text">Log in</Link>
                    <Link to="/signUp" className="button button--primary button--compact">Sign up free</Link>
                </>}
            </div>
        </header>
    );
}

export default Navbar
