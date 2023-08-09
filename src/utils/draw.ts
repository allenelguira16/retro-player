import { getCharacter } from ".";

export function draw(renderType: "ascii" | "8bit") {
  const cellSize = renderType === "ascii" ? 4 : 5;
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
  const mainVideo = document.querySelector<HTMLVideoElement>("#main");
  const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

  if (!canvas || !mainVideo || !frameVideo) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

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

      const r = pixel[pos] || 0;
      const g = pixel[pos + 1] || 0;
      const b = pixel[pos + 2] || 0;
      if (renderType === "8bit") {
        ctx.fillStyle = `rgba(${r},${g},${b}, 1)`;
        ctx.fillRect(x, y, cellSize / 1.01, cellSize / 1.01);
      } else {
        colors.push([r, g, b]);
        row += getCharacter(r, g, b, 2);
      }
    }

    if (renderType === "ascii") {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      colors.forEach(([r, g, b], x) =>
        gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 0.4)`)
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, cellSize / 1.5);

      colors.forEach(([r, g, b], x) =>
        gradient.addColorStop(x / colors.length, `rgba(${r},${g},${b}, 1)`)
      );
      ctx.fillStyle = gradient;
      ctx.fillText(row, 0, y);
    }
  }
}
