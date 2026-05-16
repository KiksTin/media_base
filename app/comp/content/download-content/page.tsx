
'use client'
import './page.css'
import { useState, useEffect } from 'react';
import { useClientContext } from '../../../context/ClientContext';
import DownloadManager, { DownloadedSong } from '../../../utils/downloadManager';
import { useSongContext } from '../../../context/SongContext';

const DownloadContent = () => {
  const { currentUser } = useClientContext();
  const { setCurrentSong, setIsPlaying } = useSongContext();
  const [downloadedSongs, setDownloadedSongs] = useState<DownloadedSong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDownloadedSongs = () => {
      try {
        const songs = DownloadManager.getDownloadedSongs();
        setDownloadedSongs(songs);
     
        if (currentUser?.user_id) {
          DownloadManager.syncWithServer(currentUser.user_id).then(() => {
            const syncedSongs = DownloadManager.getDownloadedSongs();
            setDownloadedSongs(syncedSongs);
          });
        }
      } catch (error) {
        console.error('Error loading downloaded songs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDownloadedSongs();
  }, [currentUser]);

  const handleRemoveDownload = (songId: number) => {
    if (DownloadManager.removeDownloadedSong(songId)) {
      setDownloadedSongs(DownloadManager.getDownloadedSongs());
    }
  };

  const handleSongClick = (song: DownloadedSong) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const formatDownloadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="download-content">
    <div className="container">
    <div className='header'>
        <h1>Your Downloads</h1>
    </div>
    <div className='select-song'>
      {loading ? (
        <div className="loading">Loading downloads...</div>
      ) : downloadedSongs.length > 0 ? (
        <div className="select-song">
          {downloadedSongs.map((song) => (
            <div key={song.song_id} className="download-item">
              <div className="download-item-info" onClick={() => handleSongClick(song)}>
                <img 
                  src={song.song_image} 
                  alt={song.song_name} 
                  className="download-item-image"
                />
                <div className="download-item-details">
                  <h3 className="download-item-title">{song.song_name}</h3>
                  <p className="download-item-artist">{song.song_artist}</p>
                </div>
              </div>
              <div className="download-item-actions">
                <button 
                  className="remove-download-btn"
                  onClick={() => handleRemoveDownload(song.song_id)}
                  title="Remove from downloads"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-downloads">
          <h2>No downloads yet</h2>
          <p>Start downloading songs to see them here!</p>
        </div>
      )}
    </div>
  </div>
  </div>
  )
}

export default DownloadContent