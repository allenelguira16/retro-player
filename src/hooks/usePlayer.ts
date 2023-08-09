import { useCallback, useEffect, useState } from "react";
import { draw } from "../utils";

export function usePlayer(renderType: "ascii" | "8bit") {
  const [isPaused, setIsPaused] = useState(true);

  const drawFrame = async () => {
    draw(renderType);

    requestAnimationFrame(drawFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const play = useCallback(async () => {
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");

    if (!frameVideo || !mainVideo) return;

    await frameVideo.play();
    await mainVideo.play();
    requestAnimationFrame(drawFrame);
    setIsPaused(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pause = useCallback(() => {
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

    if (!mainVideo || !frameVideo) return;

    frameVideo.pause();
    mainVideo.pause();
    setIsPaused(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

    if (!frameVideo || !mainVideo) return;

    const handleTimeUpdate = () => {
      frameVideo.currentTime = mainVideo.currentTime + 0.2;
    };

    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document
      .querySelector<HTMLVideoElement>("#frame")
      ?.addEventListener("loadedmetadata", () => {
        draw(renderType);
      });
  }, [renderType]);

  useEffect(() => {
    document
      .querySelector<HTMLVideoElement>("#frame")
      ?.addEventListener("ended", () => {
        setIsPaused(true);
      });
  }, []);

  return {
    play,
    pause,
    isPaused,
  };
}
