'use client'
import "./page.css";
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { useSongContext } from '../../context/SongContext';
import { useClientContext } from '../../context/ClientContext';

const Player = ({}) => {
  
  const { currentSong, isPlaying, setIsPlaying } = useSongContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentUser } = useClientContext();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastPlayedSong, setLastPlayedSong] = useState<number | null>(null);

  useEffect(() => {
    if (currentSong?.song_id && currentSong.song_id && currentUser?.user_id && currentUser.user_id !== lastPlayedSong) {
      fetch('/api/add-recently-played', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          song_id: currentSong.song_id,
          user_id: currentUser.user_id
        })
      }).catch(error => console.error('Failed to add recently played:', error));
      
      setLastPlayedSong(currentSong.song_id && currentUser.user_id);
    
    }
  }, [currentSong, lastPlayedSong]);

  useEffect(() => {
    const audio = audioRef.current;
    const songSlider = document.getElementById('audio-range');
    if (!audio || !songSlider) return;

    const playpauseBtn = document.querySelector('.custom-play-btn');

    const disc = document.getElementById('disc');
    const discImg = document.getElementById('disc-img');

    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');

    songSlider.addEventListener("change", function() {
      audio.currentTime = parseFloat((songSlider as HTMLInputElement).value);
    })
    
    function moveSlider() {
      if (audio && songSlider) {
        (songSlider as HTMLInputElement).value = audio.currentTime.toString();
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
        (songSlider as HTMLInputElement).max = (audio.duration || 0).toString();
      }
    };

    const intervalId = setInterval(moveSlider, 1000);

    const handlePlayPause = () => {
      if (audio) {
        if (audio.paused) {
          audio.play();
          console.log('Playing');
          setIsPlaying(true);

          if (playBtn) playBtn.classList.add('hidden');
          if (pauseBtn) pauseBtn.classList.remove('hidden');
          if (disc && discImg) {
            disc.classList.add('rotate');
            discImg.classList.add('rotate');
          }
        } else {
          audio.pause();
          setIsPlaying(false);
          if (playBtn) playBtn.classList.remove('hidden');
          if (pauseBtn) pauseBtn.classList.add('hidden');
          if (disc && discImg) {
            disc.classList.remove('rotate');
            discImg.classList.remove('rotate');
          }
        }
      }
    };

    if (playpauseBtn) playpauseBtn.addEventListener('click', handlePlayPause);

    return () => {
      clearInterval(intervalId);
      if (playpauseBtn) playpauseBtn.removeEventListener('click', handlePlayPause);
    };

  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      audio.src = currentSong.song_audio;
    }
  }, [currentSong]);

  return (
    <div className='player'>
      <div className='disc' id='disc'>
        <img className='disc-img' id='disc-img' alt='Disc' src={currentSong?.song_image || "./logo.png"} />
      </div>
      <br />

      <div className='song-info'>
        <div className='song-name'>
          <h2 className='song-name-text'>
            {currentSong?.song_name || 'No song selected'}
          </h2>
          <p className='song-artist-text'>
            {currentSong?.song_artist || ''}
          </p>
        </div>
        <div className="song-stat-container">
          <div className="audio-range-container">
            <span>{formatTime(currentTime)}</span>
            <input aria-label="Audio range" type="range" id="audio-range" min="0" max={duration || 0} className="audio-range" />
            <span>{formatTime(duration)}</span>
          </div>
          <audio
            ref={audioRef}
            id="main-audio"
          />
          <div className="custom-controls">
            <div className="custom-controls-left">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <g id="Skip-Previous-Fill">
                  <path id="Union" fill="#000000" d="M6 19.5H4v-15h2zM18.5742 4.59571c0.2854 -0.1344 0.6204 -0.12748 0.9024 0.02539 0.3223 0.17491 0.5234 0.5122 0.5234 0.8789v13c0 0.3667 -0.2011 0.704 -0.5234 0.8789 -0.3222 0.1747 -0.7142 0.1596 -1.0215 -0.04l-10.00002 -6.5C8.17129 12.6544 8 12.3385 8 12c0.00001 -0.3385 0.17129 -0.6544 0.45508 -0.8389L18.4551 4.66114z" strokeWidth="1"></path>
                </g>
              </svg>
            </div>
            <div className="custom-play-btn" title="Play">
              <button type="button" className="play-btn" id="play-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="50" width="50" aria-label="Play">
                <g id="Play-Arrow-Fill">
                    <path id="Union" fill="#000000" d="M7.51855 4.12297c0.3199 -0.17556 0.71069 -0.16266 1.01856 0.0332L19.5371 11.1562c0.2883 0.1835 0.4628 0.502 0.4629 0.8437 0 0.3419 -0.1746 0.6602 -0.4629 0.8438l-10.99999 7c-0.30792 0.1959 -0.69861 0.2088 -1.01856 0.0332C7.19869 19.7012 7 19.3649 7 18.9999V4.99992c0.00008 -0.36488 0.1987 -0.70135 0.51855 -0.87695" strokeWidth="1"></path>
                </g>
              </svg>
              </button>
              <button type="button" className="pause-btn hidden" id="pause-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Controls-Pause--Streamline-Ultimate" height="38" width="38" aria-label="Pause">
                  <g id="Controls-Pause--Streamline-Ultimate.svg">
                    <path d="M4.5 1h4S10 1 10 2.5v19S10 23 8.5 23h-4S3 23 3 21.5v-19S3 1 4.5 1" fill="#000000" strokeWidth="0"></path>
                    <path d="M15.5 1h4S21 1 21 2.5v19s0 1.5 -1.5 1.5h-4S14 23 14 21.5v-19S14 1 15.5 1" fill="#000000" strokeWidth="0"></path>
                  </g>
                </svg></button>
            </div>
            <div className="custom-controls-right">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <g id="Skip-Next-Fill">
                  <path id="Union" fill="#000000" d="M6 19.5H4v-15h2zM19.4043 4.59571c0.2854 -0.1344 0.6204 -0.12748 0.9024 0.02539 0.3223 0.17491 0.5234 0.5122 0.5234 0.8789v13c0 0.3667 -0.2011 0.704 -0.5234 0.8789 -0.3222 0.1747 -0.7142 0.1596 -1.0215 -0.04l-10.00002 -6.5C8.17129 12.6544 8 12.3385 8 12c0.00001 -0.3385 0.17129 -0.6544 0.45508 -0.8389L19.3389 4.66114z" strokeWidth="1"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Player;
