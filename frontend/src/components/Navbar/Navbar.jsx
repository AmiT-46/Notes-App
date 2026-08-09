import { ProfileInfo } from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../SearchBar/SearchBar';

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, onOpenProfile })=>{

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
    }


    return <>
        <header className="navbar">
            <div className="navbar__brand-wrap">
                <h2 className="navbar__brand">NOTES</h2>
            </div>
            
            <SearchBar onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
            
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} onOpenProfile={onOpenProfile}/>
        </header>  

    </>
}

export default Navbar
