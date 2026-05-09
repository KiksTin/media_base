'use client'
import './page.css'
import { useState, useEffect } from 'react';

interface PlaylistSong {
  mb_playlist_song_id: number;
  playlist_id: number;
  song_id: number;
  date_added?: string;
}

interface Playlist {
  playlist_id: number;
  playlist_name: string;
  playlist_cover: string | null;
  user_id: number;
  created_at: string;
  songs: PlaylistSong[];
}

interface PlaylistContainerProps {
  currentUser: any;
  onPlaylistSelect: (playlist: Playlist | null) => void;
}

const PlaylistContainer = ({currentUser, onPlaylistSelect}: PlaylistContainerProps) => {
  const [playlists, setPlaylists] =useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('PlaylistContainer - Playlist clicked:', playlist.playlist_name);
    setSelectedPlaylist(playlist);
    onPlaylistSelect(playlist);
  };

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      console.log('PlaylistContainer - Current user data:', currentUser);
      console.log('PlaylistContainer - User ID:', currentUser?.user_id);
      
      if (!currentUser?.user_id) {
        console.log('PlaylistContainer - No user_id found, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `/api/get-user-playlists?user_id=${currentUser.user_id}`;
        console.log('PlaylistContainer - Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('PlaylistContainer - Response status:', response.status);
        
        if (response.ok) {
          const userPlaylists: Playlist[] = await response.json();
          console.log('PlaylistContainer - Playlists received:', userPlaylists[0]);
          setPlaylists(userPlaylists);
        } else {
          console.error('PlaylistContainer - API response not ok:', response.statusText);
        }
      } catch (error) {
        console.error('PlaylistContainer - Error fetching user playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [currentUser]);

  if (loading) {
    return (
      <div className='playlist-card'>
        <h2>Loading playlists...</h2>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className='playlist-card'>
        <h2>No playlists found</h2>
        <p>Create your first playlist to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {playlists.map((playlist) => (
        <div
          key={playlist.playlist_id} 
          className={`playlist-card ${selectedPlaylist?.playlist_id === playlist.playlist_id ? 'selected' : ''}`}
          onClick={() => handlePlaylistClick(playlist)}
        >
          <img src={playlist.playlist_cover || ''} alt="Playlist" className='playlist-cover' />
          <h2>{playlist.playlist_name}</h2>
        </div>
      ))}
    </div>
  );
};

export default PlaylistContainer;