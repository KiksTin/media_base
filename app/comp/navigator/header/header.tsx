
import './header.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSongContext } from '../../../context/SongContext'

export default function Header({currentUser}: {currentUser: any}) {
  const { setCurrentSong, setIsPlaying } = useSongContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-songs?q=${encodeURIComponent(query.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSongSelect = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header>
      <div className="header_container">
        <div className='logo'>
          <Link href="/"><img src="/logo.png" alt="Logo" /></Link>
          <h1>Media Base</h1>
          </div>
        <div className='search-container'>
          <div className='search-input-wrapper'>
            <input 
              type="search" 
              placeholder="Search songs, artists..." 
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              className="search-input"
            />
            {isSearching && <div className="search-spinner">⏳</div>}
          </div>
          
          {showResults && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((song: any) => (
                  <div 
                    key={song.song_id} 
                    className="search-result-item"
                    onClick={() => handleSongSelect(song)}
                  >
                    <img 
                      src={song.song_image} 
                      alt={song.song_name} 
                      className="search-result-image"
                    />
                    <div className="search-result-info">
                      <div className="search-result-title">{song.song_name}</div>
                      <div className="search-result-artist">{song.song_artist}</div>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim().length >= 2 ? (
                <div className="search-no-results">No songs found</div>
              ) : null}
            </div>
          )}
        </div>
        <div className='links'>
          <Link href="/about">
           <svg className='h-icon' viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" >
           <path d='M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/>
           </svg>
          </Link>
          <Link href="#contact">
            <svg className='h-icon' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24">
              <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c1.8,0,3.5-0.5,5-1.3c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4c0,0,0,0,0,0c-3.8,2.2-8.7,0.9-10.9-2.9C2.9,12.2,4.2,7.3,8,5.1c3.8-2.2,8.7-0.9,10.9,2.9c0.7,1.2,1.1,2.6,1.1,4v0.8c0,1-0.8,1.8-1.8,1.8s-1.8-0.8-1.8-1.8V8.5c0-0.6-0.4-1-1-1c-0.5,0-0.9,0.3-1,0.8c-2-1.4-4.9-0.9-6.3,1.1c-1.4,2-0.9,4.9,1.1,6.3c1.9,1.3,4.4,1,5.9-0.7c1.3,1.6,3.6,1.9,5.2,0.7c0.9-0.7,1.5-1.8,1.5-3V12C22,6.5,17.5,2,12,2z M12,14.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5C14.5,13.4,13.4,14.5,12,14.5z"/>
            </svg>
          </Link>
            |
          <div className='user-log-container'>
                <Link href="/profile"><img className='user-icon-longged-in' src={currentUser?.user_profile || "/user.png"} alt="User"/></Link>
          </div>
            
        </div>
      </div>
        
    </header>
  )
}
