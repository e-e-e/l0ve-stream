import React from "react";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost";

const CREATE_PLAYLIST = gql`
  mutation createPlaylist(
      $title: String!, 
      $description: String!, 
      $owner: ID!, 
      $tracks: [TrackInput],
  ) {
      createPlaylist(data: {
          title: $title
          description: $description
          tracks: $tracks
          owner: $owner
      }) {
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
    console.log('submitted', event.target);
    // construct a FormData object, which fires the formdata event
    if (!(event.target instanceof HTMLFormElement)) return;
    const formdata = new FormData(event.target);
    const data = {
      title: formdata.get('title'),
      description: formdata.get('description'),
      owner: userId
    };
    create({ variables: data });
  }, []);
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Title:</label>
      <input name="title" type="input" placeholder="playlist name"/>
      <label htmlFor="title">Description:</label>
      <input name="description" type="text"/>
      <input type="submit" value="Create"/>
    </form>
  );
}

export default CreatePlaylist;
