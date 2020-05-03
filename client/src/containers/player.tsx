import React, { useCallback } from "react";
import { IconButton } from "../components/button/button";
import { PlayIcon } from "../components/icons/icons";
import { useDispatch } from "react-redux";
import {
  loadPlaylist,
  next,
  pause,
  playTrack,
  prev,
  stop,
} from "../redux/actions/media_player";

export const Player = () => {
  const dispatch = useDispatch();
  const play = useCallback(() => dispatch(playTrack({})), [dispatch]);
  const stopTrack = useCallback(() => dispatch(stop()), [dispatch]);
  const nextTrack = useCallback(() => dispatch(next()), [dispatch]);
  const prevTrack = useCallback(() => dispatch(prev()), [dispatch]);
  const pauseTrack = useCallback(() => dispatch(pause()), [dispatch]);
  const load = () => dispatch(loadPlaylist({ playlist: "test" }));
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
      <IconButton onClick={prevTrack}>{"<<"}</IconButton>
      <IconButton onClick={play}>
        <PlayIcon />
      </IconButton>
      <IconButton onClick={nextTrack}>{">>"}</IconButton>
      <IconButton onClick={stopTrack}>stop</IconButton>
      <IconButton onClick={pauseTrack}>pause</IconButton>
      {/*<IconButton onClick={() => player.clear()}>clear</IconButton>*/}
    </div>
  );
};
