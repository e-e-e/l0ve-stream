import React from "react";
import { IconButton } from "../components/button/button";
import { PlayIcon } from "../components/icons/icons";
import { createMediaPlayer } from "../media_player";

const player = createMediaPlayer();

export const Player = () => {
  const load = () =>
    player.init([
      "/samples/1.mp3",
      "/samples/2.mp3",
      "/samples/3.mp3",
      "/samples/4.mp3",
    ]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "thin black solid",
        textAlign: "center",
      }}
    >
      <IconButton onClick={load}>Load</IconButton>
      <IconButton onClick={() => player.prev()}>{"<<"}</IconButton>
      <IconButton onClick={() => player.play()}>
        <PlayIcon />
      </IconButton>
      <IconButton onClick={() => player.next()}>{">>"}</IconButton>
      <IconButton onClick={() => player.stop()}>stop</IconButton>
      <IconButton onClick={() => player.pause()}>pause</IconButton>
      <IconButton onClick={() => player.clear()}>clear</IconButton>
    </div>
  );
};
