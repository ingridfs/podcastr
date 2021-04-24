import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

export function Player() {

  const audioRef = useRef<HTMLAudioElement>(null)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

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
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? (
               <Slider 
                handleStyle={{'border': '3px solid #04D361'}}
                trackStyle={{'backgroundColor': '#04D361'}} 
                railStyle={{'backgroundColor': '#9F75FF'}}  
                activeDotStyle={{'borderColor': '#04D361'}}
               />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>

          { episode && (
            <audio 
              src={episode.url} 
              ref={audioRef}
              autoPlay
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              >
              O seu navegador não suporta o elemento <code>audio</code>.
            </audio>
          )}
        </div>

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode}>
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
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Próximo"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>

        </div>
      </footer>
    </div>
  );
}