import { Input } from "../components/input/input";
import React from "react";
import { Button } from "../components/button/button";
import { DropArea } from "../components/drop_area/drop_area";
import { Typography } from "../components/typography/typography";
import { useDispatch } from "react-redux";
import { insertPlaylistTrack } from "../redux/actions/playlists_actions";
import {TrackInput} from "../../__generated_types__/globalTypes";

type AddTrackProps = {
  playlistId: string;
  close?(): void;
};

export const AddTrackView = ({ close, playlistId }: AddTrackProps) => {
  const dispatch = useDispatch();
  const submit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!(event.target instanceof HTMLFormElement)) return;
      const formdata = new FormData(event.target);
      const data = {
        title: formdata.get("title") as string,
        artist: formdata.get("artist") as string,
        album: formdata.get("album") as string,
      };
      dispatch(insertPlaylistTrack({ playlistId, track: data }));
      close?.();
    },
    [close, dispatch, playlistId]
  );

  const [trackData, setTrackData] = React.useState<Partial<TrackInput>>({});
  const onTitleChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, title: value }));
    },
    [setTrackData]
  );
  return (
    <DropArea onFileDrop={() => {}} overlayText="Drop a music file here.">
      <form onSubmit={submit}>
        <Input
          name="title"
          placeholder="title"
          onChange={onTitleChange}
          value={trackData.title || ""}
        />
        <Input name="artist" placeholder="artist/s" />
        <Input name="album" placeholder="album" />
        <Button type="submit" disabled={false}>
          Add new track
        </Button>
        <Typography>
          Or drag and drop a music file to automatically populate.
        </Typography>
      </form>
    </DropArea>
  );
};
