import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GridCard } from "../components/grid_card/grid_card";
import { PlayIcon } from "../components/icons/icons";
import { Typography } from "../components/typography/typography";
import { FetchPlaylists } from "./__generated_types__/FetchPlaylists";
import { playlistUrl, useNavigationHandler } from "../routes/routes";
import { DropArea } from "../components/drop_area/drop_area";

const FETCH_PLAYLISTS = gql`
  query FetchPlaylists2 {
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

type PlaylistCardProps = {
  title: string;
  owner: string;
  description?: string | null;
  id: string;
};

const PlaylistCard = ({ title, owner, description, id }: PlaylistCardProps) => {
  const openPlaylist = useNavigationHandler(playlistUrl(id));
  return (
    <div>
      <GridCard
        onClick={openPlaylist}
        topLeft={
          <div>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="subtitle">{description}</Typography>
          </div>
        }
        bottomLeft={<Typography>{owner}</Typography>}
        bottomRight={
          <div style={{ textAlign: "center" }}>
            <PlayIcon />
          </div>
        }
        info={{ top: "2", bottom: "14m" }}
      />
    </div>
  );
};

function Playlists() {
  const { data, loading, error } = useQuery<FetchPlaylists>(FETCH_PLAYLISTS);

  return (
    <section>
      <Typography variant="h1">Playlists</Typography>
      {loading && <div>loading</div>}
      {error && <div>{error?.message}</div>}
      {data?.playlists?.map((v, i) => {
        if (!v || !v.id || !v.title || !v.owner?.name) return;
        return (
          <PlaylistCard
            key={`${i}-${v?.id}`}
            title={v?.title}
            owner={v?.owner?.name}
            id={v.id}
            description={v.description}
          />
        );
      })}
    </section>
  );
}

export default Playlists;
