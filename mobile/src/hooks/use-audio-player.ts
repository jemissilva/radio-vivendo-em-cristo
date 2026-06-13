import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

export function useAudioPlayer(streamUrl: string) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        void soundRef.current.unloadAsync();
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (isPlaying && soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
      );
      soundRef.current = sound;
    } else {
      await soundRef.current.playAsync();
    }

    setIsPlaying(true);
    setIsLoading(false);
  };

  return {
    isPlaying,
    isLoading,
    togglePlayback,
  };
}