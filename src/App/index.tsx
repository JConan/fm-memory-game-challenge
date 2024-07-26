import { useGameSetting } from "../hooks/useGameSetting";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { GameSettingScreen } from "../screens/GameSetting";
import { InGame } from "../screens/InGame";
import "./style.scss";

export const App = () => {
  const [isLoaded, setLoaded] = useState(false);
  const gameSetting = useGameSetting();

  useEffect(() => {
    gameSetting.localStore.load();
    setLoaded(true);

    window.addEventListener("message", (event) => {
      if (event.data === "getHeight") {
        const height = document.body.scrollHeight;
        event.source?.postMessage(
          { type: "getHeight", height },
          event.origin as any
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoaded && <div role="progressbar">loading ...</div>}
      {isLoaded && (
        <div className="game-app">
          <Routes>
            <Route path="/game" element={<InGame setting={gameSetting} />} />
            <Route
              path="/"
              element={<GameSettingScreen gameSetting={gameSetting} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </>
  );
};
