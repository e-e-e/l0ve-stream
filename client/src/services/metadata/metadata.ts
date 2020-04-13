import * as musicMetadata from "music-metadata-browser";

export class Metadata {
  async read(file: File) {
    const data = await musicMetadata.parseBlob(file);
    console.log(data);
    return data;
  }
}
