import * as Knex from "knex";
import { config } from "dotenv"
import * as path from "path"

config({ path: path.resolve(__dirname, '../.env' ) });

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    if (!process.env.BASIC_USERS) return;
    const users: string[] = process.env.BASIC_USERS.split(',');
    const data = users.map(user => {
      const [name] = user.split(':');
      return {
        name,
        role: 1
      }
    })
    return knex("users").del()
        .then(() => {
            // Inserts seed entries
            return knex("users").insert(data);
        });
};
