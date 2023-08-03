import { RefObject, useEffect } from "react";
import { getCharacter } from "./getCharacter";

type UsePlayerProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  mainVideoRef: RefObject<HTMLVideoElement>;
  frameVideoRef: RefObject<HTMLVideoElement>;
};

export function usePlayer(renderType: 'ascii' | '8bit', {
  canvasRef,
  frameVideoRef,
  mainVideoRef,
}: UsePlayerProps) {
  useEffect(() => {
    const cellSize = renderType === 'ascii' ? 5 : 10;
    const canvas = canvasRef.current;
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!canvas || !mainVideo || !frameVideo) return undefined;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return undefined;

    let animationFrame: number;

    const drawFrame = () => {
      if (!frameVideo.videoWidth || !frameVideo.videoHeight) return;
      const aspectRatio = frameVideo.videoWidth / frameVideo.videoHeight;
      const width = 1080;
      const height = width / aspectRatio;

      canvas.width = width;
      canvas.height = height;

      mainVideo.width = width;
      mainVideo.height = height;

      ctx.drawImage(frameVideo, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const { data: pixel } = imageData;

      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
          const posX = x * 4;
          const posY = y * 4;
          const pos = posY * width + posX;

          const r = pixel[pos];
          const g = pixel[pos + 1];
          const b = pixel[pos + 2];
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          if (renderType === '8bit') {
            ctx.fillRect(x, y, cellSize, cellSize);
          } else {
            const text = getCharacter(r, g, b, 4);
            ctx.fillText(text, x, y, cellSize / 1.2);
          }
        }
      }

      animationFrame = requestAnimationFrame(drawFrame);
    };

    const handleLoadedMetadata = () => {
      animationFrame = requestAnimationFrame(drawFrame);
    };

    frameVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      cancelAnimationFrame(animationFrame);
      frameVideo.pause();
      mainVideo.pause();
      frameVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!frameVideo || !mainVideo) return;

    const handleTimeUpdate = () => {
      frameVideo.currentTime = mainVideo.currentTime + 0.3;
    };

    mainVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      mainVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
