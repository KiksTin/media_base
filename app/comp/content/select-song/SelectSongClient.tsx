'use client'
import { useState, useEffect } from 'react';
import { useSongContext } from '../../../context/SongContext';

const SelectSongClient = ({ likedSongs, songs, selectedPlaylist, recentlyPlayed }: { likedSongs: any[]; songs: any[]; selectedPlaylist: any; recentlyPlayed: any[] }) => {
  const {setCurrentSong, setIsPlaying, setPlaylist, setCurrentIndex } = useSongContext();
  const [songDurations, setSongDurations] = useState<{[key: string]: string}>({});

  

  const filteredSongs = selectedPlaylist && selectedPlaylist.songs
     ? songs.filter(song => selectedPlaylist.songs.some((playlistSong: any) => playlistSong.song_id === song.id))
     : recentlyPlayed && recentlyPlayed.length > 0 
       ? recentlyPlayed 
       : likedSongs && likedSongs.length > 0 
         ? likedSongs 
         : songs;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const getDurations = async () => {
      const durations: {[key: string]: string} = {};
      for (const song of filteredSongs) {
          const audio = new Audio(song.song_audio);
          audio.addEventListener('loadedmetadata', () => {
            durations[song.song_audio] = formatTime(audio.duration);
          });
      }
      setSongDurations(durations);
    };
    
    if (songs.length > 0) {
      getDurations();
    }

  }, []);

  const handleSongClick = (song: any) => {
   setCurrentSong(song);
   setIsPlaying(true);
   setPlaylist(filteredSongs);
   const index = filteredSongs.findIndex((s: any) => s.song_id === song.song_id);
   if (index !== -1) {
     setCurrentIndex(index);
   }
 };

   
   return (
    <div>
       {filteredSongs.map((song, index) => {
         return (
           <div className='music-container' key={`${song.song_id}-${song.song_name}-${index}-${Date.now()}`} onClick={() => handleSongClick(song)}>
             <div className='image'>
               <img 
                 src={song.song_image}
                 alt={song.song_name}
               onLoad={() => console.log('Image loaded')}
               />
             </div>
           <div className='song-artist'>
             <h3>{song.song_name}</h3>
             <p>{song.song_artist}</p>
           </div>
           <div className='song-detail'>
            <audio src={song.song_audio}/>
             <span>{songDurations[song.song_audio] || '0:00'}</span>
            </div>
          </div>
         );
       })}
   </div>
   );
};

export default SelectSongClient;
