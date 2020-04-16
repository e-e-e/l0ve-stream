import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Input } from "../components/input/input";
import { Button } from "../components/button/button";
import {
  CreatePlaylist as CreatePlaylistType,
  CreatePlaylistVariables,
} from "./__generated_types__/CreatePlaylist";
import { useHistory } from "react-router-dom";
import { playlistUrl } from "../routes/routes";
import { Typography } from "../components/typography/typography";
import { DropArea } from "../components/drop_area/drop_area";
import { PlaylistConverter } from "../services/playlist_converter/playlist_converter";

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist(
    $title: String!
    $description: String!
    $tracks: [TrackInput!]
  ) {
    createPlaylist(
      data: { title: $title, description: $description, tracks: $tracks }
    ) {
      message
      success
      playlist {
        id
      }
    }
  }
`;

const convertPlaylist = new PlaylistConverter();

export function CreatePlaylist() {
  const [create, { data, loading, error }] = useMutation<
    CreatePlaylistType,
    CreatePlaylistVariables
  >(CREATE_PLAYLIST);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const history = useHistory();
  const onSubmit = React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    // construct a FormData object, which fires the formdata event
    if (!(event.target instanceof HTMLFormElement)) return;
    const formdata = new FormData(event.target);
    const data = {
      title: formdata.get("title") as string,
      description: formdata.get("description") as string,
    };
    await create({ variables: data });
  }, []);
  const onFileDrop = React.useCallback(
    async (file: File) => {
      const data = await convertPlaylist.fromITunesXML(file);
      await create({ variables: data });
    },
    [create]
  );
  React.useEffect(() => {
    if (data && !data.createPlaylist?.success) {
      setMutationError(data.createPlaylist?.message || null);
      return;
    }
    const id = data?.createPlaylist?.playlist?.id;
    id && history.push(playlistUrl(id));
  }, [data, setMutationError, history]);
  return (
    <DropArea
      onFileDrop={onFileDrop}
      overlayText="Drop any iTunes playlist XML"
    >
      <form onSubmit={onSubmit}>
        <Typography variant="h1">Create a playlist</Typography>
        <Input name="title" placeholder="Playlist name" />
        <Input name="description" type="text" placeholder="Description" />
        <Button type="submit" disabled={loading}>
          Create
        </Button>
        <Typography>Or drag and drop a iTunes playlist xml file</Typography>
        {error && <div>{error}</div>}
        {mutationError && <div>{mutationError}</div>}
      </form>
    </DropArea>
  );
}
