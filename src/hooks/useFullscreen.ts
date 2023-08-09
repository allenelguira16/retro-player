import { useState, useEffect } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.addEventListener("fullscreenchange", async (event) => {
      event.stopPropagation();
      event.preventDefault();

      setIsFullscreen(!isFullscreen);
    });
  }, [isFullscreen]);

  const onFullscreen = async () => {
    const playerElement = document.querySelector<HTMLDivElement>("body");
    if (!playerElement) return;

    if (!isFullscreen) await playerElement.requestFullscreen();
    else await document.exitFullscreen();

    // setIsFullscreen(!isFullscreen);
  };

  return [isFullscreen, onFullscreen] as const;
}
