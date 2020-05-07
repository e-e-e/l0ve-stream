import "graphql-import-node";
import express from "express";
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
import { installTrackUpload } from "./track_upload";

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

const snsDomain =
  process.env.NODE_ENV === "production"
    ? `${process.env.ROOT_DOMAIN}:${process.env.PORT}`
    : "http://nononono.ngrok.io";

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

const websocket = installWebsockets({ port: 8000 });
const {
  snsMessageHandler,
  presignedPutUrlHandler,
  presignedGetTrackHandler,
} = installTrackUpload({
  database,
  s3,
  websocket,
});

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
      handler: snsMessageHandler,
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

app.get("/track/:id/upload", presignedPutUrlHandler);
app.get("/track/:id/get", presignedGetTrackHandler);

app.listen({ port: PORT }, () => {
  console.log(`listening on port ${PORT}`);
});
