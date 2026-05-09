'use client'
import './page.css'
import SelectSong from '../select-song/select-song'
import PlaylistContainer from '../playlist-content/playlist-container/page'
import { useState } from 'react'

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
      <h3 className='select-song-error'>Log-in to create your playlist</h3>
      </>
    )
}

      </div>
    </div>
  )
}

export default PlaylistContent