import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table("playlists_tracks", function (table) {
    table
      .foreign("playlist_id")
      .references("playlists.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("track_id")
      .references("tracks.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
  await knex.schema.table("tracks_files", function (table) {
    table
      .foreign("file_id")
      .references("files.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("track_id")
      .references("tracks.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });


}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table("playlists_tracks", function (table) {
    table.dropForeign(["playlist_id"]);
    table.dropForeign(["track_id"]);
  });
  await knex.schema.table("tracks_files", function (table) {
    table.dropForeign(["file_id"]);
    table.dropForeign(["track_id"]);
  });
}
