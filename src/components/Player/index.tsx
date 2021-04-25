import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    setPlayingState,
    playNext,
    playPreview,
    toggleShuffle,
    clearPlayerState,
    hasNext, 
    hasPreview,
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex];
  const [progress, setProgress] = useState(0);

  useEffect( () => {
    if(!audioRef.current) {
      return
    } 
    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      isPlaying
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(audioRef.current.currentTime)
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
      setProgress(0)
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {
        episode ? (
          <div className={styles.currentEpisode}>
            <Image 
              width={592} 
              height={592} 
              objectFit="cover"
              src={episode.thumbnail} 
              alt={episode.title}
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(Math.floor(progress))}</span>
          <div className={styles.slider}>
            { episode ? (
               <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                handleStyle={{'border': '3px solid #04D361'}}
                trackStyle={{'backgroundColor': '#04D361'}} 
                railStyle={{'backgroundColor': '#9F75FF'}}  
                activeDotStyle={{'borderColor': '#04D361'}}
               />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>

          { episode && (
            <audio 
              src={episode.url} 
              ref={audioRef}
              autoPlay
              loop={isLooping}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
              onEnded={handleEpisodeEnded}
              >
              O seu navegador não suporta o elemento <code>audio</code>.
            </audio>
          )}
        </div>

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1} 
            onClick={toggleShuffle} 
            className={ isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>

          <button type="button" disabled={!episode || !hasPreview} onClick={playPreview}>
            <img src="/play-previous.svg" alt="Voltar"/>
          </button>

          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode} 
            onClick={togglePlay}
          >
            { isPlaying ? 
              <img src="/pause.svg" alt="Pausar"/>
               : 
              <img src="/play.svg" alt="Tocar"/>
            }
          </button>

          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Próximo"/>
          </button>

          <button 
            type="button" 
            disabled={!episode} 
            onClick={toggleLoop} 
            className={ isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>
    </div>
  );
}