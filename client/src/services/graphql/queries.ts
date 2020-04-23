import { gql, ApolloClient } from "apollo-boost";
import { FetchPlaylists } from "./__generated_types__/FetchPlaylists";
import { FetchPlaylist } from "./__generated_types__/FetchPlaylist";
import { WhoAmI } from "./__generated_types__/WhoAmI";
import { PLAYLIST_INFO } from "./fragments";

const WHO_AM_I = gql`
  query WhoAmI {
    whoami {
      id
      name
      role
    }
  }
`;

const FETCH_PLAYLISTS = gql`
  query FetchPlaylists {
    playlists {
      ...PlaylistInfo
    }
  }
  ${PLAYLIST_INFO}
`;

const FETCH_PLAYLIST = gql`
  query FetchPlaylist($id: ID) {
    playlist(playlist: $id) {
      ...PlaylistInfo
    }
  }
  ${PLAYLIST_INFO}
`;
export interface GraphQueriesService {
  whoAmI(): Promise<WhoAmI>;
  playlists(): Promise<FetchPlaylists>;
  playlist(id: string): Promise<FetchPlaylist>;
}

export class GraphQueriesClient implements GraphQueriesService {
  constructor(private readonly client: ApolloClient<unknown>) {}

  async whoAmI() {
    const { data } = await this.client.query({
      query: WHO_AM_I,
    });
    return data;
  }

  async playlists() {
    const { data } = await this.client.query({
      query: FETCH_PLAYLISTS,
      fetchPolicy: "no-cache",
    });
    return data;
  }

  async playlist(id: string) {
    const { data } = await this.client.query({
      query: FETCH_PLAYLIST,
      fetchPolicy: "no-cache",
      variables: {
        id,
      },
    });
    return data;
  }
}
