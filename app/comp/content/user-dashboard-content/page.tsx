'use client'
export default function UserLog({ currentUser }: { currentUser: any }) {
  
return (
      <div className="log_container">
        {currentUser ? 'LOGGED IN' : 'LOGIN'}
     </div>
  )
}