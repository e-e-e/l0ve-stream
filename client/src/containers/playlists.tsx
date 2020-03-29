import React from "react";
import {gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";

const FETCH_PLAYLISTS = gql`
    query {
        playlists {
            id
            title
            description
            owner {
                id
                name
            }
        }
    }
`

const List = ({children} : {children: React.ReactNode[]}) => (<ul>{children}</ul>);
const PlaylistItem = ({ data }: { data: any}) => (<li>{JSON.stringify(data)}</li>);

function Playlists() {
  const {
    data,
    loading,
    error,
  } = useQuery(FETCH_PLAYLISTS);

  return (
    <section>
      <h2>Playlists</h2>
      {loading && <div>loading</div>}
      {error && <div>{error}</div>}
      <List>
      {data && data.playlists && data.playlists.map((v: any) => {
        console.log(v);
         return <PlaylistItem data={v}/>
      })}
      </List>
    </section>
  );
}

export default Playlists;
