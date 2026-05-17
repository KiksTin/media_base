'use client'
import './page.css'
import { useClientContext } from '../../../context/ClientContext'
import Link from 'next/link'
import { useState } from 'react'
import Recent from './recents/page'
import Upload from './upload/page'
import Comment from './comment/page'


export default function UserLog({ currentUser }: { currentUser: any }) {
    const { logout } = useClientContext();
    const [showSongModal, setShowSongModal] = useState(false);
    const [songName, setSongName] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [showChangeUsername, setShowChangeUsername] = useState(false);
    const [showChangeProfile, setShowChangeProfile] = useState(false);
    const [showChangeCover, setShowChangeCover] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Email change state
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');

    // Username change state
    const [newUsername, setNewUsername] = useState('');
    const [usernamePassword, setUsernamePassword] = useState('');

    // Profile picture change state
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Cover picture change state
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [isUpdatingCover, setIsUpdatingCover] = useState(false);

    // Delete account state
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);



    const handleCloseModal = () => {
        setShowSongModal(false);
        setSongName('');
        setSongArtist('');
        setImageFile(null);
        setAudioFile(null);
        setError('');
        setShowSettings(false);
        setShowChangePassword(false);
        setShowChangeEmail(false);
        setShowChangeUsername(false);
        setShowChangeProfile(false);
        setShowChangeCover(false);
        setShowDeleteAccount(false);
    };
     const handleSongModal = () => {
        setShowSongModal(true);
        setSongName('');
        setSongArtist('');
        setImageFile(null);
        setAudioFile(null);
        setError('');
        setShowSettings(false);
        setShowChangePassword(false);
        setShowChangeEmail(false);
        setShowChangeUsername(false);
        setShowChangeProfile(false);
        setShowChangeCover(false);
        setShowDeleteAccount(false);
    };

    const handleSettings = () => {
        if (showSettings) {
            setShowSettings(false);
            setShowChangePassword(false);
            setShowChangeEmail(false);
            setShowChangeUsername(false);
            setShowChangeProfile(false);
            setShowChangeCover(false);
            setShowDeleteAccount(false);
            return;
        }
        setShowSettings(true);
        setShowSongModal(false);

    };

    const handleChangePassword = () => {
        setShowChangePassword(true);
        setShowSettings(false);
    };

    const handleChangeEmail = () => {
        setShowChangeEmail(true);
        setShowSettings(false);
    };

    const handleChangeUsername = () => {
        setShowChangeUsername(true);
        setShowSettings(false);
    };

    const handleChangeProfile = () => {
        setShowChangeProfile(true);
        setShowSettings(false);
    };

    const handleChangeCover = () => {
        setShowChangeCover(true);
        setShowSettings(false);
    };

    const handleDeleteAccount = () => {
        setShowDeleteAccount(true);
        setShowSettings(false);
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

    const handleChangePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setError('');

        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser?.user_id,
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleCloseModal();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password. Please try again.');
        }
    };

    const handleChangeEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEmail || !emailPassword) {
            setError('All fields are required');
            return;
        }

        setError('');

        try {
            const response = await fetch('/api/change-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser?.user_id,
                    new_email: newEmail,
                    password: emailPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleCloseModal();
                setNewEmail('');
                setEmailPassword('');
                window.location.reload();
            } else {
                setError(data.error || 'Failed to change email');
            }
        } catch (error) {
            console.error('Error changing email:', error);
            setError('Failed to change email. Please try again.');
        }
    };

    const handleChangeUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newUsername || !usernamePassword) {
            setError('All fields are required');
            return;
        }

        setError('');

        try {
            const response = await fetch('/api/change-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser?.user_id,
                    new_username: newUsername,
                    password: usernamePassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleCloseModal();
                setNewUsername('');
                setUsernamePassword('');
                // Refresh the page to update the username
                window.location.reload();
            } else {
                setError(data.error || 'Failed to change username');
            }
        } catch (error) {
            console.error('Error changing username:', error);
            setError('Failed to change username. Please try again.');
        }
    };

    const handleChangeProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileImageFile) {
            setError('Profile image is required');
            return;
        }

        setIsUpdatingProfile(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', profileImageFile);
            formData.append('user_id', currentUser?.user_id?.toString() || '');

            const response = await fetch('/api/change-profile', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleCloseModal();
                setProfileImageFile(null);
                // Refresh the page to update the profile picture
                window.location.reload();
            } else {
                setError(data.error || 'Failed to change profile picture');
            }
        } catch (error) {
            console.error('Error changing profile picture:', error);
            setError('Failed to change profile picture. Please try again.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangeCoverSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coverImageFile) {
            setError('Cover image is required');
            return;
        }

        setIsUpdatingCover(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', coverImageFile);
            formData.append('user_id', currentUser?.user_id?.toString() || '');

            const response = await fetch('/api/change-cover', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleCloseModal();
                setCoverImageFile(null);
                // Refresh the page to update the cover picture
                window.location.reload();
            } else {
                setError(data.error || 'Failed to change cover picture');
            }
        } catch (error) {
            console.error('Error changing cover picture:', error);
            setError('Failed to change cover picture. Please try again.');
        } finally {
            setIsUpdatingCover(false);
        }
    };

    const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!deletePassword || !deleteConfirm) {
            setError('Password and confirmation are required');
            return;
        }

        setError('');

        try {
            const response = await fetch('/api/delete-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser?.user_id,
                    password: deletePassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                logout();
                window.location.href = '/';
            } else {
                setError(data.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Failed to delete account. Please try again.');
        }
    };

    return (
      <div className="log_container">
          <div className="profile-wrapper">
            <div className="profile-info">
              <div className="profile-cover-container">
                <div className="profile-cover-overlay"></div>
                <img className="profile-cover" src={currentUser?.user_cover || "/background.png"} alt="Profile Cover" />
              </div>
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

               <div className='profile-setting-container'>
                <button type="button" title="More" className='profile-setting-button' onClick={handleSettings}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-text)">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
                </button>
                {showSettings && (
                    <>
                  <div className="profile-settings-drop">
                    <button type="button" onClick={handleChangePassword}>Change Password</button>
                    <button type="button" onClick={handleChangeEmail}>Change Email</button>
                    <button type="button" onClick={handleChangeUsername}>Change Username</button>
                    <button type="button" onClick={handleChangeProfile}>Change Profile Picture</button>
                    <button type="button" onClick={handleChangeCover}>Change Cover Picture</button>
                    <button type="button" onClick={handleDeleteAccount}>Delete Account</button>
                    <button type="button" onClick={logout}>Logout</button>
                  </div>
                  </>
                )}
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
            <div>
              <div className='user-dashboard'>
                <div className='dashboard-content'>
                    <div className='songs-cards'>
                    <div className='dashboard-card'>
                        <span>
                            <h4>Uploads</h4>
                        </span>
                        <div className='upload-container'>
                        <Upload currentUser={currentUser}/>
                        <div onClick={handleSongModal} className='add-songs'><h2>+</h2></div>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <span><h4>Recents</h4></span>
                        <Recent currentUser={currentUser}/>
                    </div>
                    </div>
                    <div className='dashboard-card'>
                        <span><h4>Comments</h4></span>
                        <Comment currentUser={currentUser}/>
                    </div>
                </div>
              </div>
            </div>
            )}
            </div>
        </div>

      
        {showChangePassword && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Change Password</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleChangePasswordSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="current-password">Current Password</label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password..."
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password..."
                            />
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
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={!currentPassword || !newPassword || !confirmPassword}
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}
          {showSongModal && (
            <>
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
            </>
        )}


        {showChangeEmail && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Change Email</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleChangeEmailSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="new-email">New Email</label>
                            <input
                                type="email"
                                id="new-email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter new email..."
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-password">Password</label>
                            <input
                                type="password"
                                id="email-password"
                                value={emailPassword}
                                onChange={(e) => setEmailPassword(e.target.value)}
                                placeholder="Enter your password..."
                            />
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
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={!newEmail || !emailPassword}
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}

        {showChangeUsername && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Change Username</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleChangeUsernameSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="new-username">New Username</label>
                            <input
                                type="text"
                                id="new-username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter new username..."
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username-password">Password</label>
                            <input
                                type="password"
                                id="username-password"
                                value={usernamePassword}
                                onChange={(e) => setUsernamePassword(e.target.value)}
                                placeholder="Enter your password..."
                            />
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
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={!newUsername || !usernamePassword}
                            >
                                Change Username
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}

        {showChangeProfile && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Change Profile Picture</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleChangeProfileSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="profile-image">Profile Picture</label>
                            <input
                                type="file"
                                id="profile-image"
                                accept="image/*"
                                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                                disabled={isUpdatingProfile}
                                autoFocus
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
                                disabled={isUpdatingProfile}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={!profileImageFile || isUpdatingProfile}
                            >
                                {isUpdatingProfile ? 'Updating...' : 'Update Picture'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}
        {showChangeCover && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Change Cover Picture</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleChangeCoverSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <label htmlFor="cover-image">Cover Picture</label>
                            <input
                                type="file"
                                id="cover-image"
                                accept="image/*"
                                onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                                disabled={isUpdatingCover}
                                autoFocus
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
                                disabled={isUpdatingCover}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                disabled={!coverImageFile || isUpdatingCover}
                            >
                                {isUpdatingCover ? 'Updating...' : 'Update Picture'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}

        {showDeleteAccount && (
            <>
            <div className="playlist-modal-overlay" onClick={handleCloseModal}>
                <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="playlist-modal-header">
                        <h2>Delete Account</h2>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                    </div>
                    <form onSubmit={handleDeleteAccountSubmit} className="playlist-modal-form">
                        <div className="form-group">
                            <p className="warning-text">Are you sure you want to delete your account? This action cannot be undone.</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="delete-password">Password</label>
                            <input
                                type="password"
                                id="delete-password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Enter your password to confirm..."
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.checked)}
                                />
                                I understand that this action cannot be undone
                            </label>
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
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="delete-btn"
                                disabled={!deletePassword || !deleteConfirm}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}
     </div>
  )
}