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
  renderType: "ascii" | "8bit";
}

export function Player({ url, renderType }: PlayerProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const frameVideoRef = useRef<HTMLVideoElement>(null);

  usePlayer(renderType, {
    canvasRef,
    frameVideoRef,
    mainVideoRef,
  });

  useEffect(() => {
    // // const applyScaling = (scaledWrapper, scaledContent) => {
    // // };
    // const scaledWrapper = document.body;
    // const scaledContent = document.getElementById("player");
    // if (!scaledContent || !scaledWrapper) return;
    // scaledContent.style.transform = "scale(1, 1)";
    // const { width: cw, height: ch } = scaledContent.getBoundingClientRect();
    // const { width: ww, height: wh } = scaledWrapper.getBoundingClientRect();
    // const scaleAmtX = Math.min(ww / cw, wh / ch);
    // const scaleAmtY = scaleAmtX;
    // scaledContent.style.transform = `scale(${scaleAmtX}, ${scaleAmtY})`;
    // // scaledContent.style.width = `${scaleAmtX * 100}%`;
    // // scaledContent.style.height = `${scaleAmtY * 100}%`;
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

  useEffect(() => {
    let t: number;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses as well
    window.ontouchstart = resetTimer; // catches touchscreen swipes as well
    window.ontouchmove = resetTimer; // required by some devices
    window.onclick = resetTimer; // catches touchpad clicks as well
    window.onkeydown = resetTimer;
    window.addEventListener("scroll", resetTimer, true); // improved; see comments

    function idle() {
      handleControlDisplay(false);
    }

    function resetTimer() {
      clearTimeout(t);
      t = setTimeout(idle, 1500); // time is in milliseconds
    }
  }, []);

  const handleFullscreen = async () => {
    // const mainVideo = mainVideoRef.current;
    // const frameVideo = frameVideoRef.current;

    // if (!frameVideo || !mainVideo) return;

    // if (isPaused) {
    //   await frameVideo.play();
    //   await mainVideo.play();
    //   console.log("main started");
    // } else {
    //   frameVideo.pause();
    //   mainVideo.pause();
    // }
    const playerElement = document.querySelector<HTMLDivElement>("body");
    if (!playerElement) return;
    // playerElement.style.display = "flex";
    if (!isFullscreen) await playerElement.requestFullscreen();
    else await document.exitFullscreen();

    setIsFullscreen(!isFullscreen);
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

  const handleControlDisplay = (isVisible: boolean) => {
    const controlElement = document.querySelector<HTMLDivElement>("#controls");
    if (!controlElement) return;
    controlElement.style.display = isVisible ? "flex" : "none";
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <video
        id="video-frame"
        src={url}
        muted
        style={{ display: "none" }}
        preload="metadata"
        ref={frameVideoRef}
      />
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
      <div
        style={{
          position: "relative",
          height: isFullscreen ? "100vh" : "60vh",
        }}
        onMouseMove={() => handleControlDisplay(true)}
        onMouseEnter={() => handleControlDisplay(true)}
        onMouseLeave={() => handleControlDisplay(false)}
      >
        <div id="player" style={{ height: "inherit", width: "inherit" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>
        <div
          id="controls"
          style={{
            display: "none",
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
          <button onClick={handleFullscreen}>Fullscreen</button>
        </div>
      </div>
    </div>
  );
}
