import React from "react";
import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";
import { Grid } from "../components/grid_card/grid_card";
import {PlayIcon} from "../components/icons/icons";
import {Typography} from "../components/typography/typography";

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
`

const List = ({children} : {children: React.ReactNode[]}) => (<ul>{children}</ul>);

const Track = ({
  index,
  title,
  artist,
  album,
  year,
 } : { index: number, title: string, artist: string, album: string, year?: number }) => {
  return <li>
    {title}, {artist}, {album}
  </li>
};

const PlaylistItem = ({ data }: { data: any}) => {
  return (
    <li>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <ol>
        {data.tracks?.map((track: any, i: number) => {
          return <Track index={i} title={track.title} artist={track.artist} album={track.album} />;
        })}
      </ol>
    </li>
  );
};

function Playlists() {
  const {
    data,
    loading,
    error,
  } = useQuery(FETCH_PLAYLISTS);

  return (
    <section>
      <Typography variant="h1">Playlists</Typography>
      <Grid
        topLeft={'some image'}
        info={{top: "2", bottom: "14m"}}
        bottomLeft={'some text'}
        bottomRight={'some icon'}
      />
      {loading && <div>loading</div>}
      {error && <div>{error?.message}</div>}
      <List>
      {data && data.playlists && data.playlists.map((v: any) => {
         return <PlaylistItem data={v}/>
      })}
      </List>
    </section>
  );
}

export default Playlists;
