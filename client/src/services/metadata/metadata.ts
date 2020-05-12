import * as musicMetadata from 'music-metadata-browser';

export type TrackMetadata = {
  filename: string;
  fileSize: number;
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  duration?: number;
  genre?: string;
  codec?: string;
  lossless?: boolean;
};

export class Metadata {
  async read(file: File): Promise<TrackMetadata> {
    const data = await musicMetadata.parseBlob(file);
    return {
      filename: file.name,
      fileSize: file.size,
      title: data.common.title,
      album: data.common.album,
      artist: data.common.artist,
      year: data.common.year,
      genre: data.common.genre?.join('; '),
      duration: data.format.duration,
      codec: data.format.codec,
      lossless: data.format.lossless,
    };
  }
}
