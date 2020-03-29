import "graphql-import-node";
import express from 'express';
import * as xml2json from 'xml2json';
import {readFileSync} from 'fs';
import path from 'path';
import {itunesPlaylist} from './importers/itunes_playlist'
import {createApolloServerContext} from "./schema";
import { createDatabase } from "./database";
import { ApolloServer } from 'apollo-server-express';
import { config } from "dotenv"
import basicAuth from 'express-basic-auth'
import helmet from 'helmet'
import {installWebsockets} from "./websocket_server";

config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT;
const app = express();

const database = createDatabase(process.env.DATABASE_URL || {
  database: process.env.DB_DATABASE!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!
});

const server = new ApolloServer({...createApolloServerContext(database), playground: true, introspection: true });

if (process.env.NODE_ENV === 'production') {
  app.use(basicAuth({
    users: { 'admin': 'supersecret' },
    challenge: true
  }))
}

app.use(helmet());

server.applyMiddleware({app});

app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.listen({port: PORT}, () => {
  console.log(`listening on port ${PORT}`);
});

installWebsockets({port: 8000});
