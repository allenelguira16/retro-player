import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { formatTime } from "../utils";

type ControlsProps = {
  isFullscreen: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onFullscreen: () => void;
};

export function Controls({
  isPaused,
  isFullscreen,
  onPlay: handlePlay,
  onFullscreen: handleFullscreen,
}: ControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const mainVideo = document.querySelector<HTMLVideoElement>("#main");
    const frameVideo = document.querySelector<HTMLVideoElement>("#frame");

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
      (document.querySelector<HTMLVideoElement>("#main")?.duration || 0);
    event.target.setAttribute("data-seek", seekTime.toString());
  };

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(
        document.querySelector<HTMLVideoElement>("#main")?.currentTime || 0
      );
    }, 100);
  }, []);
  const endTime =
    document.querySelector<HTMLVideoElement>("#main")?.duration || 0;

  return (
    <div
      id="controls"
      style={{
        display: isFullscreen ? "none" : "flex",
        alignItems: "center",
        gap: 2,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0.8rem",
        background: "rgba(0,0,0,0.8)",
      }}
    >
      <button onClick={handlePlay}>
        {!isPaused ? <FaPause /> : <FaPlay />}
      </button>
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
      <button onClick={handleFullscreen}>
        {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
      </button>
    </div>
  );
}
