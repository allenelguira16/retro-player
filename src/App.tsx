import { ChangeEventHandler, useState } from "react";
import { Player } from "./components/Player";

function App() {
  const [renderType, setRenderType] = useState<"ascii" | "8bit">("ascii");
  const [videoPath, setVideoPath] = useState<string>();

  const handleInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (!event.currentTarget.files) return;
    setVideoPath(URL.createObjectURL(event.currentTarget.files[0]));
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>
          {!videoPath && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                // width: "50%",
              }}
            >
              <input type="file" accept=".mp4" onChange={handleInput} />
              <select
                onChange={(event) => {
                  setRenderType(event.currentTarget.value as "ascii" | "8bit");
                }}
                value={renderType}
              >
                <option value="ascii">ascii</option>
                <option value="8bit">8-bit</option>
              </select>
            </div>
          )}
          {videoPath && <Player url={videoPath} renderType={renderType} />}
        </div>
      </div>
    </>
  );
}

export default App;
