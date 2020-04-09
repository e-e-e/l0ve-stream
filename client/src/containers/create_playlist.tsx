import React, { useEffect } from "react";
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
import {Typography} from "../components/typography/typography";

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist(
    $title: String!
    $description: String!
    $tracks: [TrackInput]
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

export function CreatePlaylist() {
  const [create, { data, loading, error }] = useMutation<
    CreatePlaylistType,
    CreatePlaylistVariables
  >(CREATE_PLAYLIST);
  const history = useHistory();
  const onSubmit = React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("submitted", event.target);
    // construct a FormData object, which fires the formdata event
    if (!(event.target instanceof HTMLFormElement)) return;
    const formdata = new FormData(event.target);
    const data = {
      title: formdata.get("title") as string,
      description: formdata.get("description") as string,
    };
    await create({ variables: data });
  }, []);
  React.useEffect(() => {
    const id = data?.createPlaylist?.playlist?.id;
    id && history.push(playlistUrl(id));
  }, [data]);
  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h1">Create a playlist</Typography>
      <Input name="title" placeholder="Playlist name" />
      <Input name="description" type="text" placeholder="Description" />
      <Button type="submit" disabled={loading}>
        Create
      </Button>
      {error && <div>{error}</div>}
    </form>
  );
}
