
"use client"
import { useState, useEffect } from 'react';
import './page.css'
import SelectSong from '../select-song/select-song';


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
          console.log('LikeContent - Current user:', currentUser);
          console.log('LikeContent - User ID:', currentUser?.user_id);
          
          if (!currentUser || !currentUser.user_id) {
            console.log('LikeContent - No current user or user_id, skipping fetch');
            return;
          }
          
          const apiUrl = `/api/get-liked-songs?user_id=${currentUser.user_id}`;
          console.log('LikeContent - Fetching liked songs from:', apiUrl);
          
          const response = await fetch(apiUrl);
          console.log('LikeContent - Response status:', response.status);
          console.log('LikeContent - Response headers:', response.headers);
          
          if (response.ok) {
            const data = await response.json();
            console.log('LikeContent - Liked songs data:', data);
            console.log('LikeContent - Data type:', typeof data);
            console.log('LikeContent - Data length:', data?.length);
            console.log('LikeContent - Sample item:', data?.[0]);
            setLikedSongs(data);
          } else {
            console.error('LikeContent - Failed to fetch recently played:', response.status);
            console.error('LikeContent - Response text:', await response.text());
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
        <h1>Song Library</h1>
    </div>
    <div className='select-song'>
      <SelectSong likedSongs={likedSongs} recentlyPlayed={[]} selectedPlaylist={null} currentUser={currentUser}/>
    </div>
  </div>
  </div>
  )

}

export default LibraryContent