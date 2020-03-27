import {DataSource, DataSourceConfig} from 'apollo-datasource';
import Knex from 'knex';

export type Track = {
  title: string,
  artist: string
  album: string
  genre?: string
  year?: number
}

export type TrackWithId = Track & { id: string }

export class TracksDataSource extends DataSource {

  constructor(private readonly database: Knex) {
    super();
  }

  async getTrack(id: string): Promise<TrackWithId> {
    console.log(id);
    return this.database
      .select('*')
      .from('tracks')
      .where({ id })
      .first()
  }

  async getTracks(pageSize?: number, after?: string): Promise<TrackWithId[]> {
    return this.database
      .select('*')
      .from('tracks')
      .offset(after ? parseInt(after, 10) : 0)
      .limit(pageSize || 20)
  }

  async createTrack(track: Track): Promise<TrackWithId> {
    return this.database
      .insert(track)
      .into('tracks')
      .returning('*')
      .then(x => x) as Promise<TrackWithId>;
  }
}
