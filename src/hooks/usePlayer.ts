import { useCallback, useEffect, useState } from "react";
import { draw } from "@utils";

export function usePlayer() {
  const [isPaused, setIsPaused] = useState(true);

  const drawFrame = useCallback(() => {
    draw();
    console.log("draw");

    requestAnimationFrame(drawFrame);
  }, []);

  const play = useCallback(async () => {
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");

    if (!frameVideo || !mainVideo) return;

    await frameVideo.play();
    await mainVideo.play();
    requestAnimationFrame(drawFrame);
    setIsPaused(false);
  }, [drawFrame]);

  const pause = useCallback(() => {
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

    if (!mainVideo || !frameVideo) return;

    frameVideo.pause();
    mainVideo.pause();
    setIsPaused(true);
  }, []);

  useEffect(() => {
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

    if (!frameVideo || !mainVideo) return;

    const handleTimeUpdate = () =>
      (frameVideo.currentTime = mainVideo.currentTime + 0.4);

    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");
    const onLoadedMetaData = () => draw();

    frameVideo?.addEventListener("loadedmetadata", onLoadedMetaData);

    return () => {
      frameVideo?.removeEventListener("loadedmetadata", onLoadedMetaData);
    };
  }, []);

  useEffect(() => {
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");
    const handlePause = () => setIsPaused(true);

    frameVideo?.addEventListener("ended", handlePause);

    return () => {
      frameVideo?.removeEventListener("ended", handlePause);
    };
  }, []);

  return {
    play,
    pause,
    isPaused,
  };
}
