import { Typography } from "../typography/typography";
import { PointIcon } from "../icons/icons";
import React from "react";
import styles from "./track_item.module.css";
import { Draggable } from "react-beautiful-dnd";

export const TrackItem = ({
  id,
  index,
  title,
  artist,
  album,
  year,
}: {
  id: string;
  index: number;
  title: string;
  artist: string;
  album: string;
  year?: number;
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            className={styles.track}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div {...provided.dragHandleProps}>::</div>
            <div className={styles.info}>
              <Typography>{title}</Typography>
              <Typography variant="subtitle">{artist}</Typography>
            </div>
            <div className={styles.controls}>
              <PointIcon />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
