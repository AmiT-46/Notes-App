import { getInitials } from '../../utils/helper'

export function ProfileInfo({ userInfo, onLogout, onOpenProfile }){
    return (
        userInfo && <div className='profile-info'>
            <button className='profile-info__avatar' onClick={onOpenProfile} aria-label="Open profile settings" title="Profile settings">
                {getInitials(userInfo.fullName)}
            </button>
            <div className='profile-info__details'>
                <p className='profile-info__name'>{userInfo.fullName}</p>
                <button className='profile-info__logout' onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}
