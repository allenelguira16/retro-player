import { getCharacter } from "./getCharacter";

export function draw() {
  const cellSize = 10;
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
    const row: string[] = [];
    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let x = 0; x < width; x += cellSize) {
      const posX = x * 4;
      const posY = y * 4;
      const pos = posY * width + posX;

      const r = pixel[pos] || 0;
      const g = pixel[pos + 1] || 0;
      const b = pixel[pos + 2] || 0;

      gradient.addColorStop(x / width, `rgba(${r},${g},${b}, 1)`);
      row.push(getCharacter(r, g, b, 1));
    }

    ctx.fillStyle = gradient;
    ctx.fillText(row.join(""), 0, y);
  }
}
