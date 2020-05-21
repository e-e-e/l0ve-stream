import { EventEmitter } from 'events';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import { Decoder } from 'io-ts';

const TranscodingStatusUpdateMessage = t.type({
  type: t.literal('transcode-status'),
  data: t.type({
    trackId: t.string,
    fileId: t.string,
    playlistId: t.string,
    status: t.number,
  }),
});
type TranscodingStatusUpdateMessage = t.TypeOf<
  typeof TranscodingStatusUpdateMessage
>;

function decode<I, A>(data: any, decoder: Decoder<I, A>): A {
  return pipe(
    data,
    decoder.decode,
    fold(
      (e) => {
        throw e;
      },
      (data) => data,
    ),
  );
}

type EventMap = Record<string, any>;
type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

type X = TranscodingStatusUpdateMessage['type'];
type WebSocketEventMap = {
  [key in X]: TranscodingStatusUpdateMessage['data'];
};

class WebSocketEmitter implements Emitter<WebSocketEventMap> {
  private readonly emitter = new EventEmitter();
  on<K extends EventKey<WebSocketEventMap>>(
    eventName: K,
    fn: EventReceiver<WebSocketEventMap[K]>,
  ): void {
    this.emitter.on(eventName, fn);
  }
  off<K extends EventKey<WebSocketEventMap>>(
    eventName: K,
    fn: EventReceiver<WebSocketEventMap[K]>,
  ): void {
    this.emitter.off(eventName, fn);
  }
  emit<K extends EventKey<WebSocketEventMap>>(
    eventName: K,
    params: WebSocketEventMap[K],
  ): void {
    this.emitter.emit(eventName, params);
  }
}

export class WebSocketClient {
  private readonly emitter = new WebSocketEmitter();
  private socket?: WebSocket;

  constructor(private readonly url: string) {}

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = (ev: Event) => {
      console.log('opened');
    };
    this.socket.onmessage = (message: MessageEvent) => {
      console.log('received:', message.data);
      if (typeof message.data !== 'string') return;
      let data: TranscodingStatusUpdateMessage;
      try {
        data = decode(JSON.parse(message.data), TranscodingStatusUpdateMessage);
        // check that type is correct
      } catch (e) {
        console.error('Websocket recieved message that cannot be parsed');
        return;
      }
      this.parseMessage(data);
    };
    this.socket.onclose = (e) => {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason,
      );
      setTimeout(() => this.connect(), 1000);
    };
    this.socket.onerror = (err) => {
      console.error('Socket encountered error: ', err, 'Closing socket');
      this.socket?.close();
    };
  }

  onTranscodingUpdate(fn: (d: TranscodingStatusUpdateMessage['data']) => void) {
    this.emitter.on('transcode-status', fn);
  }

  subscribeToTranscodeUpdates(fileId: string) {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({ type: 'subscribe-transcode-status', fileId }),
      );
    } else {
      console.error(
        'Could not subscribe to transcode updates because web socket connection not open',
      );
    }
  }

  private parseMessage(message: TranscodingStatusUpdateMessage) {
    switch (message.type) {
      case 'transcode-status': {
        this.emitter.emit('transcode-status', message.data);
      }
    }
  }
}

export function installWebSocketClient({ url }: { url: string }) {
  const webSocket = new WebSocketClient(url);
  webSocket.connect();
  return webSocket;
}
