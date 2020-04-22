import Knex from "knex";
import { Handler } from "express";
import S3 from "aws-sdk/clients/s3";

enum FileStatus {
  UPLOAD_URL_SIGNED,
  TRANSCODING_STARTED,
  TRANSCODING_COMPLETED,
  TRANSCODING_ERRORED,
}

const validMimeTypes: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/m4a",
  aif: "audio/x-aiff",
  aifc: "audio/x-aiff",
  aiff: "audio/x-aiff",
  wav: "audio/vnd.wav",
};

const encodeTrackKey = (data: {
  trackId: string;
  fileId: string;
  type: string;
}) => {
  return `${data.trackId}/${data.fileId}.${data.type}`;
};
const decodeTrackKey = (str: string) => {
  const match = str.match(/^([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.(\S+)$/);
  if (!match) throw new Error(`Error decoding track ids from key: ${str}`);
  return {
    trackId: match[1],
    fileId: match[2],
    type: match[3],
  };
};

export function installTrackUpload({
  database,
  s3,
}: {
  database: Knex;
  s3: S3;
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
        await database("files")
          .update({ status: FileStatus.TRANSCODING_COMPLETED })
          .where({ id: fileId });
        break;
      case "PROGRESSING":
        await database("files")
          .update({ status: FileStatus.TRANSCODING_STARTED })
          .where({ id: fileId });
        break;
      case "ERROR":
        await database("files")
          .update({ status: FileStatus.TRANSCODING_ERRORED })
          .where({ id: fileId });
        break;
    }
    res.sendStatus(200);
  };
  const presignedUrlHandler: Handler = async (req, res) => {
    const { id } = req.params;
    const { filename, type } = req.query;
    if (!filename) throw Error("requires filename");
    if (typeof type !== "string") throw Error("requires type");
    const mimeType = validMimeTypes[type];
    if (!mimeType) throw new Error("invalid file type");
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
      ACL: "bucket-owner-full-control",
      ContentType: mimeType,
    };
    const url = s3.getSignedUrl("putObject", params);
    res.json({ url });
  };
  return {
    presignedUrlHandler,
    snsMessageHandler,
  };
}
