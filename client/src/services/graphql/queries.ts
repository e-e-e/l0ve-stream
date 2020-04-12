import { gql, ApolloClient } from "apollo-boost";
import { FetchPlaylists } from "./__generated_types__/FetchPlaylists";
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

const FETCH_PLAYLISTS_GQL = gql`
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

export interface GraphQueriesService {
  whoAmI(): Promise<WhoAmI>;
  playlists(): Promise<FetchPlaylists>;
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
      query: FETCH_PLAYLISTS_GQL,
    });
    return data;
  }
}
