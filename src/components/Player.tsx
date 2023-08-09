import { useEffect } from "react";
import { useFullscreen, usePlayer } from "../hooks";
import { Controls } from "./Controls";

interface PlayerProps {
  url?: string;
  renderType: "ascii" | "8bit";
}

export function Player({ url, renderType }: PlayerProps) {
  const [isFullscreen, handleFullscreen] = useFullscreen();

  const { play, pause, isPaused } = usePlayer(renderType);

  const handlePlay = async () => {
    if (isPaused) play();
    else pause();
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

  const handleControlDisplay = (isVisible: boolean) => {
    const controlElement = document.querySelector<HTMLDivElement>("#controls");
    if (!controlElement) return;
    controlElement.style.display = isVisible ? "flex" : "none";
  };

  return (
    <>
      <video
        id="frame"
        src={url}
        muted
        style={{ display: "none" }}
        preload="metadata"
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
        <div
          id="player"
          style={{ display: "flex", height: "inherit", width: "inherit" }}
        >
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
              width: "100%",
            }}
            preload="metadata"
          />
          <canvas id="canvas" style={{ width: "100%", height: "100%" }} />
        </div>
        <Controls
          onPlay={handlePlay}
          isPaused={isPaused}
          isFullscreen={isFullscreen}
          onFullscreen={handleFullscreen}
        />
      </div>
    </>
  );
}
