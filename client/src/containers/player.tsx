import React, { useCallback } from 'react';
import { IconButton } from '../components/button/button';
import { CloseIcon, PauseIcon, PlayIcon } from '../components/icons/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  next,
  pause,
  playTrack,
  prev,
  stop,
} from '../redux/actions/media_player';
import styles from './player.module.css';
import {
  getCurrentTrack,
  getTimeInfo,
  getTotalProgress,
  selectState,
} from '../redux/selectors/media_player';
import { Typography } from '../components/typography/typography';
import { BackgroundProgress } from '../components/background_progress/background_progress';
import { PlayerState } from '../redux/reducers/media_player';
import { toTimeCode } from '../base/time';

export const Player = () => {
  const dispatch = useDispatch();
  const prevProgress = React.useRef<number>(0);
  const play = useCallback(() => dispatch(playTrack({})), [dispatch]);
  const stopTrack = useCallback(() => dispatch(stop()), [dispatch]);
  // const nextTrack = useCallback(() => dispatch(next()), [dispatch]);
  // const prevTrack = useCallback(() => dispatch(prev()), [dispatch]);
  const pauseTrack = useCallback(() => dispatch(pause()), [dispatch]);
  const timeInfo = useSelector(getTimeInfo);
  const track = useSelector(getCurrentTrack);
  const state = useSelector(selectState);
  const totalProgress = useSelector(getTotalProgress);
  React.useEffect(() => {
    prevProgress.current = timeInfo.progress;
  }, [timeInfo.progress]);
  const value = prevProgress.current;
  if (state !== PlayerState.PLAYING && state !== PlayerState.PAUSED) {
    return <></>;
  }
  const isPlaying = state === PlayerState.PLAYING;
  // const load = () => dispatch(loadPlaylist({ playlist: 'test' }));
  return (
    <div className={styles.overlay}>
      <div className={styles.playlistProgress}>
        <BackgroundProgress progress={totalProgress} />
      </div>
      <div className={styles.player}>
        <div className={styles.background}>
          <div
            className={styles.progress}
            style={{
              transform: `translateX(${-100 + timeInfo.progress * 100}%)`,
              transition:
                timeInfo.progress > value ? 'transform linear 0.1s' : 'none',
            }}
          />
          <div className={styles.container}>
            <div className={styles.controls}>
              <IconButton invert onClick={isPlaying ? pauseTrack : play}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              {/*<IconButton invert onClick={prevTrack}>*/}
              {/*  {'<<'}*/}
              {/*</IconButton>*/}
              {/*<IconButton invert onClick={nextTrack}>*/}
              {/*  {'>>'}*/}
              {/*</IconButton>*/}
            </div>
            <div className={styles.trackInfo}>
              <div className={styles.top}>
                <div>
                  <Typography color="white">{track?.title}</Typography>
                </div>
                <div>
                  <Typography color="grey">{track?.artist}</Typography>
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.elapsed}>
                  <Typography variant="subtitle" color="white">
                    {toTimeCode(timeInfo.elapsed)}
                  </Typography>
                </div>
                <div>/</div>
                <div className={styles.duration}>
                  <Typography variant="subtitle" color="grey">
                    {toTimeCode(timeInfo.duration)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className={styles.close}>
              <IconButton invert onClick={stopTrack}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
