import { gql, ApolloClient } from "apollo-boost";
import {
  UpdatePlaylist,
  UpdatePlaylistVariables,
} from "./__generated_types__/UpdatePlaylist";
import { PlaylistInputWithId } from "../../../__generated_types__/globalTypes";

const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($playlist: PlaylistInputWithId) {
    updatePlaylist(data: $playlist) {
      message
      success
      playlist {
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
  }
`;
export interface GraphMutationsService {
  updatePlaylist(
    playlist: PlaylistInputWithId
  ): Promise<UpdatePlaylist["updatePlaylist"]>;
  // deletePlaylist(): void;
}
//
// function sanitize<T extends Record<string, any>>(obj: T): T {
//
// }

export class GraphMutationsClient implements GraphMutationsService {
  constructor(private readonly client: ApolloClient<unknown>) {}

  async updatePlaylist(playlist: PlaylistInputWithId) {
    console.log(playlist);
    const { data, errors } = await this.client.mutate<
      UpdatePlaylist,
      UpdatePlaylistVariables
    >({
      mutation: UPDATE_PLAYLIST,
      variables: {
        playlist,
      },
    });
    if (!data?.updatePlaylist?.success || !data?.updatePlaylist.playlist) {
      console.log(data, errors);
      throw new Error("what!!!");
    }
    return data?.updatePlaylist;
  }
}
