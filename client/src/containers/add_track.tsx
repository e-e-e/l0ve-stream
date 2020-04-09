import { Input } from "../components/input/input";
import React from "react";
import { Button } from "../components/button/button";

type AddTrackProps = {
  playlistId: string;
  close?(): void;
};
export const AddTrackView = ({ close, playlistId }: AddTrackProps) => {
  const createTrack = React.useCallback(() => {
    console.log("submit");
    close?.();
  }, [playlistId]);
  return (
    <form onSubmit={createTrack}>
      <Input name="title" placeholder="title" />
      <Input name="artist" placeholder="artist/s" />
      <Input name="album" placeholder="album" />
      <Button type="submit" onClick={createTrack}>
        Add new track
      </Button>
    </form>
  );
};
