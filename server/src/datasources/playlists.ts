import { DataSource, DataSourceConfig } from "apollo-datasource";
import Knex from "knex";

export type Track = {
  title: string;
  artist: string;
  album: string;
  genre?: string;
  year?: number;
};
export type TrackWithId = Track & { id: string };
export type TrackWithOptionalId = Track & { id?: string };

export type Playlist = {
  title: string;
  description: string;
  owner_id: string;
  tracks?: Track[];
};

export type PlaylistWithId = Playlist & { id: string };

export class PlaylistsDataSource extends DataSource {
  constructor(private readonly database: Knex) {
    super();
  }

  async createPlaylist(playlist: Playlist): Promise<PlaylistWithId> {
    const insertData = {
      title: playlist.title,
      description: playlist.description,
      owner_id: playlist.owner_id,
    };
    const inserted: PlaylistWithId = (
      await this.database
        .insert(insertData)
        .into("playlists")
        .returning("*")
        .then((x) => x)
    )[0];
    const tracks: TrackWithId[] = [];
    if (playlist.tracks) {
      for (let i = 0; i < playlist.tracks.length; i++) {
        const trackInput = playlist.tracks[i];
        const track = await this.addTrack(inserted.id, trackInput, i);
        tracks.push(track);
      }
    }
    return {
      ...inserted,
      tracks,
    };
  }

  async updatePlaylist(
    playlist: PlaylistWithId & { tracks?: TrackWithOptionalId[] }
  ): Promise<PlaylistWithId> {
    // first update playlist
    const playlistData = {
      title: playlist.title,
      description: playlist.description,
      owner_id: playlist.owner_id,
    };
    const updated = (
      await this.database("playlists")
        .update(playlistData)
        .where({ id: playlist.id })
        .returning("*")
    )[0];
    // then update tracks
    const tracks: TrackWithId[] = [];
    if (playlist.tracks) {
      for (let i = 0; i < playlist.tracks.length; i++) {
        const trackData = playlist.tracks[i]
        const track = trackData.id
          ? await this.updateTrack(playlist.id, trackData as TrackWithId, i)
          : await this.addTrack(playlist.id, playlist.tracks[i], i);
        tracks.push(track);
      }
    }
    return {
      ...updated,
      tracks,
    };
  }
  async getPlaylist(id: string): Promise<PlaylistWithId> {
    return this.database.select("*").from("playlists").where({ id }).first();
  }

  async getPlaylists(
    pageSize?: number,
    after?: string
  ): Promise<PlaylistWithId[]> {
    return this.database
      .select("*")
      .from("playlists")
      .offset(after ? parseInt(after, 10) : 0)
      .limit(pageSize || 20);
  }

  async getTracks(id: string): Promise<TrackWithId[]> {
    return this.database
      .select("*")
      .from("playlists_tracks")
      .where({ playlist_id: id })
      .join("tracks", "tracks.id", "=", "playlists_tracks.track_id");
  }

  async addTrack(
    id: string,
    track: Track,
    order: number
  ): Promise<TrackWithId> {
    const trackData = {
      title: track.title,
      artist: track.artist,
      album: track.album,
      genre: track.genre,
      year: track.year,
    };
    const trackWithId = (
      await this.database.insert(trackData).into("tracks").returning("*")
    )[0];
    await this.database
      .insert({ track_id: trackWithId.id, playlist_id: id, order })
      .into("playlists_tracks");
    return trackWithId[0];
  }

  async updateTrack(
    id: string,
    track: TrackWithId,
    order: number
  ): Promise<TrackWithId> {
    const trackData = {
      title: track.title,
      artist: track.artist,
      album: track.album,
      genre: track.genre,
      year: track.year,
    };
    const trackWithId = (
      await this.database("tracks").update(trackData).returning("*")
    )[0];
    await this.database("playlists_tracks")
      .update({ order })
      .where({ track_id: track.id, playlist_id: id });
    return trackWithId[0];
  }

  async deleteTrack(playlistId: string, trackId: string) {
    await this.database.delete().from("tracks").where({ id: trackId });
    await this.database
      .delete()
      .from("playlists_tracks")
      .where({ track_id: trackId, playlist_id: playlistId });
  }

  async deletePlaylist(playlist: string) {
    return this.database.delete().from("playlists").where({ id: playlist });
  }
}
