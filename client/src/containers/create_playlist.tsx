import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Input } from "../components/input/input";
import {Button} from "../components/button/button";
import {CreatePlaylist, CreatePlaylistVariables} from "./__generated_types__/CreatePlaylist";

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

export function CreatePlaylist({ userId }: { userId: string }) {
  const [create, { data, loading, error }] = useMutation<
    CreatePlaylist,
    CreatePlaylistVariables
  >(CREATE_PLAYLIST);
  const onSubmit = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log("submitted", event.target);
    // construct a FormData object, which fires the formdata event
    if (!(event.target instanceof HTMLFormElement)) return;
    const formdata = new FormData(event.target);
    const data = {
      title: formdata.get("title") as string,
      description: formdata.get("description") as string,
    };
    create({ variables: data });
  }, []);
  return (
    <form onSubmit={onSubmit}>
      <Input name="title" placeholder="Playlist name" />
      <Input name="description" type="text" placeholder="Description" />
      <Button type="submit">Create</Button>
      <Button type="submit" disabled={true}>Disabled</Button>
      {/*<input type="submit" value="Create" />*/}
    </form>
  );
}
