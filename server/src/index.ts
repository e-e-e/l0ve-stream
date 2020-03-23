import "graphql-import-node";
import * as express from 'express';
import * as xml2json from 'xml2json';
import {readFileSync} from 'fs';
import * as path from 'path';
import {itunesPlaylist} from './importers/itunes_playlist'
import {createApolloServerContext} from "./schema";
import { createDatabase } from "./database";
import { ApolloServer } from 'apollo-server-express';

const PORT = 8080;
const app = express();


const database = createDatabase("development");
const server = new ApolloServer({...createApolloServerContext(database), playground: {settings: {'editor.theme': 'light'}}});

// const file = readFileSync(path.join(__dirname, 'Week 1.xml'));
// itunesPlaylist.decode(file.toString()).then(console.log);

server.applyMiddleware({app});

app.use('/', (req, res) => {
  res.send('woo');
});

app.listen({port: PORT}, () => {
  console.log(`listening on port ${PORT}`);
});
