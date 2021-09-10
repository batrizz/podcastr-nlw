import { createContext, useState, ReactNode } from 'react';

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode
}
export const PlayerContexts = createContext({} as PlayerContextData);

export function PlayerContextsProvider({ children }: PlayerContextProviderProps) {
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random () * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if ( isShuffling || (currentEpisodeIndex + 1) < episodeList.length){
    setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }
}

  function playPrevious(){
    if(currentEpisodeIndex > 0)
    setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  

  return(
    <PlayerContexts.Provider 
    value={{
      episodeList, 
      currentEpisodeIndex, 
      play,
      playList,
      isLooping,
      isShuffling,
      toggleShuffle,
      toggleLoop,
      playNext,
      playPrevious,
      isPlaying, 
      togglePlay,
      clearPlayerState,
      }}>
        { children }
    </PlayerContexts.Provider>
  )
}