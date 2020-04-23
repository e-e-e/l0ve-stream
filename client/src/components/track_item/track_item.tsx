import { Typography } from "../typography/typography";
import { PointIcon, TrashIcon } from "../icons/icons";
import React from "react";
import styles from "./track_item.module.css";
import { Draggable } from "react-beautiful-dnd";
import {Button, IconButton} from "../button/button";

export const TrackItem = ({
  id,
  index,
  title,
  artist,
  album,
  year,
  isDraggable,
  onDelete,
}: {
  id: string;
  index: number;
  title: string;
  artist: string;
  album: string;
  year?: number;
  isDraggable?: boolean;
  onDelete?: (id: string) => void;
}) => {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isDraggable}>
      {(provided, snapshot) => {
        return (
          <div
            className={styles.track}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            {isDraggable && <div {...provided.dragHandleProps}>::</div>}
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
              <PointIcon />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
