import knex from 'knex';

export function createDatabase(config: { database: string, user: string, password: string} | string ) {
  return knex({
    client: "pg",
    connection: config
  });
}
