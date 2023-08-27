import { useState, useEffect } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullScreen = async (event: Event) => {
      event.stopPropagation();
      event.preventDefault();

      setIsFullscreen(!isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreen);
    };
  }, [isFullscreen]);

  const onFullscreen = async () => {
    const playerElement = document.querySelector<HTMLDivElement>("body");
    if (!playerElement) return;

    if (!isFullscreen) await playerElement.requestFullscreen();
    else await document.exitFullscreen();
  };

  return [isFullscreen, onFullscreen] as const;
}
