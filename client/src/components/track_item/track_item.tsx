import { Typography } from '../typography/typography';
import { PlayIcon, PointIcon, RearrangeIcon, TrashIcon } from '../icons/icons';
import React from 'react';
import styles from './track_item.module.css';
import { Draggable } from 'react-beautiful-dnd';
import { IconButton } from '../button/button';

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
}) => {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isDraggable}>
      {(provided, snapshot) => {
        return (
          <div className={styles.trackContainer}>
            {progress !== undefined && (
              <div className={styles.progress}>
                <div
                  className={styles.progressBar}
                  style={{ transform: `scaleX(${progress})` }}
                ></div>
                <div className={styles.progressLabel}>
                  Uploading {(progress * 100).toFixed()}%
                </div>
              </div>
            )}
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
