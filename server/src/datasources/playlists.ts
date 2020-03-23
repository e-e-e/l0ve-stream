import {DataSource, DataSourceConfig} from 'apollo-datasource';
import * as Knex from 'knex';


export type Playlist = {
  title: string,
  description: string,
  owner_id: string,
}

export type PlaylistWithId = Playlist & { id: string }

export class PlaylistsDataSource extends DataSource {

  constructor(private readonly database: Knex) {
    super();
  }

  async getPlaylist(id: string): Promise<PlaylistWithId> {
    return this.database
      .select('*')
      .from('playlists')
      .where({ id })
      .first()
  }

  async getPlaylists(pageSize?: number, after?: string): Promise<PlaylistWithId[]> {
    return this.database
      .select('*')
      .from('playlists')
      .offset(after ? parseInt(after, 10) : 0)
      .limit(pageSize || 20)
  }

  async createPlaylist(playlist: Playlist): Promise<PlaylistWithId> {
    return this.database
      .insert(playlist)
      .into('playlists')
      .returning('*')
      .then(x => x) as Promise<PlaylistWithId>;
  }

  async deletePlaylist(playlist: string) {
    this.database
      .delete()
      .from('playlist')
      .where({ id: playlist });
  }

  async addTrack(playlist: string, track: string, index: number) {
    return this.database
      .insert({
        playlist_id: playlist,
        track_id: track,
        order: index,
      })
      .into('playlists_tracks')
  }
}
