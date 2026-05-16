'use client'
import { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
  song_id: number;
  song_name: string;
  song_artist: string;
  song_audio: string;
  song_image: string;
}

interface SongContextType {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSongContext must be used within a SongProvider');
  }
  return context;
};

export const SongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SongContext.Provider value={{ currentSong, setCurrentSong, isPlaying, setIsPlaying, playlist, setPlaylist, currentIndex, setCurrentIndex }}>
      {children}
    </SongContext.Provider>
  );
};
