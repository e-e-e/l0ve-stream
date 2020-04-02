import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GridCard } from "../components/grid_card/grid_card";
import { PlayIcon, PointIcon } from "../components/icons/icons";
import { Typography } from "../components/typography/typography";
import { TrackItem } from "../components/track_item/track_item";

const FETCH_PLAYLISTS = gql`
  query {
    playlists {
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

const List = ({ children }: { children: React.ReactNode[] }) => (
  <ul>{children}</ul>
);

const PlaylistItem = ({ data }: { data: any }) => {
  return (
    <div>
      <GridCard
        topLeft={<h2>{data.title}</h2>}
      />
      <p>{data.description}</p>
      <div>
        {data.tracks?.map((track: any, i: number) => {
          return (
            <TrackItem
              index={i}
              title={track.title}
              artist={track.artist}
              album={track.album}
            />
          );
        })}
      </div>
    </div>
  );
};

function Playlists() {
  const { data, loading, error } = useQuery(FETCH_PLAYLISTS);

  return (
    <section>
      <Typography variant="h1">Playlists</Typography>
      <GridCard
        topLeft={"some image"}
        info={{ top: "2", bottom: "14m" }}
        bottomLeft={"some text"}
        bottomRight={"some icon"}
      />
      {loading && <div>loading</div>}
      {error && <div>{error?.message}</div>}
      {data &&
        data.playlists &&
        data.playlists.map((v: any) => {
          return <PlaylistItem data={v} />;
        })}
    </section>
  );
}

export default Playlists;
