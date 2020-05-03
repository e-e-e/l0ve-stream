import React, { useCallback } from "react";
import { IconButton } from "../components/button/button";
import { PlayIcon } from "../components/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  loadPlaylist,
  next,
  pause,
  playTrack,
  prev,
  stop,
} from "../redux/actions/media_player";
import styles from "./player.module.css";
import { selectProgress } from "../redux/selectors/media_player";

export const Player = () => {
  const dispatch = useDispatch();
  const prevProgress = React.useRef<number>(0);
  const play = useCallback(() => dispatch(playTrack({})), [dispatch]);
  const stopTrack = useCallback(() => dispatch(stop()), [dispatch]);
  const nextTrack = useCallback(() => dispatch(next()), [dispatch]);
  const prevTrack = useCallback(() => dispatch(prev()), [dispatch]);
  const pauseTrack = useCallback(() => dispatch(pause()), [dispatch]);
  const progress = useSelector(selectProgress);
  React.useEffect(() => {
    prevProgress.current = progress;
  }, [progress]);
  const value = prevProgress.current;
  const load = () => dispatch(loadPlaylist({ playlist: "test" }));
  return (
    <div className={styles.player}>
      <div className={styles.background}>
        <div
          className={styles.progress}
          style={{
            transform: `translateX(${-100 + progress * 100}%)`,
            transition: progress > value ? "transform linear 0.1s" : "none",
          }}
        />
        <div className={styles.controls}>
          <IconButton invert onClick={play}>
            <PlayIcon />
          </IconButton>
          <IconButton invert onClick={load}>
            Load
          </IconButton>
          <IconButton invert onClick={prevTrack}>
            {"<<"}
          </IconButton>
          <IconButton invert onClick={nextTrack}>
            {">>"}
          </IconButton>
          <IconButton invert onClick={stopTrack}>
            stop
          </IconButton>
          <IconButton invert onClick={pauseTrack}>
            pause
          </IconButton>
          {/*<IconButton onClick={() => player.clear()}>clear</IconButton>*/}
        </div>
      </div>
    </div>
  );
};
