import { ChangeEventHandler, useState } from "react";
import { Player } from "./Player";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  const [renderType, setRenderType] = useState<'ascii' | '8bit'>('ascii');
  const [videoPath, setVideoPath] = useState<string>();
  // const [isPlayerOpen, setPlayerOpen] = useState(false);

  const handleInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!event.currentTarget.files) return;
    // console.log("extracting");
    // console.log(
    //   await extractFramesFromVideo(
    //     URL.createObjectURL(event.currentTarget.files[0]),
    //     18
    //   )
    // );
    // console.log("done extracting");
    setVideoPath(URL.createObjectURL(event.currentTarget.files[0]));
    // setIsLoading(true);
    // const url = await convertVideoTo8Bit(
    //   URL.createObjectURL(event.currentTarget.files[0])
    // );
    // setVideoPath(url);
    // setIsLoading(false);

    // const canvas = document.querySelector("canvas");
    // if (!canvas) return;
    // const ctx = canvas.getContext("2d");
    // ctx?.putImageData(image, 0, 0);
  };

  // if (isLoading) return <>Video Is Loading</>;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input type="file" accept=".mp4" onChange={handleInput} />
        <select onChange={(event) => {
          console.log('currentTarget', event.currentTarget.value);
          console.log('target', event.target.value);
          setRenderType(event.currentTarget.value as 'ascii' | '8bit');
        }} value={renderType}>
          <option value="ascii">ascii</option>
          <option value="8bit">8-bit</option>
        </select>
      </div>
      {/* {videoPath && <video src={videoPath} controls />} */}
      {/* <canvas></canvas> */}
      {videoPath && <Player url={videoPath} renderType={renderType} />}
    </>
  );
}

export default App;

// function formatTime(durationInSeconds: number) {
//   const minutes = Math.floor(durationInSeconds / 60);
//   const seconds = Math.floor(durationInSeconds % 60);
//   const formattedMinutes = String(minutes).padStart(2, "0");
//   const formattedSeconds = String(seconds).padStart(2, "0");
//   return `${formattedMinutes}:${formattedSeconds}`;
// }

// async function extractFramesFromVideo(videoUrl: string, fps: number) {
//   const video = document.createElement("video");
//   video.src = videoUrl;
//   video.muted = true;
//   video.playbackRate = 2.0;
//   await video.play();

//   const canvas = new OffscreenCanvas(video.videoWidth, video.videoHeight);
//   const context = canvas.getContext("2d");
//   const frames = [];
//   const interval = 1000 / fps; // Adjusted frame interval based on the desired fps

//   let currentTime = 0;
//   while (currentTime < video.duration) {
//     console.log(
//       `extracting... ${formatTime(currentTime)} / ${formatTime(video.duration)}`
//     );
//     video.currentTime = currentTime;
//     await new Promise((resolve) => setTimeout(resolve, interval));

//     context?.drawImage(video, 0, 0);
//     const base64ImageData = canvas.convertToBlob();
//     frames.push(base64ImageData);

//     currentTime += interval / 1000;
//   }

//   return frames;
// }
