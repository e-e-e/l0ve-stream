import knex, { PgConnectionConfig } from "knex";
import { parse } from "pg-connection-string";
export function createDatabase(
  config: { database: string; user: string; password: string } | string
) {
  return knex({
    client: "pg",
    connection:
      typeof config === "string"
        ? ({
            ssl: process.env.NODE_ENV === "production",
            ...parse(config),
          } as PgConnectionConfig)
        : config,
  });
}
