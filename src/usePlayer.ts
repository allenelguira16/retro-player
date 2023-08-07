import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { getCharacter } from "./getCharacter";

type UsePlayerProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  mainVideoRef: RefObject<HTMLVideoElement>;
  frameVideoRef: RefObject<HTMLVideoElement>;
};

export function usePlayer(
  renderType: "ascii" | "8bit",
  { canvasRef, frameVideoRef, mainVideoRef }: UsePlayerProps
) {
  const [isPaused, setIsPaused] = useState(true);

  const drawFrame = useCallback(async () => {
    const cellSize = renderType === "ascii" ? 4 : 5;
    const canvas = canvasRef.current;
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!canvas || !mainVideo || !frameVideo || !canvasRef.current)
      return undefined;
    if (!frameVideo.videoWidth || !frameVideo.videoHeight || !canvasRef.current)
      return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return undefined;
    const aspectRatio = frameVideo.videoWidth / frameVideo.videoHeight;
    const width = 720;
    const height = width / aspectRatio;

    canvas.width = width;
    canvas.height = height;

    mainVideo.width = width;
    mainVideo.height = height;

    ctx.drawImage(frameVideo, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const { data: pixel } = imageData;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighten";
    ctx.font = `${cellSize}px PressStart2P`;

    for (let y = 0; y < height; y += cellSize) {
      let row = "";
      const colors: [number, number, number][] = [];

      for (let x = 0; x < width; x += cellSize) {
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * width + posX;

        const r = pixel[pos];
        const g = pixel[pos + 1];
        const b = pixel[pos + 2];
        if (renderType === "8bit") {
          ctx.fillStyle = `rgba(${r},${g},${b}, 1)`;
          ctx.fillRect(x, y, cellSize / 1.01, cellSize / 1.01);
        } else {
          // ctx.fillStyle = `rgba(${r},${g},${b}, 0.4)`;
          // ctx.fillRect(x, y, cellSize, cellSize);
          // ctx.fillStyle = `rgba(${r},${g},${b}, 1)`;
          // colors.push(`rgba(${r},${g},${b}, 1)`);
          colors.push([r, g, b]);
          const text = getCharacter(r, g, b, 2);
          // gradient.addColorStop(x / width, `rgba(${r},${g},${b}, 1)`);
          row += text;
          // ctx.fillText(text, x, y, cellSize);
        }
      }

      if (renderType === "ascii") {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        colors.forEach(([r, g, b], x) => {
          gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 0.4)`);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y, width, cellSize / 1.5);

        // const gradient = ctx.createLinearGradient(0, 0, width, 0);
        colors.forEach(([r, g, b], x) => {
          gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 1)`);
        });
        ctx.fillStyle = gradient;
        ctx.fillText(row, 0, y);
      }
    }

    // canvas.style.width = "100%";
    // canvas.style.height = "100%";
    // canvasRef.current.replaceWith(canvas);
    requestAnimationFrame(drawFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(async () => {
    const frameVideo = frameVideoRef.current;
    const mainVideo = mainVideoRef.current;

    if (!frameVideo || !mainVideo) return;

    await frameVideo.play();
    await mainVideo.play();
    requestAnimationFrame(drawFrame);
    setIsPaused(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pause = useCallback(() => {
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!mainVideo || !frameVideo || !canvasRef.current) return;

    frameVideo.pause();
    mainVideo.pause();
    setIsPaused(true);
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

  return {
    play,
    pause,
    isPaused,
  };
  // useEffect(() => {
  //   const cellSize = renderType === "ascii" ? 6 : 5;
  //   const canvas = document.createElement("canvas");
  //   const mainVideo = mainVideoRef.current;
  //   const frameVideo = frameVideoRef.current;

  //   if (!canvas || !mainVideo || !frameVideo || !canvasRef.current)
  //     return undefined;

  //   const ctx = canvas.getContext("2d", { willReadFrequently: true });
  //   if (!ctx) return undefined;

  //   let animationFrame: number;

  //   const drawFrame = async () => {
  //     if (
  //       !frameVideo.videoWidth ||
  //       !frameVideo.videoHeight ||
  //       !canvasRef.current
  //     )
  //       return;
  //     const aspectRatio = frameVideo.videoWidth / frameVideo.videoHeight;
  //     const width = 1080;
  //     const height = width / aspectRatio;

  //     canvas.width = width;
  //     canvas.height = height;

  //     mainVideo.width = width;
  //     mainVideo.height = height;

  //     ctx.drawImage(frameVideo, 0, 0, width, height);

  //     const imageData = ctx.getImageData(0, 0, width, height);
  //     const { data: pixel } = imageData;

  //     ctx.clearRect(0, 0, width, height);
  //     ctx.globalCompositeOperation = "lighten";
  //     ctx.font = `${cellSize}px PressStart2P`;

  //     for (let y = 0; y < height; y += cellSize) {
  //       for (let x = 0; x < width; x += cellSize) {
  //         const posX = x * 4;
  //         const posY = y * 4;
  //         const pos = posY * width + posX;

  //         const r = pixel[pos];
  //         const g = pixel[pos + 1];
  //         const b = pixel[pos + 2];
  //         if (renderType === "8bit") {
  //           ctx.fillStyle = `rgba(${r},${g},${b}, 1)`;
  //           ctx.fillRect(x, y, cellSize / 1.01, cellSize / 1.01);
  //         } else {
  //           ctx.fillStyle = `rgba(${r},${g},${b}, 0.2)`;
  //           ctx.fillRect(x, y, cellSize, cellSize);
  //           ctx.fillStyle = `rgba(${r},${g},${b}, 1)`;
  //           const text = getCharacter(r, g, b, 1);
  //           ctx.fillText(text, x, y, cellSize);
  //         }
  //       }
  //     }

  //     // const image = new Image();
  //     // image.src = canvas.toDataURL();

  //     // await new Promise<void>((resolve) => {
  //     //   image.onload = function () {
  //     //     ctx.drawImage(image, 0, 0); // Or at whatever offset you like
  //     //     resolve();
  //     //   };
  //     // });
  //     // const blob = await new Promise<Blob>((resolve) => {
  //     //   canvas.toBlob((blob) => {
  //     //     resolve(blob as Blob);
  //     //   });
  //     // });
  //     // const image = await createImageBitmap(blob);
  //     // ctx.putImageData(image, width, height);

  //     canvas.style.width = "100%";
  //     canvas.style.height = "100%";
  //     canvasRef.current.replaceWith(canvas);
  //     animationFrame = requestAnimationFrame(drawFrame);
  //   };

  //   const handleLoadedMetadata = () => {
  //     animationFrame = requestAnimationFrame(drawFrame);
  //   };

  //   frameVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

  //   return () => {
  //     cancelAnimationFrame(animationFrame);
  //     frameVideo.pause();
  //     mainVideo.pause();
  //     frameVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
}
