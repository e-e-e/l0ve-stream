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

function handleMutationError<
  T extends MutationResponse,
  D extends Record<string, any>
>(fn: (parent: any, args: any, context: any) => Promise<D>) {
  return async (...args: [any, any, any]): Promise<T | MutationResponse> => {
    try {
      return success(await fn(...args));
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  };
}

function success<T extends Record<string, I>, I>(
  data: T
): T & MutationResponse {
  return {
    ...data,
    success: true,
    message: "",
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
      // console.log('ppp', parent);
      return context.dataSources.playlists.getTracks(parent.id);
    },
    owner: (parent, args, context) => {
      // console.log('ppp', parent);
      return context.dataSources.users.getUser(parent.owner_id);
    },
  },
  Track: {
    files: () => {},
    links: () => {},
  },
  Mutation: {
    createPlaylist: handleMutationError(async (parent, args, context) => {
      // map to datasource
      const user = await context.dataSources.users.getUserByName(context.user);
      console.log(args);
      const playlistData = {
        title: args.data.title,
        description: args.data.description,
        owner_id: user.id,
      };
      const playlist = (
        await context.dataSources.playlists.createPlaylist(playlistData)
      )[0];
      const tracks: TrackWithId[] = [];
      if (args.data.tracks) {
        for (let i = 0; i < args.data.tracks.length; i++) {
          const trackInput = args.data.tracks[i];
          const trackData = {
            title: trackInput.title,
            artist: trackInput.artist,
            album: trackInput.album,
            genre: trackInput.genre,
            year: trackInput.year,
          };
          const track = await context.dataSources.playlists.addTrack(
            playlist.id,
            trackData,
            i
          );
          tracks.push(track);
        }
      }
      return {
        playlist: {
          ...playlist,
          tracks,
        },
      };
    }),
    deletePlaylist: handleMutationError(async (parent, args, context) => {
      await context.dataSources.playlists.deletePlaylist(args.id);
      return {};
    }),
    createTrack: handleMutationError(async (parent, args, context) => {
      const track = context.dataSources.playlists.createTrack(args.data);
      return { track };
    }),
    deleteTrack: handleMutationError(async (parent, args, context) => {
      await context.dataSources.playlists.deleteTrack(args.id);
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
