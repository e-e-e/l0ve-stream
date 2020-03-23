import {DataSource, DataSourceConfig} from 'apollo-datasource';
import * as Knex from 'knex';

export type User = {
  name: string,
  role: number
}
export type UserWithId = User & { id: string }

export class UsersDataSource extends DataSource {

  constructor(private readonly database: Knex) {
    super();
  }
  async getUser(id: string): Promise<UserWithId> {
    console.log(id);
    return this.database
      .select('*')
      .from('users')
      .where({ id })
      .first()
  }

  async getUsers(pageSize?: number, after?: string): Promise<UserWithId[]> {
    return this.database
      .select('*')
      .from('users')
      .offset(after ? parseInt(after, 10) : 0)
      .limit(pageSize || 20)
  }

  async createUser(user: User): Promise<UserWithId> {
    return this.database
      .insert(user)
      .into('users')
      .returning('*')
      .then(x => x) as Promise<UserWithId>;
  }

}
