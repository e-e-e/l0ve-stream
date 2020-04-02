import { Typography } from "../typography/typography";
import { PointIcon } from "../icons/icons";
import React from "react";
import styles from "./track_item.module.css";

export const TrackItem = ({
  index,
  title,
  artist,
  album,
  year,
}: {
  index: number;
  title: string;
  artist: string;
  album: string;
  year?: number;
}) => {
  return (
    <div className={styles.track}>
      <div className={styles.info}>
        <Typography>{title}</Typography>
        <Typography variant="subtitle">{artist}</Typography>
      </div>
      <div className={styles.controls}>
        <PointIcon />
      </div>
    </div>
  );
};
