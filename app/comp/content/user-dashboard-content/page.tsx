'use client'
import './page.css'
import { useClientContext } from '../../../context/ClientContext'
import Link from 'next/link'

export default function UserLog({ currentUser }: { currentUser: any }) {
    const { logout } = useClientContext();
  
return (
      <div className="log_container">
          <div className="profile-wrapper">
            <div className="profile-info">
              <img className="profile-cover" src={currentUser?.user_cover || "/background.png"} alt="Profile Cover" />
              <div className="profile-pic-container">
              <div className="profile-pic">
                <img className="profile-image" src={currentUser?.user_profile || "/user.png"} alt="Profile" />
              </div>
              
              <div className='user-info'>
                <span className="user-name">
                  {currentUser?.user_name || 'Guest'}
                </span>
                <span className="user-email">
                  {currentUser?.user_email || 'No email'}
                </span>
              </div>
              </div>
            </div>
            <div className='profile-content'>
            { !currentUser ? (
            <div className="auth-links">
               <Link href="/log-in" className="auth-link">Login</Link>
               |
               <Link href="/sign-up" className="auth-link">Sign Up</Link>
            </div>
            ) : (
              <button type="button"onClick={logout} className="auth-link">Logout</button>
            )}
            </div>
        </div>
     </div>
  )
}