import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const CREATE_PLAYLIST = gql`
  mutation createPlaylist(
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

function CreatePlaylist({ userId }: { userId: string }) {
  const [create, { data, loading, error }] = useMutation(CREATE_PLAYLIST);
  const onSubmit = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log("submitted", event.target);
    // construct a FormData object, which fires the formdata event
    if (!(event.target instanceof HTMLFormElement)) return;
    const formdata = new FormData(event.target);
    const data = {
      title: formdata.get("title"),
      description: formdata.get("description"),
    };
    create({ variables: data });
  }, []);
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Title:</label>
      <input name="title" type="input" placeholder="playlist name" />
      <label htmlFor="title">Description:</label>
      <input name="description" type="text" />
      <input type="submit" value="Create" />
    </form>
  );
}

export default CreatePlaylist;
