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
import fileUpload from "express-fileupload";
import S3 from "aws-sdk/clients/s3";
import { installSns } from "./sns";

config({ path: path.resolve(__dirname, "../.env") });
// maybe throw error if env is not set correctly
const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};
const awsRegion = "ap-southeast-1";
const s3 = new S3({
  region: awsRegion,
  credentials: awsCredentials,
  apiVersion: "2006-03-01",
});

const snsDomain = "http://8c9a93ab.ngrok.io"; // `${process.env.ROOT_DOMAIN}:${process.env.PORT}`

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
// install before basic auth so that sns can deliver
installSns(
  app,
  [
    {
      topic: process.env.AWS_SNS_TRANSCODE!,
      path: `/sns/transcode`,
      handler: (req, res) => {
        console.log(req.body);
        res.sendStatus(200);
      },
    },
  ],
  { awsCredentials, awsRegion, domain: snsDomain }
);

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

enum FileStatus {
  UPLOAD_URL_SIGNED,
  UPLOAD_COMPLETED,
  TRANSCODING_STARTED,
  TRANSCODING_COMPLETED,
}

app.get("/track/:id/upload", async (req, res) => {
  const { id } = req.params;
  const { filename, type } = req.query;
  if (!filename) throw Error("requires filename");
  if (!type) throw Error("requires type");

  // confirm track exists
  const track = (await database("tracks").select("id").where({ id }))[0];
  if (!track) throw new Error("track with id does not exist");
  // save intention of download into database
  const fileId = (
    await database("files")
      .insert({
        filename: "",
        type,
        size: 0,
        status: FileStatus.UPLOAD_URL_SIGNED,
      })
      .returning("id")
  )[0];
  const key = `${id}/${fileId}.${type}`;
  await database("tracks_files").insert({ track_id: id, file_id: fileId });
  await database("files").update({ filename: key });
  // generate link
  const params = { Bucket: process.env.AWS_RAW_TRACK_BUCKET, Key: key };
  const url = s3.getSignedUrl("putObject", params);
  res.json({ url });
  // return
});

app.listen({ port: PORT }, () => {
  console.log(`listening on port ${PORT}`);
});

installWebsockets({ port: 8000 });
