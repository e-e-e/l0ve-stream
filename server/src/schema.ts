import * as typeDefs from './schema/schema.graphql';
import {IResolvers} from 'graphql-tools';
import {UsersDataSource} from "./datasources/users";
import * as Knex from "knex";
import {PlaylistsDataSource} from "./datasources/playlists";
import {Track, TracksDataSource, TrackWithId} from "./datasources/tracks";

type MutationResponse = {
  success: boolean,
  message: string,
}

function handleMutationError<T extends MutationResponse, D extends Record<string, any>>(fn: (parent: any, args: any, context: any) => Promise<D>) {
  return async (...args: [any, any, any]): Promise<T | MutationResponse> => {
    try {
      return success(await fn(...args));
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  }
}

function success<T extends Record<string, I>, I>(data: T): T & MutationResponse {
  return {
    ...data,
    success: true,
    message: '',
  }
}

const resolverMap: IResolvers = {
  Query: {
    user: (parent, args, context) => {
      return context.dataSources.users.getUser(args.id);
    },
    users: (parent, args, context) => {
      return context.dataSources.users.getUsers(args.pageSize, args.after);
    },
    playlists: (parent, args, context) => {
      return context.dataSources.playlists.getPlaylists(args.pageSize, args.after)
    }
  },
  User: {
    playlists: (parent, args, context) => {
      console.log(parent);
      // return context.dataSources.playlists.getPlaylists(args.pageSize, args.after)
    }
  },
  Playlist: {
    tracks: () => {

    }
  },
  Track: {
    files: () => {

    },
    links: () => {

    }
  },
  Mutation: {
    createPlaylist: handleMutationError(async (parent, args, context) => {
      // map to datasource
      const playlistData = {
        title: args.data.title,
        description: args.data.description,
        owner_id: args.data.owner,
      };
      const playlist = await context.dataSources.playlists.createPlaylist(playlistData);
      const tracks: TrackWithId[] = [];
      for (let i = 0; i < args.data.tracks.length; i++) {
        const trackInput = args.data.tracks[i];
        const trackData = {
          title: trackInput.title,
          artist: trackInput.artist,
          album: trackInput.album,
          genre: trackInput.genre,
          year: trackInput.year
        };
        const track = await context.dataSources.tracks.addTrack(trackData);
        await context.dataSources.playlists.addTrack(playlist.id, track.id, i);
        tracks.push(track)
      }
      return {
        playlist: {
          ...playlist,
          tracks,
        }
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
      const user = await context.dataSources.users.createUser(args.data);
      return {user};
    })
  }
};

export function createApolloServerContext(db: Knex) {
  return {
    typeDefs,
    resolvers: resolverMap,
    dataSources: () => {
      return {
        users: new UsersDataSource(db),
        playlists: new PlaylistsDataSource(db),
        tracks: new TracksDataSource(db),
      };
    }
  }
};
