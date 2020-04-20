import React from "react";
import { Input } from "../components/input/input";
import { Button } from "../components/button/button";
import { Typography } from "../components/typography/typography";
import { DropArea } from "../components/drop_area/drop_area";
import { PlaylistConverter } from "../services/playlist_converter/playlist_converter";
import { useDispatch } from "react-redux";
import { createPlaylist } from "../redux/actions/playlists_actions";

const convertPlaylist = new PlaylistConverter();

export function CreatePlaylist() {
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      // construct a FormData object, which fires the formdata event
      if (!(event.target instanceof HTMLFormElement)) return;
      const formdata = new FormData(event.target);
      const data = {
        title: formdata.get("title") as string,
        description: formdata.get("description") as string,
      };
      dispatch(createPlaylist(data));
    },
    [dispatch]
  );
  const onFileDrop = React.useCallback(
    async (file: File) => {
      const data = await convertPlaylist.fromITunesXML(file);
      dispatch(createPlaylist(data));
    },
    [dispatch]
  );
  return (
    <DropArea
      onFileDrop={onFileDrop}
      overlayText="Drop any iTunes playlist XML"
    >
      <form onSubmit={onSubmit}>
        <Typography variant="h1">Create a playlist</Typography>
        <Input name="title" placeholder="Playlist name" />
        <Input name="description" type="text" placeholder="Description" />
        <Button type="submit" disabled={false}>
          Create
        </Button>
        <Typography>Or drag and drop a iTunes playlist xml file</Typography>
      </form>
    </DropArea>
  );
}
