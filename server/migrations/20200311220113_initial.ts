import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  try {
    await knex.schema.raw('CREATE EXTENSION "pgcrypto";')
  } catch (e) { }
  try {
    await knex.schema.raw('CREATE EXTENSION "uuid-ossp";')
  } catch (e) { }
  return knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('name', 255).notNullable().unique();
      table.integer('role').notNullable().unsigned();
    })
    .createTable('playlists', function (table) {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('title', 255).notNullable();
      table.text('description');
      table.uuid('owner_id');
      table.unique(['title', 'owner_id']);
    })
    .createTable('tracks', function (table) {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('title', 1000).notNullable();
      table.string('artist', 1000).notNullable();
      table.string('album', 512).notNullable();
      table.string('genre', 1000);
      table.integer('year').unsigned();
    })
    .createTable('files', function (table) {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('filename', 1000).notNullable().unique();
      table.string('type').notNullable();
      table.integer('size').notNullable();
    })
    .createTable('links', function (table) {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v1mc()'));
      table.string('uri', 1024);
      table.string('type', 128);
      table.unique(['uri', 'type']);
    })
    .createTable('playlists_tracks', function (table) {
      table.uuid('playlist_id').notNullable();
      table.uuid('track_id').notNullable();
      table.integer('order').unsigned();
      table.unique(['playlist_id','track_id', 'order']);
    })
    .createTable('tracks_files', function (table) {
      table.uuid('track_id').notNullable();
      table.uuid('file_id').notNullable();
      table.integer('order').unsigned();
      table.unique(['track_id', 'file_id', 'order']);
    });
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('playlists')
    .dropTableIfExists('tracks')
    .dropTableIfExists('files')
    .dropTableIfExists('links')
    .dropTableIfExists('playlists_tracks')
    .dropTableIfExists('tracks_files')
}

