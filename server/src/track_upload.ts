import Knex from "knex";
import { Handler } from "express";
import S3 from "aws-sdk/clients/s3";

export enum FileStatus {
  UPLOAD_URL_SIGNED,
  TRANSCODING_STARTED,
  TRANSCODING_COMPLETED,
  TRANSCODING_ERRORED,
}

const validMimeTypes = [
  "audio/mpeg", //mp3
  "audio/m4a", //m4a
  "audio/x-aiff", //aif aifc aiff
  "audio/vnd.wav", //wav
];

const validQualites = ["original", "196", "320"];

const mimeTypetoExt = (type: string) => {
  switch (type) {
    case "audio/mpeg":
      return "mp3";
    case "audio/m4a":
      return "m4a";
    case "audio/x-aiff":
      return "aiff";
    case "audio/vnd.wav":
      return "wav";
    default:
      throw new Error("Type invalid");
  }
};

const extToMimeType = (ext: string) => {
  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      return "audio/m4a";
    case "aiff":
      return "audio/x-aiff";
    case "wav":
      return "audio/vnd.wav";
    default:
      throw new Error("ext invalid");
  }
};

const encodeTrackKey = (data: {
  trackId: string;
  fileId: string;
  type: string;
  quality?: string;
}) => {
  if (!data.quality) {
    return `${data.trackId}/${data.fileId}.${mimeTypetoExt(data.type)}`;
  }
  return `${data.trackId}/${data.fileId}.${data.quality}.${mimeTypetoExt(
    data.type
  )}`;
};
const decodeTrackKey = (str: string) => {
  const match = str.match(/^([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.(\S+)$/);
  if (!match) throw new Error(`Error decoding track ids from key: ${str}`);
  return {
    trackId: match[1],
    fileId: match[2],
    type: extToMimeType(match[3]),
  };
};

export function installTrackUpload({
  database,
  s3,
  websocket,
}: {
  database: Knex;
  s3: S3;
  websocket: {
    broadcastFileTranscodeStatus: (data: {
      trackId: string;
      fileId: string;
      status: number;
    }) => void;
  };
}) {
  const snsMessageHandler: Handler = async (req, res) => {
    const message = JSON.parse(req.body.Message);
    const input = message.input.key;
    const { trackId, fileId } = decodeTrackKey(input);
    switch (message.state) {
      case "COMPLETED":
        if (
          !message.outputs.every(
            (t: { status: string }) => t.status === "Complete"
          )
        ) {
          break;
        }
        console.log("completed", fileId);
        await database("files")
          .update({ status: FileStatus.TRANSCODING_COMPLETED })
          .where({ id: fileId });
        websocket.broadcastFileTranscodeStatus({
          trackId,
          fileId,
          status: FileStatus.TRANSCODING_COMPLETED,
        });
        break;
      case "PROGRESSING":
        console.log("progressing", fileId);
        await database("files")
          .update({ status: FileStatus.TRANSCODING_STARTED })
          .where({ id: fileId });
        websocket.broadcastFileTranscodeStatus({
          trackId,
          fileId,
          status: FileStatus.TRANSCODING_STARTED,
        });
        break;
      case "ERROR":
        console.log("error", fileId);
        await database("files")
          .update({ status: FileStatus.TRANSCODING_ERRORED })
          .where({ id: fileId });
        websocket.broadcastFileTranscodeStatus({
          trackId,
          fileId,
          status: FileStatus.TRANSCODING_ERRORED,
        });
        break;
    }
    res.sendStatus(200);
  };
  const presignedPutUrlHandler: Handler = async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
    if (typeof type !== "string") throw Error("requires type");
    if (!validMimeTypes.includes(type)) throw new Error("invalid file type");
    // confirm track exists
    const track = (await database("tracks").select("id").where({ id }))[0];
    if (!track) throw new Error("track with id does not exist");
    // save intention of download into database
    const fileId = (
      await database("files")
        .insert({
          filename: "", // will be replaced with real id
          type,
          size: 0,
          status: FileStatus.UPLOAD_URL_SIGNED,
        })
        .returning("id")
    )[0];
    const key = encodeTrackKey({ trackId: id, fileId, type });
    await database("tracks_files").insert({ track_id: id, file_id: fileId });
    await database("files").update({ filename: key });
    // generate link
    const params = {
      Bucket: process.env.AWS_RAW_TRACK_BUCKET,
      Key: key,
      // ACL: "bucket-owner-full-control",
      ContentType: type,
    };
    s3.getSignedUrl("putObject", params, (err, url) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      res.json({ url, fileId });
    });
  };
  const presignedGetTrackHandler: Handler = async (req, res) => {
    const { id } = req.params;
    let { quality } = req.query;
    if (quality && !validQualites.includes(quality)) {
      throw new Error("Invalid quality option");
    }
    if (!quality) {
      quality = "196";
    }
    const filedata = (await database.select().from("files").where({ id }))[0];
    if (!filedata) {
      return res.sendStatus(404);
    }
    if (
      quality !== "original" &&
      filedata.status !== FileStatus.TRANSCODING_COMPLETED
    ) {
      throw new Error("File not transcoded");
    }
    const { trackId, fileId, type } = decodeTrackKey(filedata.filename);
    const params =
      quality === "original"
        ? {
            Bucket: process.env.AWS_RAW_TRACK_BUCKET,
            Key: filedata.filename,
          }
        : {
            Bucket: process.env.AWS_TRANSCODED_TRACK_BUCKET,
            Key: encodeTrackKey({ trackId, fileId, type, quality }),
          };
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      res.json({ url, fileId });
    });
  };

  return {
    presignedPutUrlHandler,
    presignedGetTrackHandler,
    snsMessageHandler,
  };
}
