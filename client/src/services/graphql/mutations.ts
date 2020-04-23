import { gql, ApolloClient } from "apollo-boost";
import {
  UpdatePlaylist,
  UpdatePlaylistVariables,
} from "./__generated_types__/UpdatePlaylist";
import {
  PlaylistInputWithId,
  TrackInput,
  TrackInputWithOptionalId,
} from "../../../__generated_types__/globalTypes";
import {
  DeletePlaylist,
  DeletePlaylistVariables,
} from "./__generated_types__/DeletePlaylist";
import {
  CreatePlaylist,
  CreatePlaylistVariables,
} from "./__generated_types__/CreatePlaylist";
import {
  CreateTrack,
  CreateTrackVariables,
} from "./__generated_types__/CreateTrack";
import { PLAYLIST_INFO } from "./fragments";

const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist(
    $title: String!
    $description: String!
    $tracks: [TrackInput!]
  ) {
    createPlaylist(
      data: { title: $title, description: $description, tracks: $tracks }
    ) {
      message
      success
      playlist {
        id
      }
    }
  }
`;

const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($playlist: PlaylistInputWithId) {
    updatePlaylist(data: $playlist) {
      message
      success
      playlist {
        ...PlaylistInfo
      }
    }
  }
  ${PLAYLIST_INFO}
`;

const INSERT_TRACK = gql`
  mutation CreateTrack($playlistId: ID, $data: TrackInput, $order: Int) {
    createTrack(playlistId: $playlistId, data: $data, order: $order) {
      message
      success
      track {
        id
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
  createPlaylist(
    playlist: CreatePlaylistVariables
  ): Promise<CreatePlaylist["createPlaylist"]>;
  updatePlaylist(
    playlist: PlaylistInputWithId
  ): Promise<UpdatePlaylist["updatePlaylist"]>;
  deletePlaylist(playlistId: string): Promise<void>;
  insertTrack(
    playlistId: string,
    track: TrackInput,
    order: number
  ): Promise<CreateTrack["createTrack"]>;
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

function sanitizeTrackInput(track: TrackInput): TrackInput {
  return {
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

  async createPlaylist(playlist: CreatePlaylistVariables) {
    const { data, errors } = await this.client.mutate<
      CreatePlaylist,
      CreatePlaylistVariables
    >({
      mutation: CREATE_PLAYLIST,
      variables: playlist,
    });
    if (!data?.createPlaylist?.success) {
      console.log(data, errors);
      throw new Error("what!!!");
    }
    return data?.createPlaylist;
  }

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

  async insertTrack(playlistId: string, track: TrackInput, order: number) {
    const { data, errors } = await this.client.mutate<
      CreateTrack,
      CreateTrackVariables
    >({
      mutation: INSERT_TRACK,
      variables: {
        playlistId,
        data: sanitizeTrackInput(track),
        order,
      },
    });
    if (!data?.createTrack?.success) {
      console.log(data, errors);
      throw new Error("what!!!");
    }
    return data?.createTrack;
  }
}
