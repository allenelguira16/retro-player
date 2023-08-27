import { getCharacter } from "./getCharacter";

export function draw(renderType: "ascii" | "8bit") {
  const cellSize = 5;
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
  const mainVideo = document.querySelector<HTMLVideoElement>("#main");
  const frameVideo = document.querySelector<HTMLVideoElement>("#frame");
  const ctx = canvas?.getContext("2d", { willReadFrequently: true });

  if (!canvas || !mainVideo || !frameVideo || !ctx) return;

  const aspectRatio = frameVideo.videoWidth / frameVideo.videoHeight;
  const width = 1080;
  const height = width / aspectRatio;

  canvas.width = width;
  canvas.height = height;

  mainVideo.width = width;
  mainVideo.height = height;

  ctx.globalCompositeOperation = "lighten";
  ctx.drawImage(frameVideo, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data: pixel } = imageData;

  ctx.clearRect(0, 0, width, height);
  ctx.font = `${cellSize}px PressStart2P`;
  ctx.imageSmoothingEnabled = true;

  for (let y = 0; y < height; y += cellSize) {
    let row = "";
    const colors: [number, number, number][] = [];

    for (let x = 0; x < width; x += cellSize) {
      const posX = x * 4;
      const posY = y * 4;
      const pos = posY * width + posX;

      const r = pixel[pos] || 0;
      const g = pixel[pos + 1] || 0;
      const b = pixel[pos + 2] || 0;
      colors.push([r, g, b]);
      row += getCharacter(r, g, b, 2);
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    if (renderType === "ascii") {
      colors.forEach(([r, g, b], x) =>
        gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 1)`)
      );
      ctx.fillStyle = gradient;
      ctx.fillText(row, 0, y);
    } else {
      colors.forEach(([r, g, b], x) =>
        gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 1)`)
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, cellSize);
    }
  }
}
