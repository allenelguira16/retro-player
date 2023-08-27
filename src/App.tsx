import { ChangeEventHandler, useState } from "react";
import { Player } from "./components/Player";

function App() {
  const [renderType, setRenderType] = useState<"ascii" | "8bit">("ascii");
  const [videoPath, setVideoPath] = useState<string | undefined>();

  const handleInput: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setVideoPath(URL.createObjectURL(file));
  };

  const renderTypeOptions = [
    { value: "ascii", label: "ASCII" },
    { value: "8bit", label: "8-bit" },
  ];

  return (
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input type="file" accept=".mp4" onChange={handleInput} />
            <select
              onChange={(event) =>
                setRenderType(event.currentTarget.value as "ascii" | "8bit")
              }
              value={renderType}
            >
              {renderTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {videoPath && <Player url={videoPath} renderType={renderType} />}
      </div>
    </div>
  );
}

export default App;
