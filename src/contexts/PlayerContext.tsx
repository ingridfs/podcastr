import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData ={
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPreview: boolean;
  hasNext: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPreview: () => void;
  playRandom: () => void;
  toggleLoop: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
  setPlayingState: (state: boolean) => void;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPreview = currentEpisodeIndex > 0;

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList( list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function playNext() {
    if(isShuffling) {
      playRandom()
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPreview() {
    if(isShuffling) {
      playRandom()
    } else if(hasPreview) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function playRandom() {
    const randomIndex = Math.floor(Math.random() * episodeList.length);
    setCurrentEpisodeIndex(randomIndex);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }
  
  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(false);
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        play, 
        playList,
        playNext,
        playPreview,
        playRandom,
        toggleLoop,
        togglePlay, 
        toggleShuffle, 
        setPlayingState,
        clearPlayerState,
        hasNext,
        hasPreview,
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}