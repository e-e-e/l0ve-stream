import { Input } from "../components/input/input";
import React from "react";
import { Button } from "../components/button/button";
import { DropArea } from "../components/drop_area/drop_area";
import { Typography } from "../components/typography/typography";
import { useDispatch } from "react-redux";
import { createPlaylistTrack } from "../redux/actions/playlists_actions";
import { TrackInput } from "../../__generated_types__/globalTypes";
import { useParams } from "react-router-dom";

type AddTrackProps = {
  close?(): void;
};

export const AddTrackView = ({ close }: AddTrackProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [trackData, setTrackData] = React.useState<
    TrackInput & { file?: File }
  >({
    title: "",
    artist: "",
    album: "",
  });
  const submit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!(event.target instanceof HTMLFormElement)) return;
      dispatch(createPlaylistTrack({ playlistId: id, track: trackData }));
      close?.();
    },
    [close, dispatch, id, trackData]
  );
  // TODO: think about generalising form input
  const onTitleChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, title: value }));
    },
    [setTrackData]
  );
  const onArtistChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, artist: value }));
    },
    [setTrackData]
  );
  const onAlbumChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, album: value }));
    },
    [setTrackData]
  );
  const onFileChange = React.useCallback(
    (value?: File) => {
      console.log(value);
      setTrackData((state) => ({ ...state, file: value }));
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
          value={trackData.title}
        />
        <Input
          name="artist"
          placeholder="artist/s"
          onChange={onArtistChange}
          value={trackData.artist}
        />
        <Input
          name="album"
          placeholder="album"
          onChange={onAlbumChange}
          value={trackData.album}
        />
        <Input name="file" type="file" onChange={onFileChange} />
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
