import { gql, ApolloClient } from "apollo-boost";
import { FetchPlaylists } from "./__generated_types__/FetchPlaylists";
import { FetchPlaylist } from "./__generated_types__/FetchPlaylist";
import { WhoAmI } from "./__generated_types__/WhoAmI";

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
    });
    return data;
  }

  async playlist(id: string) {
    const { data } = await this.client.query({
      query: FETCH_PLAYLIST,
      variables: {
        id,
      },
    });
    return data;
  }
}
