"use client";
import { useState, useEffect } from 'react';
import { useClientContext } from '../context/ClientContext';
import Link from 'next/link';
import './page.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [loginLogs, setLoginLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [newUser, setNewUser] = useState({ user_name: '', user_password: '', user_email: '' });
    const { logout } = useClientContext();
    const [showAdminLogIn, setShowAdminLogIn] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
    const [attempt, setAttempt] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const isAdminLoggedIn = sessionStorage.getItem('isAdmin');
        if (isAdminLoggedIn === 'true') {
            setIsAdmin(true);
        }
    }, []);

    const handleAdminLogIn = () => {
        setShowAdminLogIn(true);
    };

    const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminCredentials({
            ...adminCredentials,
            [e.target.id]: e.target.value
        });
    };

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
                case 'logs':
                    endpoint = '/api/admin/get-login-logs';
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
                    case 'logs':
                        setLoginLogs(data.logs);
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

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newUser.user_name || !newUser.user_password) {
            alert('Username and password are required');
            return;
        }

        try {
            const response = await fetch('/api/admin/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('User added successfully');
                setNewUser({ user_name: '', user_password: '', user_email: '' });
                setShowAddUserForm(false);
                fetchData();
            } else {
                alert(data.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        }
    };
   
    //ADMIN VALIDATE
     async function validate(e: React.FormEvent) {
        e.preventDefault();

        const { username, password } = adminCredentials;

        if (!username || !password) {
            alert("Username and password are required");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/admin-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ admin_name: username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                sessionStorage.setItem('isAdmin', 'true');
                console.log('Login successful, redirecting...');
                setIsAdmin(true);
            } else {
                setAttempt(prev => prev - 1);
                alert(data.error || `You have left ${attempt - 1} attempt(s)`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    if (!isAdmin) {
        //ADMIN LOGIN
        if (showAdminLogIn) {
            return (
                <div className="admin-login">
                    <div className="admin-login-container">
                        <h2>Admin Login</h2>
                        <form onSubmit={validate}>
                            <input
                                type="text"
                                placeholder="Admin name"
                                id="username"
                                value={adminCredentials.username}
                                onChange={handleAdminInputChange}
                                disabled={isLoading || attempt === 0}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                id="password"
                                value={adminCredentials.password}
                                onChange={handleAdminInputChange}
                                disabled={isLoading || attempt === 0}
                            />
                            <button
                                type="submit"
                                id="submit"
                                disabled={isLoading || attempt === 0}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                            <hr/>
                            <Link href="/">
                                <button type="button" disabled={isLoading}>Go back as User</button>
                            </Link>
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <div className="admin-dashboard">
                <div className="admin-error">
                    <h2>Access Denied</h2>
                    <p>{error || 'You do not have permission to access this page.'}</p>
                    <button type="button" onClick={handleAdminLogIn} className="enter-admin-btn">Enter As Admin</button>
                    <Link href="/">Go to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <span>
                <img className="admin-logo" src="/logo.png" alt="Logo" />
                <h1>Admin Dashboard</h1>
                </span>
                <button onClick={() => logout()} className="logout-btn">Logout</button>
            </div>
        <div className="admin-content-wrapper">
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
                <button
                    className={activeTab === 'logs' ? 'active' : ''}
                    onClick={() => setActiveTab('logs')}
                >
                    Login Logs
                </button>
            </div>

            <div className="admin-content">
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Loading...</div>}

                {activeTab === 'users' && (
                    <div className="admin-table">
                        <div className="admin-table-header">
                            <h1>All Users</h1>
                            <h2 onClick={() => setShowAddUserForm(true)} className="add-btn">Add User</h2>
                        </div>
                        <div className='admin-table-content'>
                        {showAddUserForm && (
                            <div className="add-user-form">
                                <h3>Add New User</h3>
                                <form onSubmit={handleAddUser}>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={newUser.user_name}
                                        onChange={(e) => setNewUser({...newUser, user_name: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newUser.user_password}
                                        onChange={(e) => setNewUser({...newUser, user_password: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email (optional)"
                                        value={newUser.user_email}
                                        onChange={(e) => setNewUser({...newUser, user_email: e.target.value})}
                                    />
                                    <button type="submit">Add User</button>
                                    <button type="button" onClick={() => setShowAddUserForm(false)}>Cancel</button>
                                </form>
                            </div>
                        )}
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
                    </div>
                )}

                {activeTab === 'songs' && (
                    <div className="admin-table">
                        <h1>All Songs</h1>
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
                        <h1>All Playlists</h1>
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

                {activeTab === 'logs' && (
                    <div className="admin-table">
                        <h1>Login Attempts</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                    <th>Success</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginLogs.map(log => (
                                    <tr key={log.log_id}>
                                        <td>{log.log_id}</td>
                                        <td>{log.user_name}</td>
                                        <td>{log.attempt_time}</td>
                                        <td>{log.attempt_date}</td>
                                        <td>{log.success ? <p className="success">Successfully Logged In</p> : <p className="failure">Failed to Login</p>}</td>
                                        <td>{log.ip_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
            </div>
            </div>
        </div>
    );
}
