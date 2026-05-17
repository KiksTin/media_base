
"use client"

import { useState, useEffect } from 'react';
import { useSongContext } from '../../../../context/SongContext';
import './page.css';

interface Song {
  song_id: number;
  song_name: string;
  song_artist: string;
  song_image: string;
  song_audio: string;
  user_id: number;
  song_genre?: string;
  date_created?: string;
}

const Upload = ({currentUser}: {currentUser: any}) => {
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong } = useSongContext();

  useEffect(() => {
    const fetchUploadedSongs = async () => {
      try {
        console.log('Upload - Component mounted, fetching songs');
        console.log('Upload - Current user:', currentUser);
        console.log('Upload - User ID:', currentUser?.user_id);

        if (!currentUser || !currentUser.user_id) {
          console.log('Upload - No current user or user_id, skipping fetch');
          setLoading(false);
          return;
        }

        const apiUrl = `/api/get-uploaded-songs?user_id=${currentUser.user_id}`;
        console.log('Upload - Fetching from:', apiUrl);

        const response = await fetch(apiUrl);

        console.log('Upload - Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Upload - Data received:', data);
          console.log('Upload - Data length:', Array.isArray(data) ? data.length : 'Not an array');
          setUploadedSongs(data);
        } else {
          console.error('Upload - Response not ok:', response.statusText);
          const errorData = await response.json();
          console.error('Upload - Error data:', errorData);
        }
      } catch (error) {
        console.error('Upload - Error fetching uploaded songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedSongs();
  }, [currentUser]);

  const handleSongClick = (song: Song) => {
    setCurrentSong(song);
  };

  return (
   <div className="our-container">
      {loading ? (
        <p>Loading...</p>
      ) : uploadedSongs.length === 0 ? (
        <p>No uploaded songs</p>
      ) : (
           <div className="music-list">
        <ol>
          {uploadedSongs.map(song => {
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
           <div className='song-detail'>
            <audio src={song.song_audio}/>
            </div>
            </div>
         
         );
       })}
        </ol>
         </div>
      )}
    </div>

  )
}

export default Upload