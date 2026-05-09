'use client'
import './select-song.css'
import { useState, useEffect } from 'react';
import SelectSongClient from './SelectSongClient';

const SelectSong = ({selectedPlaylist, recentlyPlayed, currentUser, likedSongs}: {selectedPlaylist: any; recentlyPlayed: any[]; currentUser: any; likedSongs: any[]}) => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSongs = async () => {
      try {
        let endpoint = selectedPlaylist ? '/api/get-songs' : '/api/get-recently-played';
        
        if (!selectedPlaylist && currentUser?.user_id) {
          endpoint += `?user_id=${currentUser.user_id}`;
        }

        if (!recentlyPlayed && currentUser?.user_id) {
          endpoint += `?user_id=${currentUser.user_id}`;
        }

        if (!likedSongs && currentUser?.user_id) {
          endpoint += `?user_id=${currentUser.user_id}`;
        }
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const songData = await response.json();
          
          const serializedSongs = songData.map((song: any) => {
            return {
              id: song.song_id,
              name: song.song_name,
              image: song.song_image,
              audio: song.song_audio,
              artist: song.song_artist,
              genre: song.song_genre,
              ...song,
            };
          });

          setSongs(serializedSongs);
        } 
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    getSongs();
  }, []);

  if (loading) {
    return <div>Loading songs...</div>;
  }

  return <ul><SelectSongClient likedSongs={likedSongs} songs={songs} selectedPlaylist={selectedPlaylist} recentlyPlayed={recentlyPlayed}/></ul>;
};

export default SelectSong