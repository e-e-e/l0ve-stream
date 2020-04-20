import * as typeDefs from "./schema/schema.graphql";
import { IResolvers } from "graphql-tools";
import { UsersDataSource } from "./datasources/users";
import Knex from "knex";
import { PlaylistsDataSource } from "./datasources/playlists";
import { Track, TracksDataSource, TrackWithId } from "./datasources/tracks";
import { IBasicAuthedRequest } from "express-basic-auth";

type MutationResponse = {
  success: boolean;
  message: string;
};

function success<T extends Record<string, I>, I>(
  data: T
): T & MutationResponse {
  return {
    ...data,
    success: true,
    message: "",
  };
}

function handleMutationError<
  T extends MutationResponse,
  D extends Record<string, any>
>(fn: (parent: any, args: any, context: any) => Promise<D>) {
  return async (...args: [any, any, any]): Promise<T | MutationResponse> => {
    try {
      return success(await fn(...args));
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: e.message,
      };
    }
  };
}

const resolverMap: IResolvers = {
  Query: {
    whoami: async (parent, args, context) => {
      return context.dataSources.users.getUserByName(context.user);
    },
    user: async (parent, args, context) => {
      const data = await context.dataSources.users.getUser(args.id);
      return data;
    },
    users: (parent, args, context) => {
      return context.dataSources.users.getUsers(args.pageSize, args.after);
    },
    playlists: async (parent, args, context) => {
      return context.dataSources.playlists.getPlaylists(
        args.pageSize,
        args.after
      );
    },
    playlist: async (parent, args, context) => {
      const data = await context.dataSources.playlists.getPlaylist(
        args.playlist
      );
      return data;
    },
  },
  User: {
    playlists: (parent, args, context) => {
      return context.dataSources.playlists.getPlaylists(
        args.pageSize,
        args.after
      );
    },
  },
  Playlist: {
    tracks: (parent, args, context) => {
      return context.dataSources.playlists.getTracks(parent.id);
    },
    owner: (parent, args, context) => {
      return context.dataSources.users.getUser(parent.owner_id);
    },
  },
  Track: {
    files: () => {},
    links: () => {},
  },
  Mutation: {
    createPlaylist: handleMutationError(async (parent, args, context) => {
      const user = await context.dataSources.users.getUserByName(context.user);
      const playlistData = {
        title: args.data.title,
        description: args.data.description,
        owner_id: user.id,
        tracks: args.data.tracks,
      };
      const playlist = await context.dataSources.playlists.createPlaylist(
        playlistData
      );
      return {
        playlist,
      };
    }),
    updatePlaylist: handleMutationError(async (parent, args, context) => {
      // TODO: Only allow if the user is an owner
      const user = await context.dataSources.users.getUserByName(context.user);
      const playlistData = {
        id: args.data.id,
        title: args.data.title,
        description: args.data.description,
        owner_id: user.id,
        tracks: args.data.tracks,
      };
      const playlist = await context.dataSources.playlists.updatePlaylist(
        playlistData
      );
      return { playlist };
    }),
    deletePlaylist: handleMutationError(async (parent, args, context) => {
      // TODO: Only allow if the user is an owner
      await context.dataSources.playlists.deletePlaylist(args.id);
      return {};
    }),
    createTrack: handleMutationError(async (parent, args, context) => {
      // get number of tracks and add
      const track = context.dataSources.playlists.addTrack(
        args.playlistId,
        args.data,
        args.order
      );
      return { track };
    }),
    deleteTrack: handleMutationError(async (parent, args, context) => {
      await context.dataSources.playlists.deleteTrack(
        args.playlistId,
        args.trackId
      );
      return {};
    }),
    createUser: handleMutationError(async (parent, args, context) => {
      const user = (await context.dataSources.users.createUser(args.data))[0];
      return { user };
    }),
  },
};

export function createApolloServerConfig(db: Knex) {
  return {
    typeDefs,
    resolvers: resolverMap,
    context: (data: { req: IBasicAuthedRequest }) => {
      // console.log(data);
      return {
        user: data.req.auth.user,
      };
    },
    dataSources: () => {
      return {
        users: new UsersDataSource(db),
        playlists: new PlaylistsDataSource(db),
        tracks: new TracksDataSource(db),
      };
    },
  };
}
