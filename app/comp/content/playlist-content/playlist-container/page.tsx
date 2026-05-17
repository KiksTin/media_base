'use client'
import './page.css'
import { useState, useEffect } from 'react';
import { useClientContext } from '../../../../context/ClientContext';

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
  const { currentUser: contextUser } = useClientContext();
  const [playlists, setPlaylists] =useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const handleCreatePlaylist = () => {
    setShowCreateModal(true);
    setPlaylistName('');
    setCoverFile(null);
    setError('');
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setPlaylistName('');
    setCoverFile(null);
    setError('');
    setShowCoverUpload(false);
    setSelectedPlaylistId(null);
  };

  const handleCoverUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverFile) {
      setError('Cover image is required');
      return;
    }

    if (!selectedPlaylistId) {
      setError('Playlist ID is required');
      return;
    }

    setIsUploadingCover(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', coverFile);
      formData.append('playlist_id', selectedPlaylistId.toString());

      const response = await fetch('/api/update-playlist-cover', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowCoverUpload(false);
        setCoverFile(null);
        setSelectedPlaylistId(null);
        await fetchUserPlaylists();
      } else {
        setError(data.error || 'Failed to update cover');
      }
    } catch (error) {
      setError('Failed to update cover. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCreatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playlistName.trim()) {
      setError('Playlist name is required');
      return;
    }
    
    if (playlistName.trim().length < 2) {
      setError('Playlist name must be at least 2 characters');
      return;
    }
    
    if (playlistName.trim().length > 50) {
      setError('Playlist name must be less than 50 characters');
      return;
    }

    const userToUse = currentUser || contextUser;
    if (!userToUse?.user_id) {
      setError('You must be logged in to create playlists');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/add-new-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist_name: playlistName.trim(),
          user_id: userToUse.user_id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
   
     

        await fetchUserPlaylists();
        handleCloseModal();
      } else {
        setError(data.error || 'Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError('Failed to create playlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const fetchUserPlaylists = async () => {
    const userToUse = currentUser || contextUser;

    try {
      const apiUrl = `/api/get-user-playlists?user_id=${userToUse.user_id}`;
      console.log('PlaylistContainer - Fetching from:', apiUrl);

      const response = await fetch(apiUrl);
      console.log('PlaylistContainer - Response status:', response.status);

      if (response.ok) {
        const userPlaylists: Playlist[] = await response.json();
        console.log('PlaylistContainer - Playlists received:', userPlaylists);
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

  useEffect(() => {
    fetchUserPlaylists();
  }, [currentUser, contextUser]);

  if (loading) {
    return (
      <div className='playlist-card'>
        <h2>Loading playlists...</h2>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div>
      <div className='playlist-card'>
        <div className='create-playlist-card' onClick={() => handleCreatePlaylist()}>
          <h2>+</h2>
        </div>
      </div>

      {showCreateModal && (
        <div className="playlist-modal-overlay" onClick={handleCloseModal}>
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="playlist-modal-header">
              <h2>Create New Playlist</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleCreatePlaylistSubmit} className="playlist-modal-form">
              <div className="form-group">
                <label htmlFor="playlist-name">Playlist Name</label>
                <input
                  type="text"
                  id="playlist-name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  maxLength={50}
                  disabled={isCreating}
                  autoFocus
                />
                <div className="char-count">
                  {playlistName.length}/50
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cover-url">Cover Image (Optional)</label>
                <input
                  type="file"
                  id="cover-url"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  disabled={isCreating}
                />
                <div className="form-help">
                  Upload an image file (jpg, png, gif, webp, svg)
                </div>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-btn"
                  disabled={isCreating || !playlistName.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    );
  }

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('PlaylistContainer - Playlist clicked:', playlist.playlist_name);
    setSelectedPlaylist(playlist);
    onPlaylistSelect(playlist);
  };

  const handleUpdateCover = (playlistId: number) => {
    setCoverFile(null);
    setSelectedPlaylistId(playlistId);
    setShowCoverUpload(true);
    setShowMenu(null);
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    const userToUse = currentUser || contextUser;
    if (!userToUse?.user_id) {
      setError('You must be logged in to delete playlists');
      return;
    }

    try {
      const response = await fetch('/api/delete-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist_id: playlistId,
          user_id: userToUse.user_id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Playlist deleted successfully');
        setShowMenu(null);
        await fetchUserPlaylists();
      } else {
        setError(data.error || 'Failed to delete playlist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      setError('Failed to delete playlist. Please try again.');
    }
  };

  return (
    <>
      <div>
        {playlists.map((playlist) => (
          <div
            key={playlist.playlist_id} 
            className={`playlist-card ${selectedPlaylist?.playlist_id === playlist.playlist_id ? 'selected' : ''}`}
            onClick={() => handlePlaylistClick(playlist)}
          >
            <img src={playlist.playlist_cover || '/background.png'} alt="Playlist" className='playlist-cover' />
            <h2>{playlist.playlist_name}</h2>
            <button type="button" className='cover-update-btn' onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === playlist.playlist_id ? null : playlist.playlist_id); }}>. . .</button>
            {showMenu === playlist.playlist_id && (
              <div className="playlist-menu">
                <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdateCover(playlist.playlist_id); }}>Update Cover</button>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.playlist_id); }}>Delete Playlist</button>
              </div>
            )}
          </div>
        ))}
        <div className='playlist-card'>
          <div className='create-playlist-card' onClick={() => handleCreatePlaylist()}>
            <h2>+</h2>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="playlist-modal-overlay" onClick={handleCloseModal}>
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="playlist-modal-header">
              <h2>Create New Playlist</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleCreatePlaylistSubmit} className="playlist-modal-form">
              <div className="form-group">
                <label htmlFor="playlist-name">Playlist Name</label>
                <input
                  type="text"
                  id="playlist-name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  maxLength={50}
                  disabled={isCreating}
                  autoFocus
                />
                <div className="char-count">
                  {playlistName.length}/50
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cover-url">Cover Image (Optional)</label>
                <input
                  type="file"
                  id="cover-url"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  disabled={isCreating}
                />
                <div className="form-help">
                  Upload an image file (jpg, png, gif, webp, svg)
                </div>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-btn"
                  disabled={isCreating || !playlistName.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCoverUpload && (
        <div className="playlist-modal-overlay" onClick={handleCloseModal}>
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="playlist-modal-header">
              <h2>Update Playlist Cover</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleCoverUrlSubmit} className="playlist-modal-form">
              <div className="form-group">
                <label htmlFor="cover-url">Cover Image</label>
                <input
                  type="file"
                  id="cover-url"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  disabled={isUploadingCover}
                />
                <div className="form-help">
                  Upload an image file (jpg, png, gif, webp, svg)
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={isUploadingCover}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-btn"
                  disabled={isUploadingCover || !coverFile}
                >
                  {isUploadingCover ? 'Uploading...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistContainer;