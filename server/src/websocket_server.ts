import ws from "ws";
import { FileStatus } from "./track_upload";
import * as http from "http";
import * as https from "https";

type TranscodeStatusUpdate = {
  trackId: string;
  fileId: string;
  playlistId?: string;
  status: FileStatus;
};

export function installWebsockets(config: {
  server: http.Server | https.Server;
}) {
  const transcodeListeners: Record<
    string,
    (info: TranscodeStatusUpdate) => void
  > = {};
  const wss = new ws.Server({ server: config.server });
  wss.on("connection", function connection(ws) {
    ws.on("close", () => {
      // should do some clean up
      console.log("closed");
    });
    // ws.send(
    //   JSON.stringify({
    //     type: "transcode-status",
    //     data: {
    //       trackId: "4e1d146a-954e-11ea-aad2-7b29e1d678a9",
    //       fileId: "4e234d08-954e-11ea-aad2-77e2de179f55",
    //       playlistId: "5ccfcfca-9224-11ea-8315-0b53c934f012",
    //       status: FileStatus.TRANSCODING_COMPLETED,
    //     },
    //
    //   })
    // );
    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
      if (typeof message !== "string") return;
      let data;
      try {
        data = JSON.parse(message);
        // check that type is correct
      } catch (e) {
        ws.send({ type: "error", message: e.message });
      }
      if (data.type === "subscribe-transcode-status") {
        console.log("creating subscription", data.fileId);
        // this should always be one to one so no worry about overwriting another sockets connection
        transcodeListeners[data.fileId] = (info: TranscodeStatusUpdate) => {
          ws.send(JSON.stringify({ type: "transcode-status", data: info }));
        };
      }
    });
  });

  return {
    broadcastFileTranscodeStatus: (data: TranscodeStatusUpdate) => {
      // iterate over listeners
      console.log("try broadcasting", data);
      const fn = transcodeListeners[data.fileId];
      if (fn) {
        console.log("did broadcast", data);
        fn(data);
        if (
          data.status === FileStatus.TRANSCODING_ERRORED ||
          data.status === FileStatus.TRANSCODING_COMPLETED
        ) {
          delete transcodeListeners[data.fileId];
        }
      }
    },
  };
}
