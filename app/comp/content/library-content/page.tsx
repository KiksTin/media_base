
"use client"
import { useState, useEffect } from 'react';
import './page.css'
import SelectSong from '../select-song/select-song';
import Link from 'next/link'


interface LikedItem {
  like_id: number;
  song_id: number;
  user_id: number;
}

const LibraryContent = ({currentUser}: {currentUser: any}) => {
  const [likedSongs, setLikedSongs] = useState<LikedItem[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchLikedSongs = async () => {
        try {  
          if (!currentUser || !currentUser.user_id) {
            console.log('LikeContent - No current user or user_id, skipping fetch');
            return;
          }
          
          const apiUrl = `/api/get-liked-songs?user_id=${currentUser.user_id}`;
          console.log('LikeContent - Fetching liked songs from:', apiUrl);
          
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            setLikedSongs(data);
          } 
        } catch (error) {
          console.error('LikeContent - Error fetching recently played:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchLikedSongs();
    }, [currentUser]);

  return (
    
    <div className='library-container'>
    <div className="container">
    <div className='header'>
        <h1>Liked Songs</h1>
    </div>
    <div className='select-song'>
      {currentUser ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <SelectSong likedSongs={likedSongs} recentlyPlayed={[]} selectedPlaylist={null} currentUser={currentUser}/>
        )
      ) : (
        <>
         <div className='no-user-container'>
        <p>Please log in to view your liked songs</p>
         <div className="auth-links">
            <Link href="/log-in" className="auth-link">Login</Link>
            |
            <Link href="/sign-up" className="auth-link">Sign Up</Link>
         </div>
         </div>
        </>
      )}
    </div>
  </div>
  </div>
  )

}

export default LibraryContent