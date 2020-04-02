import ws from "ws";

export function installWebsockets(config: { port: number }) {
  const wss = new ws.Server({ port: config.port });
  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });
    ws.send("something");
  });
}
