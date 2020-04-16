import "graphql-import-node";
import express from "express";
import * as xml2json from "xml2json";
import { readFileSync } from "fs";
import path from "path";
import { itunesPlaylist } from "./importers/itunes_playlist";
import { createApolloServerConfig } from "./schema";
import { createDatabase } from "./database";
import { ApolloServer } from "apollo-server-express";
import { config } from "dotenv";
import basicAuth from "express-basic-auth";
import helmet from "helmet";
import { installWebsockets } from "./websocket_server";
// import cors from 'cors';
import fileUpload, { FileArray } from "express-fileupload";

config({ path: path.resolve(__dirname, "../.env") });

function getBasicAuthUsers(usersData: string) {
  if (!usersData || usersData.indexOf(":") === -1) {
    throw Error("Failed to generate users from env");
  }
  const users: string[] = usersData.split(",");
  return users.reduce<Record<string, string>>((prev, user) => {
    const [name, password] = user.split(":");
    prev[name] = password;
    return prev;
  }, {});
}

const PORT = process.env.PORT;
const app = express();

const database = createDatabase(
  process.env.DATABASE_URL || {
    database: process.env.DB_DATABASE!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  }
);

const server = new ApolloServer({
  ...createApolloServerConfig(database),
  playground: true,
  introspection: true,
});

app.use(helmet());
const filename = path.resolve(__dirname, "../hedgehog.jpg");
app.get("/image", (req, res) => {
  // res.sendStatus(503);
  res.set("Cache-Control", "no-cache");
  res.sendFile(filename);
});

app.use(
  basicAuth({
    users: getBasicAuthUsers(process.env.BASIC_USERS || "admin:supersecret"),
    challenge: true,
  })
);

server.applyMiddleware({ app });

app.use(express.static(path.resolve(__dirname, "../../client/build")));
// default options
app.use(fileUpload());

app.post("/convert/itunes", async (req, res) => {
  const { files } = req;
  if (!files) return res.sendStatus(400);
  if (Array.isArray(files.file)) return res.sendStatus(400);
  try {
    const playlist = await itunesPlaylist.decode(files?.file.data);
    return res.json(playlist);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.listen({ port: PORT }, () => {
  console.log(`listening on port ${PORT}`);
});

installWebsockets({ port: 8000 });
