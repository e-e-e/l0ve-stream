import { DataSource } from "apollo-datasource";
import Knex from "knex";

export class TracksDataSource extends DataSource {
  constructor(private readonly database: Knex) {
    super();
  }

  async getFiles(id: string) {
    return this.database
      .select("*")
      .from("tracks_files")
      .where({ track_id: id })
      .join("files", "files.id", "=", "tracks_files.file_id");
  }
}
