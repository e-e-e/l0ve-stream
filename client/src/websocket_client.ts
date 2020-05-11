export function installWebsocketClient({ url }: { url: string }) {
  const webSocket = new WebSocket(url);
  webSocket.onopen = (ev: Event) => {
    console.log('opened');
  };
  webSocket.onmessage = (message: MessageEvent) => {
    console.log('received:', message.data);
  };
  webSocket.onclose = () => {
    console.log('closed');
  };
  return {
    subscribeToTranscodeUpdates: (fileId: string) => {
      webSocket.send(
        JSON.stringify({ type: 'subscribe-transcode-status', fileId }),
      );
    },
  };
}
