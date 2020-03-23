import * as knex from 'knex';
// import { default as connections } from '../knexfile';

const connections: Record<'development' | 'production', Object> = {
  development: {
    client: "pg",
      connection: {
      database: "lovestream",
      user: "admin",
      password: "love"
    }
  },
  production: {},
};

export function createDatabase(env: 'development' | 'production') {
  return knex(connections[env]);
}
