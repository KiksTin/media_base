interface DownloadedSong {
  song_id: number;
  song_name: string;
  song_artist: string;
  song_image: string;
  song_audio: string;
  song_genre: string;
  download_date: string;
}

class DownloadManager {
  private static readonly STORAGE_KEY = 'downloaded_songs';

  static getDownloadedSongs(): DownloadedSong[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading downloaded songs from localStorage:', error);
      return [];
    }
  }


  static saveDownloadedSongs(songs: DownloadedSong[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(songs));
    } catch (error) {
      console.error('Error saving downloaded songs to localStorage:', error);
    }
  }

  static addDownloadedSong(song: DownloadedSong): boolean {
    try {
      const currentDownloads = this.getDownloadedSongs();
      
      const existingIndex = currentDownloads.findIndex(s => s.song_id === song.song_id);
      
      if (existingIndex !== -1) {
        currentDownloads[existingIndex] = song;
      } else {
        currentDownloads.unshift(song);
      }
      
      if (currentDownloads.length > 50) {
        currentDownloads.splice(50);
      }
      
      this.saveDownloadedSongs(currentDownloads);
      return true;
    } catch (error) {
      console.error('Error adding downloaded song:', error);
      return false;
    }
  }

  static removeDownloadedSong(songId: number): boolean {
    try {
      const currentDownloads = this.getDownloadedSongs();
      const filteredDownloads = currentDownloads.filter(s => s.song_id !== songId);
      
      if (filteredDownloads.length !== currentDownloads.length) {
        this.saveDownloadedSongs(filteredDownloads);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing downloaded song:', error);
      return false;
    }
  }

  static isSongDownloaded(songId: number): boolean {
    const downloads = this.getDownloadedSongs();
    return downloads.some(song => song.song_id === songId);
  }

  static getDownloadDate(songId: number): string | null {
    const downloads = this.getDownloadedSongs();
    const song = downloads.find(s => s.song_id === songId);
    return song ? song.download_date : null;
  }

 
  static clearAllDownloads(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing downloads:', error);
    }
  }

  static async downloadSong(songId: number, userId: number): Promise<DownloadedSong | null> {
    try {
      const response = await fetch('/api/download-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          song_id: songId,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.song) {
        this.addDownloadedSong(data.song);
        return data.song;
      } else {
        throw new Error(data.error || 'Failed to download song');
      }
    } catch (error) {
      console.error('Error downloading song:', error);
      return null;
    }
  }

  static async syncWithServer(userId: number): Promise<void> {
    try {
      const response = await fetch(`/api/download-song?user_id=${userId}`);
      
      if (response.ok) {
        const serverDownloads = await response.json();
        this.saveDownloadedSongs(serverDownloads);
      }
    } catch (error) {
      console.error('Error syncing downloads with server:', error);
    }
  }
}

export default DownloadManager;
export type { DownloadedSong };
