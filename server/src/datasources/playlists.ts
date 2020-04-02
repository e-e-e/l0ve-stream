import { DataSource, DataSourceConfig } from "apollo-datasource";
import Knex from "knex";

export type Playlist = {
  title: string;
  description: string;
  owner_id: string;
};

export type PlaylistWithId = Playlist & { id: string };

export type Track = {
  title: string;
  artist: string;
  album: string;
  genre?: string;
  year?: number;
};

export type TrackWithId = Track & { id: string };

export class PlaylistsDataSource extends DataSource {
  constructor(private readonly database: Knex) {
    super();
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
    const trackWithId = (
      await this.database.insert(track).into("tracks").returning("*")
    )[0];
    await this.database
      .insert({ track_id: trackWithId.id, playlist_id: id, order })
      .into("playlists_tracks");
    return trackWithId[0];
  }

  async createPlaylist(playlist: Playlist): Promise<PlaylistWithId> {
    return this.database
      .insert(playlist)
      .into("playlists")
      .returning("*")
      .then((x) => x) as Promise<PlaylistWithId>;
  }

  async deletePlaylist(playlist: string) {
    this.database.delete().from("playlist").where({ id: playlist });
  }
}
