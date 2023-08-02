import {
  useState,
  useRef,
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
} from "react";
import { usePlayer } from "./usePlayer";

interface PlayerProps {
  url?: string;
}

export function Player({ url }: PlayerProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const frameVideoRef = useRef<HTMLVideoElement>(null);

  usePlayer({
    canvasRef,
    frameVideoRef,
    mainVideoRef,
  });

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(mainVideoRef.current?.currentTime || 0);
    }, 100);
  }, []);

  const handlePlay = async () => {
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!frameVideo || !mainVideo) return;

    if (isPaused) {
      await frameVideo.play();
      await mainVideo.play();
      console.log("main started");
    } else {
      frameVideo.pause();
      mainVideo.pause();
    }

    setIsPaused(!isPaused);
  };

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const mainVideo = mainVideoRef.current;
    const frameVideo = frameVideoRef.current;

    if (!frameVideo || !mainVideo) return;

    const newCurrentTime = Number(event.currentTarget.dataset.seek);
    const timeDiff = frameVideo.currentTime - mainVideo.currentTime;
    setCurrentTime(newCurrentTime);
    frameVideo.currentTime = newCurrentTime;
    mainVideo.currentTime = newCurrentTime - timeDiff;
  };

  const handleMouseMove: MouseEventHandler<HTMLInputElement> = (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const seekTime =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      (mainVideoRef.current?.duration || 0);
    event.target.setAttribute("data-seek", seekTime.toString());
  };

  function formatTime(durationInSeconds: number) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const endTime = mainVideoRef.current?.duration || 0;

  return (
    <>
      <video
        id="video-frame"
        src={url}
        muted
        style={{ display: "none" }}
        preload="metadata"
        ref={frameVideoRef}
      />
      <div>
        <video
          id="main"
          src={url}
          style={{
            // display: "inline",
            display: "none",
            // position: "absolute",
            // zIndex: 1,
            // opacity: "0.4",
            // filter: "blur(10px)",
          }}
          preload="metadata"
          ref={mainVideoRef}
        />
        <div>
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <button onClick={handlePlay}>Play</button>
        <input
          type="range"
          style={{ flex: 1 }}
          min={0}
          max={endTime}
          value={currentTime}
          onChange={handleTimeChange}
          step="0.01"
          onMouseMove={handleMouseMove}
        />
        <div>
          {formatTime(currentTime)}-{formatTime(endTime)}
        </div>
      </div>
    </>
  );
}
