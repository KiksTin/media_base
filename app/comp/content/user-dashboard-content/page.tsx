'use client'
import './page.css'
import { useClientContext } from '../../../context/ClientContext'
import Link from 'next/link'
import { useState } from 'react'

export default function UserLog({ currentUser }: { currentUser: any }) {
    const { logout } = useClientContext();
    const [showSongModal, setShowSongModal] = useState(false);
    const [songName, setSongName] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleAddSong = () => {
        setShowSongModal(true);
        setSongName('');
        setSongArtist('');
        setImageFile(null);
        setAudioFile(null);
        setError('');
    };

    const handleCloseModal = () => {
        setShowSongModal(false);
        setSongName('');
        setSongArtist('');
        setImageFile(null);
        setAudioFile(null);
        setError('');
    };

    const handleSongSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!songName.trim()) {
            setError('Song name is required');
            return;
        }

        if (!imageFile || !audioFile) {
            setError('Both image and audio files are required');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('audio', audioFile);
            formData.append('song_name', songName.trim());
            formData.append('song_artist', songArtist.trim());
            formData.append('user_id', currentUser?.user_id?.toString() || '');

            const response = await fetch('/api/update-songs', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Song uploaded successfully');
                handleCloseModal();
            } else {
                setError(data.error || 'Failed to upload song');
            }
        } catch (error) {
            console.error('Error uploading song:', error);
            setError('Failed to upload song. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
      <div className="log_container">
          <div className="profile-wrapper">
            <div className="profile-info">
              <img className="profile-cover" src={currentUser?.user_cover || "/background.png"} alt="Profile Cover" />
              <div className="profile-pic-container">
              <div className="profile-pic">
                <img className="profile-image" src={currentUser?.user_profile || "/user.png"} alt="Profile" />
              </div>

              <div className='user-info'>
                <span className="user-name">
                  {currentUser?.user_name || 'Guest'}
                </span>
                <span className="user-email">
                  {currentUser?.user_email || 'No email'}
                </span>
              </div>
              </div>
            </div>
            <div className='profile-content'>
            { !currentUser ? (
            <div className="auth-links">
               <Link href="/log-in" className="auth-link">Login</Link>
               |
               <Link href="/sign-up" className="auth-link">Sign Up</Link>
            </div>
            ) : (
              <>
              <div className='add-songs' onClick={handleAddSong}>
                +
              </div>
              <button type="button" onClick={logout} className="auth-link">Logout</button>
              </>
            )}
            </div>
        </div>

        {showSongModal && (
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Add New Song</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleSongSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="song-name">Song Name</label>
                            <input
                                type="text"
                                id="song-name"
                                value={songName}
                                onChange={(e) => setSongName(e.target.value)}
                                placeholder="Enter song name..."
                                disabled={isUploading}
                                autoFocus
                            />
                            <label htmlFor="song-artist">Song Artist</label>
                            <input
                                type="text"
                                id="song-artist"
                                value={songArtist}
                                onChange={(e) => setSongArtist(e.target.value)}
                                placeholder="Enter song artist..."
                                disabled={isUploading}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="song-image">Cover Image</label>
                            <input
                                type="file"
                                id="song-image"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                disabled={isUploading}
                            />
                            <div className="form-help">
                                Upload an image file (jpg, png, gif, webp, svg)
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="song-audio">Audio File</label>
                            <input
                                type="file"
                                id="song-audio"
                                accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                disabled={isUploading}
                            />
                            <div className="form-help">
                                Upload an audio file (mp3, wav, ogg, etc.)
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
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={isUploading || !songName.trim() || !imageFile || !audioFile}
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
     </div>
  )
}