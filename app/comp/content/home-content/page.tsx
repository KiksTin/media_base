
"use client"
import './page.css'
import SelectSong from '../select-song/select-song';
import { useState, useEffect } from 'react';

interface RecentlyPlayedItem {
  recent_id: number;
  song_id: number;
  user_id: number;
}
const HomeContent = ({currentUser}: {currentUser: any}) => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        console.log('HomeContent - Current user:', currentUser);
        console.log('HomeContent - User ID:', currentUser?.user_id);
        
        if (!currentUser || !currentUser.user_id) {
          console.log('HomeContent - No current user or user_id, skipping fetch');
          return;
        }
        
        const apiUrl = `/api/get-recently-played?user_id=${currentUser.user_id}`;
        console.log('HomeContent - Fetching recently played from:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('HomeContent - Response status:', response.status);
        console.log('HomeContent - Response headers:', response.headers);
        
        if (response.ok) {
          const data = await response.json();
          console.log('HomeContent - Recently played data:', data);
          console.log('HomeContent - Data type:', typeof data);
          console.log('HomeContent - Data length:', data?.length);
          console.log('HomeContent - Sample item:', data?.[0]);
          setRecentlyPlayed(data);
        } else {
          console.error('HomeContent - Failed to fetch recently played:', response.status);
          console.error('HomeContent - Response text:', await response.text());
        }
      } catch (error) {
        console.error('HomeContent - Error fetching recently played:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [currentUser]);

  return (
  <div className='home-container'>
   <div className="container">
    <div className='header'>
      {currentUser ? (
        <h1>Recently Played</h1>
      ) : (
        <h1>Explore Music</h1>
      )}
    </div>
    <div className='select-song'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol>
          <SelectSong likedSongs={[]} recentlyPlayed={recentlyPlayed} selectedPlaylist={null} currentUser={currentUser}/>
        </ol>
      )}
    </div>
  </div>
  </div>
  )
}

export default HomeContent