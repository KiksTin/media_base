
"use client"

import { useState, useEffect } from 'react';
import { useSongContext } from '../../../../context/SongContext';

interface Song {
  song_id: number;
  song_name: string;
  song_artist: string;
  song_image: string;
  song_audio: string;
  song_genre?: string;
  date_played?: string;
}

const Recent = ({currentUser}: {currentUser: any}) => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong } = useSongContext();

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        console.log('Recent - Current user:', currentUser);
        console.log('Recent - User ID:', currentUser?.user_id);

        if (!currentUser || !currentUser.user_id) {
          console.log('Recent - No current user or user_id, skipping fetch');
          return;
        }

        const apiUrl = `/api/get-recently-played?user_id=${currentUser.user_id}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();
          setRecentlyPlayed(data);
        }
      } catch (error) {
        console.error('Recent - Error fetching recently played:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [currentUser]);

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
  };

  return (
   <div className="our-container">
      {loading ? (
        <p>Loading...</p>
      ) : recentlyPlayed.length === 0 ? (
        <p>No recently played songs</p>
      ) : (
        <ol>
          {recentlyPlayed.map(song => {
         return (
           <div className='musics-container' key={`${song.song_id}-${song.song_name}-${Date.now()}`} onClick={() => handleSongClick(song)}>
             <div className='images'>
                <div className='image-overlay'></div>
               <img
                 src={song.song_image}
                 alt={song.song_name}
               onLoad={() => console.log('Image loaded')}
               />
             </div>
           <div className='song-artists'>
             <h3>{song.song_name}</h3>
             <p>{song.song_artist}</p>
           </div>
          </div>
         );
       })}
        </ol>
      )}
    </div>
  )
}

export default Recent