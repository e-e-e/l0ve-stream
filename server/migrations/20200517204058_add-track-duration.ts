import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.table("tracks", function (table) {
    table.float("duration");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.table("tracks", function (table) {
    table.dropColumn("duration");
  });
}
