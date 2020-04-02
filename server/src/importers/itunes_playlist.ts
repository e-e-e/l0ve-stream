import { Parser } from "node-expat";

type Track = {
  title: string;
  artist: string;
  album: string;
  year?: number;
  genre?: string;
};

type Playlist = {
  title: string;
  description: string;
  tracks: Track[];
};

type XMLValue = XMLArray | XMLDictMap | Date | string | boolean | number;
type XMLArray = Array<XMLValue | undefined>;
type XMLDictMap = Map<string, XMLValue>;

function toValue(type: "date", value: string | XMLDictMap | XMLArray): Date;
function toValue(
  type: "boolean",
  value: string | XMLDictMap | XMLArray
): boolean;
function toValue(
  type: "integer",
  value: string | XMLDictMap | XMLArray
): number;
function toValue(
  type: string,
  value: string | XMLDictMap | XMLArray
): XMLValue {
  if (typeof value !== "string") return value;
  switch (type) {
    case "boolean":
      return !!parseInt(value);
    case "integer":
      return parseInt(value);
    case "date":
      return new Date(value);
    case "string":
    default:
      return value;
  }
}

async function decode(xml: Buffer): Promise<Playlist> {
  return new Promise((resolve, reject) => {
    const parser = new Parser("utf-8");
    let root: XMLDictMap = new Map();
    let previousTag: string | null = null;
    const keyStack: string[] = [];
    const tagStack: string[] = [];
    const valueStack: string[] = [];
    const arrayStack: XMLArray[] = [];
    const dictStack: XMLDictMap[] = [];

    parser.on("startElement", function (name: string, attrs: any) {
      // console.log('start', name)
      switch (name) {
        case "array":
          arrayStack.push([]);
          break;
        case "dict":
          dictStack.push(new Map());
          break;
      }
      tagStack.push(name);
    });

    parser.on("text", function (text) {
      const current = tagStack[tagStack.length - 1];
      if (!["array", "dict"].includes(current)) {
        valueStack.push(text);
      }
    });

    parser.on("endElement", function (name) {
      const last = tagStack.pop();
      if (last !== name)
        throw new Error("Something wrong with tag stack order");
      previousTag = name;
      const parent = tagStack[tagStack.length - 1];
      if (parent === "dict") {
        if (name === "key") {
          const value = valueStack.pop()?.trim();
          value && keyStack.push(value);
          return;
        }
        const key = keyStack.pop();
        if (!key) throw new Error("wrong with key structure");
        let value;
        switch (name) {
          case "array": {
            value = arrayStack.pop();
            break;
          }
          case "dict": {
            value = dictStack.pop();
            break;
          }
          default: {
            value = valueStack.pop()?.trim();
          }
        }
        value &&
          dictStack[dictStack.length - 1]?.set(key, toValue(name, value));
        return;
      }
      if (parent === "array") {
        let value;
        switch (name) {
          case "array": {
            value = arrayStack.pop();
            break;
          }
          case "dict": {
            value = dictStack.pop();
            break;
          }
          default: {
            value = valueStack.pop()?.trim();
          }
        }
        const array = arrayStack[arrayStack.length - 1];
        array.push(value ? toValue(name, value) : undefined);
        // console.log(array);
      }
      if (parent === "plist") {
        const dict = dictStack.pop();
        if (dict) root = dict;
      }
    });

    parser.on("error", function (error) {
      reject(error);
    });
    parser.on("end", () => {
      resolve(decodeXmlToPlaylist(root));
    });
    parser.write(xml);
    parser.end();
  });
}

function expect(condition: boolean, reason: string): asserts condition {
  if (!condition) throw new Error(`Expected ${reason}.`);
}

function decodeXmlTrackToPlaylistTrack(data: XMLDictMap): Track {
  const title = data.get("Name");
  expect(typeof title === "string", "title to be string");
  const artist = data.get("Artist");
  expect(typeof artist === "string", "artist to be string");
  const album = data.get("Album");
  expect(typeof album === "string", "album to be string");
  const year = data.get("Year");
  // console.log(year);
  // console.log(data);
  expect(
    year === undefined || typeof year === "number",
    "year to be number or undefined"
  );
  const genre = data.get("Genre");
  expect(
    genre === undefined || typeof genre === "string",
    "genre to be string or undefined"
  );
  return {
    title,
    artist,
    album,
    year,
    genre,
  };
}

function decodeXmlToPlaylist(data: XMLDictMap): Playlist {
  const tracks = data.get("Tracks");
  expect(tracks instanceof Map, "tracks to be a map");
  const playlists = data.get("Playlists");
  expect(Array.isArray(playlists), "playlists to be an array");
  const playlist = playlists.pop();
  expect(playlist instanceof Map, "playlist to be a map");
  const name = playlist.get("Name");
  expect(typeof name === "string", "name to be string");
  const description = playlist.get("Description") || "";
  expect(typeof description === "string", "description to be string");
  const rawItems = playlist.get("Playlist Items");
  expect(Array.isArray(rawItems), "playlist items to be array");
  const items: Track[] = rawItems.map((i) => {
    expect(i instanceof Map, "playlist items to be map");
    const id = i.get("Track ID");
    expect(typeof id === "number", "playlist item track id to be a number");
    const track = tracks.get(id.toString());
    expect(track instanceof Map, "track to be a map");
    return decodeXmlTrackToPlaylistTrack(track);
  });
  return {
    title: name,
    description,
    tracks: items,
  };
}

function encode(playlist: Playlist): Playlist {
  throw new Error("Not implemented");
}

export const itunesPlaylist = {
  decode,
  encode,
};
