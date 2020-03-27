import knex from 'knex';

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

export function createDatabase(config: { database: string, user: string, password: string}) {
  return knex({
    client: "pg",
    connection: config
  });
}
