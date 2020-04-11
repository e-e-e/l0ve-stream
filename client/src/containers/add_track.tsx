import { Input } from "../components/input/input";
import React from "react";
import { Button } from "../components/button/button";
import { DropArea } from "../components/drop_area/drop_area";
import { Typography } from "../components/typography/typography";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import {
  CreateTrack,
  CreateTrackVariables,
} from "./__generated_types__/CreateTrack";

type AddTrackProps = {
  playlistId: string;
  close?(): void;
};

const CREATE_TRACK = gql`
  mutation CreateTrack($playlist: ID!, $data: TrackInput!, $order: Int) {
    createTrack(id: $playlist, data: $data, order: $order) {
      message
      success
      track {
        id
      }
    }
  }
`;

export const AddTrackView = ({ close, playlistId }: AddTrackProps) => {
  const [createTrack, { data, error }] = useMutation<
    CreateTrack,
    CreateTrackVariables
  >(CREATE_TRACK);
  console.log(data);
  console.log(error);
  const submit = React.useCallback(
    async (event: React.FormEvent) => {
      console.log("submit");
      event.preventDefault();
      console.log(event);
      if(!(event.target instanceof HTMLFormElement)) return
      const formdata = new FormData(event.target);
      const data = {
        title: formdata.get("title") as string,
        artist: formdata.get("artist") as string,
        album: formdata.get("album") as string,
      };
      await createTrack({
        variables: { playlist: playlistId, data, order: 0 },
      });
      // close?.();
    },
    [playlistId]
  );
  return (
    <DropArea onFileDrop={() => {}} overlayText="Drop a music file here.">
      <form onSubmit={submit} onClick={() => {}}>
        <Input name="title" placeholder="title" />
        <Input name="artist" placeholder="artist/s" />
        <Input name="album" placeholder="album" />
        <Button type="submit">Add new track</Button>
        <Typography>
          Or drag and drop a music file to automatically populate.
        </Typography>
      </form>
    </DropArea>
  );
};
