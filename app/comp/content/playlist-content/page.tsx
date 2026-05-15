'use client'
import './page.css'
import SelectSong from '../select-song/select-song'
import PlaylistContainer from '../playlist-content/playlist-container/page'
import { useState } from 'react'
import Link from 'next/link'

const PlaylistContent = ({currentUser}: {currentUser: any}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);

  return (
    <div className='playlist-container'>
    
      <div className="container">
        <div className='header'>
        <h1>Playlists</h1>
      </div>
      {currentUser ?(
        <>
          <div className='playlist-cards'>
            <ol>
             <PlaylistContainer currentUser={currentUser} onPlaylistSelect={setSelectedPlaylist}/>
            </ol>
          </div>
          <div className='select-song'>
          {!selectedPlaylist ? (
            <>
              <h3 className='select-song-error'>Select songs</h3>
            </>
            ) : (
            <>
            <ol>
              <SelectSong likedSongs={[]} selectedPlaylist={selectedPlaylist} recentlyPlayed={[]} currentUser={currentUser}/>
            </ol>
            </>
          )}
      </div>
      </>
          ):(
      <>
      <div className='no-user-container'>
      <h3 className='select-song-error'>Log-in to create your playlist</h3>
      <div className="auth-links">
      <Link href="/log-in" className="auth-link">Login</Link>
      |
      <Link href="/sign-up" className="auth-link">Sign Up</Link>
      </div>
      </div>
      </>
    )
}

      </div>
    </div>
  )
}

export default PlaylistContent