import { gql, ApolloClient } from "apollo-boost";
import {
  UpdatePlaylist,
  UpdatePlaylistVariables,
} from "./__generated_types__/UpdatePlaylist";
import {
  PlaylistInputWithId,
  TrackInputWithOptionalId,
} from "../../../__generated_types__/globalTypes";
import {
  DeletePlaylist,
  DeletePlaylistVariables,
} from "./__generated_types__/DeletePlaylist";

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

const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($id: ID) {
    deletePlaylist(id: $id) {
      message
      success
    }
  }
`;

export interface GraphMutationsService {
  updatePlaylist(
    playlist: PlaylistInputWithId
  ): Promise<UpdatePlaylist["updatePlaylist"]>;
  deletePlaylist(playlistId: string): Promise<void>;
}

function sanitizeTrackInputWithOptionalId(
  track: TrackInputWithOptionalId
): TrackInputWithOptionalId {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    year: track.year,
    genre: track.genre,
  };
}

function sanitizePlaylistInputWithId(
  playlist: PlaylistInputWithId
): PlaylistInputWithId {
  return {
    id: playlist.id,
    title: playlist.title,
    description: playlist.description,
    tracks: playlist.tracks?.map(sanitizeTrackInputWithOptionalId) ?? [],
  };
}

export class GraphMutationsClient implements GraphMutationsService {
  constructor(private readonly client: ApolloClient<unknown>) {}

  async updatePlaylist(playlist: PlaylistInputWithId) {
    const { data, errors } = await this.client.mutate<
      UpdatePlaylist,
      UpdatePlaylistVariables
    >({
      mutation: UPDATE_PLAYLIST,
      variables: {
        playlist: sanitizePlaylistInputWithId(playlist),
      },
    });
    if (!data?.updatePlaylist?.success || !data?.updatePlaylist.playlist) {
      console.log(data, errors);
      throw new Error("what!!!");
    }
    return data?.updatePlaylist;
  }

  async deletePlaylist(playlistId: string) {
    const { data, errors } = await this.client.mutate<
      DeletePlaylist,
      DeletePlaylistVariables
    >({
      mutation: DELETE_PLAYLIST,
      variables: {
        id: playlistId,
      },
    });
    if (!data?.deletePlaylist?.success) {
      console.log(data, errors);
      throw new Error("what!!!");
    }
    return;
  }
}
