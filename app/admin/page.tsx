"use client";
import { useState, useEffect } from 'react';
import { useClientContext } from '../context/ClientContext';
import Link from 'next/link';
import './page.css';

export default function AdminDashboard() {
    const { currentUser } = useClientContext();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is admin (for demo, we'll check if username is 'admin')
    const isAdmin = currentUser?.user_name === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            setError('Access denied. Admin only.');
            return;
        }
        fetchData();
    }, [activeTab, isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            let endpoint = '';
            switch (activeTab) {
                case 'users':
                    endpoint = '/api/admin/get-all-users';
                    break;
                case 'songs':
                    endpoint = '/api/admin/get-all-songs';
                    break;
                case 'playlists':
                    endpoint = '/api/admin/get-all-playlists';
                    break;
                case 'comments':
                    endpoint = '/api/admin/get-all-comments';
                    break;
            }

            const response = await fetch(endpoint);
            const data = await response.json();

            if (response.ok && data.success) {
                switch (activeTab) {
                    case 'users':
                        setUsers(data.users);
                        break;
                    case 'songs':
                        setSongs(data.songs);
                        break;
                    case 'playlists':
                        setPlaylists(data.playlists);
                        break;
                    case 'comments':
                        setComments(data.comments);
                        break;
                }
            } else {
                setError(data.error || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type: string, id: number) => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) {
            return;
        }

        try {
            let endpoint = '';
            switch (type) {
                case 'user':
                    endpoint = '/api/admin/delete-user';
                    break;
                case 'song':
                    endpoint = '/api/admin/delete-song';
                    break;
                case 'playlist':
                    endpoint = '/api/admin/delete-playlist';
                    break;
                case 'comment':
                    endpoint = '/api/admin/delete-comment';
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                fetchData();
            } else {
                setError(data.error || `Failed to delete ${type}`);
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            setError(`Failed to delete ${type}. Please try again.`);
        }
    };

    if (!isAdmin) {
        return (
            <div className="admin-dashboard">
                <div className="admin-error">
                    <h2>Access Denied</h2>
                    <p>{error || 'You do not have permission to access this page.'}</p>
                    <Link href="/">Go to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <Link href="/" className="back-link">Back to Home</Link>
            </div>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={activeTab === 'songs' ? 'active' : ''}
                    onClick={() => setActiveTab('songs')}
                >
                    Songs
                </button>
                <button
                    className={activeTab === 'playlists' ? 'active' : ''}
                    onClick={() => setActiveTab('playlists')}
                >
                    Playlists
                </button>
                <button
                    className={activeTab === 'comments' ? 'active' : ''}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>
            </div>

            <div className="admin-content">
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Loading...</div>}

                {activeTab === 'users' && (
                    <div className="admin-table">
                        <h2>All Users</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id}</td>
                                        <td>{user.user_name}</td>
                                        <td>{user.user_email}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('user', user.user_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'songs' && (
                    <div className="admin-table">
                        <h2>All Songs</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Artist</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {songs.map(song => (
                                    <tr key={song.song_id}>
                                        <td>{song.song_id}</td>
                                        <td>{song.song_name}</td>
                                        <td>{song.song_artist}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('song', song.song_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="admin-table">
                        <h2>All Playlists</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>User ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playlists.map(playlist => (
                                    <tr key={playlist.playlist_id}>
                                        <td>{playlist.playlist_id}</td>
                                        <td>{playlist.playlist_name}</td>
                                        <td>{playlist.user_id}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('playlist', playlist.playlist_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="admin-table">
                        <h2>All Comments</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Text</th>
                                    <th>User ID</th>
                                    <th>Song ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map(comment => (
                                    <tr key={comment.comment_id}>
                                        <td>{comment.comment_id}</td>
                                        <td>{comment.comment_text}</td>
                                        <td>{comment.user_id}</td>
                                        <td>{comment.song_id}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete('comment', comment.comment_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
