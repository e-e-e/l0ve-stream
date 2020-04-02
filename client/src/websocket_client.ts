export function installWebsocketClient({ url }: { url: string }) {
  const webSocket = new WebSocket(url);
  webSocket.onopen = (ev: Event) => {
    console.log("opened");
    webSocket.send("Hey!");
  };
  webSocket.onmessage = (message: MessageEvent) => {
    console.log("received:", message.data);
    webSocket.close();
  };
  webSocket.onclose = () => {
    console.log("closed");
  };
}
