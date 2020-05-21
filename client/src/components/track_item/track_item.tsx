import { Typography } from '../typography/typography';
import { PlayIcon, PointIcon, RearrangeIcon, TrashIcon } from '../icons/icons';
import React from 'react';
import styles from './track_item.module.css';
import { Draggable } from 'react-beautiful-dnd';
import { IconButton } from '../button/button';
import classNames from "classnames";

const Progress = ({ progress }: { progress: number }) => {
  return (
    <div className={styles.progress}>
      <div
        className={styles.progressBar}
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className={styles.progressLabel}>
        Uploading {(progress * 100).toFixed()}%
      </div>
    </div>
  );
};
const Transcoding = () => (
  <div className={styles.progress}>
    <div className={classNames(styles.progressBar, styles.transcodingIndicator)} />
    <div className={styles.progressLabel}>TRANSCODING AUDIO FILES</div>
  </div>
);
const Error = () => (
  <div className={styles.progress}>
    <div className={classNames(styles.progressBar, styles.error)} />
    <div className={styles.progressLabel}>ERROR TRANSCODING FILES</div>
  </div>
);

export const TrackItem = ({
  id,
  index,
  title,
  artist,
  // album,
  // year,
  isDraggable,
  onDelete,
  onPlay,
  onEdit,
  progress,
  status,
}: {
  id: string;
  index: number;
  title: string;
  artist: string;
  album: string;
  year?: number;
  isDraggable?: boolean;
  onDelete?: (id: string) => void;
  onPlay?: (id: string) => void;
  onEdit?: (id: string) => void;
  progress?: number;
  status?: string; // 0 1 2 3
}) => {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isDraggable}>
      {(provided, snapshot) => {
        return (
          <div className={styles.trackContainer}>
            {status === '1' && <Transcoding />}
            {status === '3' && <Error />}
            {progress !== undefined && status === '0' && <Progress progress={progress} />}
            <div
              className={styles.track}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              {isDraggable && (
                <div
                  className={styles.dragControl}
                  {...provided.dragHandleProps}
                >
                  <RearrangeIcon />
                </div>
              )}
              <div className={styles.info}>
                <Typography>{title}</Typography>
                <Typography variant="subtitle">{artist}</Typography>
              </div>
              <div className={styles.controls}>
                {onDelete && (
                  <IconButton onClick={() => onDelete(id)}>
                    <TrashIcon />
                  </IconButton>
                )}
                {onEdit && (
                  <IconButton onClick={() => onEdit(id)}>Edit</IconButton>
                )}
                {onPlay ? (
                  <IconButton onClick={() => onPlay(id)}>
                    <PlayIcon />
                  </IconButton>
                ) : (
                  <PointIcon />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
