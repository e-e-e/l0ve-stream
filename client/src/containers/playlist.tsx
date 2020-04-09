import { GridCard } from "../components/grid_card/grid_card";
import { Typography } from "../components/typography/typography";
import { PlayIcon } from "../components/icons/icons";
import { Section } from "../components/section/section";
import { TrackItem } from "../components/track_item/track_item";
import React, { useCallback, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import {
  FetchPlaylist,
  FetchPlaylistVariables,
} from "./__generated_types__/FetchPlaylist";
import { useParams } from "react-router-dom";
import { Button } from "../components/button/button";
import { AddTrackView } from "./add_track";
import { LayerButton } from "../components/layer_button/layer_button";

const FETCH_PLAYLIST = gql`
  query FetchPlaylist($id: ID) {
    playlist(playlist: $id) {
      id
      title
      description
      tracks {
        id
        title
        album
        artist
        year
        genre
      }
      owner {
        id
        name
      }
    }
  }
`;
export const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<
    FetchPlaylist,
    FetchPlaylistVariables
  >(FETCH_PLAYLIST, { variables: { id } });
  const AddTrack = React.useCallback(
    ({ close }: { close?(): void }) => (
      <AddTrackView close={close} playlistId={id} />
    ),
    [id]
  );
  if (!data || !data.playlist) {
    return <>Not found</>;
  }
  const playlist = data.playlist;
  return (
    <div>
      <div>{error}</div>
      <div>{loading}</div>
      <GridCard
        topLeft={<Typography variant="h2">{playlist.title}</Typography>}
        bottomLeft={<Typography>{playlist.owner?.name}</Typography>}
        bottomRight={
          <div style={{ textAlign: "center" }}>
            <PlayIcon />
          </div>
        }
        info={{ top: "2", bottom: "14m" }}
      />
      <p>{playlist.description}</p>
      <Section>
        {playlist.tracks?.map((track, i) => {
          if (!track?.id || !track.title || !track.artist || !track.album)
            return;
          return (
            <TrackItem
              key={track.id}
              index={i}
              title={track.title}
              artist={track.artist}
              album={track.album}
            />
          );
        })}
        <LayerButton Content={AddTrack}>Add new track</LayerButton>
      </Section>
    </div>
  );
};
