'use client'
import './page.css'

export default function UserLog({ currentUser }: { currentUser: any }) {
  
return (
      <div className="log_container">
        {currentUser ? (
          <div className="profile-wrapper">
            <div className="profile-info">
              <div className="profile-pic">
                <img className="profile-image" src={currentUser.user_profile} alt="Profile" />
              </div>
              <div className='user-info'>
                <span className="user-name">
                  {currentUser.user_name}
                </span>
                <span className="user-email">
                  {currentUser.user_email || 'No email'}
                </span>
              </div>
            </div>
          </div>
        ) : 'LOGIN'}
     </div>
  )
}