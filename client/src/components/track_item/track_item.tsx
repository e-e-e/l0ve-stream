import { Typography } from "../typography/typography";
import { PointIcon } from "../icons/icons";
import React from "react";

const Track = ({
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
    <div>
      <div>
        <Typography>{title}</Typography>
        <Typography variant="subtitle">{artist}</Typography>
      </div>
      <div>
        <PointIcon />
      </div>
    </div>
  );
};
