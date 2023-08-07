import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { getCharacter } from "./getCharacter";

export async function convertVideoTo8Bit(inputVideo: string) {
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.1/dist/umd";
  const ffmpeg = new FFmpeg();
  ffmpeg.on("log", (response: unknown) => {
    // if (!message.current) return;

    // messageRef.current.innerHTML = message;
    if (typeof response === "object" && response && "message" in response) {
      console.log(response.message);
    }
  });
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(
      `https://unpkg.com/@ffmpeg/core-mt@0.12.1/dist/esm/ffmpeg-core.worker.js`,
      "text/javascript"
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    thread: true,
  });
  // console.log("loaded");
  const video = document.createElement("video");
  video.src = inputVideo;
  video.preload = "metadata";

  const videoFileName = "upload.mp4";
  const frameFileName = "frame-%d.png";
  const imageFileName = "output-%d.png";
  const audioFileName = "audio.mp3";
  const fps = "18";

  await delay(200);

  const width = 320;
  let height = Math.floor(video.videoHeight * (width / video.videoWidth));
  if (height % 2 !== 0) height = height - 1;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw "ctx is empty";
  console.log("Downloading video");
  ffmpeg.writeFile(videoFileName, await fetchFile(inputVideo));
  console.log("Extracting audio");
  await ffmpeg.exec([
    "-i",
    videoFileName,
    "-vn",
    "-acodec",
    "libmp3lame",
    audioFileName,
  ]);
  console.log("Extracting frames");
  await ffmpeg.exec([
    "-i",
    videoFileName,
    "-r",
    fps,
    "-vf",
    `scale=${width}:${height}`,
    "-threads",
    "8",
    frameFileName,
  ]);

  return "";

  // const frames = (await ffmpeg.listDir("."))
  //   .filter((file) => file.name.startsWith("frame-"))
  //   .map(({ name }) => name);

  // // Use Web Workers to parallelize the image processing
  // const numWorkers = 8;
  // const chunkSize = Math.ceil(frames.length / numWorkers);

  // const processFrames = async (start: number, end: number) => {
  //   for (let i = start; i < end; i++) {
  //     const imageBlob = new Blob([await ffmpeg.readFile(frames[i])], {
  //       type: "image/png",
  //     });
  //     const image = await createImageBitmap(imageBlob);
  //     ctx.drawImage(image, 0, 0, width, height);

  //     const imageData = ctx.getImageData(0, 0, width, height);
  //     const { data: pixel } = imageData;
  //     ctx.clearRect(0, 0, width, height);

  //     for (let y = 0; y < height; y += 4) {
  //       for (let x = 0; x < width; x += 4) {
  //         const posX = x * 4;
  //         const posY = y * 4;
  //         const pos = posY * width + posX;

  //         const r = pixel[pos];
  //         const g = pixel[pos + 1];
  //         const b = pixel[pos + 2];
  //         ctx.fillStyle = `rgb(${r},${g},${b})`;
  //         const text = getCharacter(r, g, b, 4);
  //         ctx.fillText(text, x, y);
  //       }
  //     }

  //     await ffmpeg.writeFile(
  //       `output-${i}.png`,
  //       await blobToUInt8Array(await canvas.convertToBlob())
  //     );
  //   }
  // };

  // const workers = [];
  // for (let i = 0; i < numWorkers; i++) {
  //   const start = i * chunkSize;
  //   const end = Math.min((i + 1) * chunkSize, frames.length);
  //   workers.push(processFrames(start, end));
  // }

  // await Promise.all(workers);

  // // Merge images to create the final video
  // await ffmpeg.exec([
  //   "-framerate",
  //   fps,
  //   "-i",
  //   imageFileName,
  //   "-i",
  //   audioFileName,
  //   "-c:v",
  //   "libx264",
  //   "-r",
  //   fps,
  //   "-qp",
  //   "0",
  //   "-threads",
  //   "8",
  //   "output.mp4",
  // ]);

  // const videoBlob = new Blob([await ffmpeg.readFile("output.mp4")], {
  //   type: "video/mp4",
  // });
  // const videoUrl = URL.createObjectURL(videoBlob);

  // return videoUrl;
}

// function loadImage(imageBlob: Blob) {
//   return new Promise<HTMLImageElement>((resolve) => {
//     const image = new Image();
//     image.src = URL.createObjectURL(imageBlob);

//     // Wait for the image to load
//     image.onload = async () => {
//       URL.revokeObjectURL(image.src);
//       resolve(image);
//     };
//   });
// }

async function blobToUInt8Array(blob: Blob) {
  const buffer = await new Response(blob).arrayBuffer();
  return new Uint8Array(buffer);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
