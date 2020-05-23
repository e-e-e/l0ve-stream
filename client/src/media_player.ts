import { Howl } from 'howler';
import { type } from 'os';
import { hashmap } from 'aws-sdk/clients/glacier';
import { FileUploadService } from './services/file_upload/install';

type TrackState = 'uninitialized' | 'loading' | 'loaded' | 'error-loading';

class Track {
  private sound: Howl | null = null;
  private state: TrackState = 'uninitialized';
  private previousElapsed = 0;
  private playWhenReady = false;

  constructor(
    readonly id: string,
    private readonly onEnd: (id: string) => void,
    private readonly fetchUrl: (id: string) => Promise<string>,
  ) {}

  async load() {
    if (this.state !== 'uninitialized') return;
    this.state = 'loading';
    const url = await this.fetchUrl(this.id);
    this.sound = new Howl({
      src: [url],
      autoplay: false,
      volume: 1,
      html5: true,
      onend: () => {
        // should go to next item in queue;
        this.onEnd(this.id);
      },
      onload: () => {
        this.state = 'loaded';
        if (this.playWhenReady) {
          this.play();
          console.log('loaded and playing', this.id);
          this.playWhenReady = false;
        }
        // notify that track is ready to be played
      },
      onloaderror: () => {
        this.state = 'error-loading';
      },
    });
  }

  ready() {
    return this.state === 'loaded';
  }

  play() {
    if (!this.ready()) {
      console.log('not ready');
      this.playWhenReady = true;
      return;
    }
    console.log('--play', this.id, !!this.sound);
    if (this.sound?.playing()) return;
    this.sound?.play();
  }

  playing(): boolean {
    return !!this.sound?.playing();
  }

  stop() {
    if (!this.ready()) {
      this.playWhenReady = false;
      // return;
    }
    this.previousElapsed = 0;
    this.sound?.stop();
    console.log('--stop', this.id);
  }

  pause() {
    if (!this.ready()) {
      this.playWhenReady = false;
      // return;
    }
    this.sound?.pause();
  }

  elapsed(): number | undefined {
    const pos = this.sound?.seek();

    // console.log('pos', pos);
    if (typeof pos !== 'number' && pos !== undefined) {
      return this.previousElapsed;
      // throw new Error("This should not be possible");
    }
    this.previousElapsed = pos || 0;
    return pos;
  }

  duration(): number {
    const d = this.sound?.duration();
    return d ? d : 0;
  }

  unload() {
    this.state = 'uninitialized';
    this.sound?.unload();
  }
}

type MediaPlayerEventHandlers = {
  // progress?: (v: number) => void;
  playing?: (id: string) => void;
  ready?: () => void;
};

export class MediaPlayer {
  private currentTrackIndex?: number;
  private queue: string[] = [];
  private tracks: Record<string, Track> = {};
  // dirty quick solution for event emitting
  private eventHandlers: MediaPlayerEventHandlers = {};

  constructor(private readonly fetchUrl: (id: string) => Promise<string>) {
    // include getTrackUrl info
  }

  init(tracks: string[]) {
    // add tracks to playlist
    this.clear();
    this.queue = tracks;
    this.tracks = tracks.reduce<Record<string, Track>>((acc, track) => {
      acc[track] = new Track(track, this.onTrackEnd, this.fetchUrl);
      return acc;
    }, {});

    console.log('loaded', tracks);
  }

  private onTrackEnd = (id: string) => {
    console.log('ended', id);
    this.next();
  };

  private preload(id: string) {
    const track = this.tracks[id];
    if (!track) {
      console.log('track does not exist', id);
      return;
    }
    if (!track.ready()) {
      console.log('preload', id);
      track.load().catch(console.log);
    }
  }
  private currentTrack() {
    console.log(this.currentTrackIndex);
    if (this.currentTrackIndex == null) return;
    return this.tracks[this.queue[this.currentTrackIndex]];
  }
  private nextTrackId() {
    return this.queue[
      (this.currentTrackIndex ? this.currentTrackIndex + 1 : 1) %
        this.queue.length
    ];
  }
  private prevTrackId() {
    return this.queue[
      (this.currentTrackIndex
        ? this.currentTrackIndex - 1
        : this.queue.length - 1) % this.queue.length
    ];
  }

  on(event: 'playing', handler: MediaPlayerEventHandlers['playing']): void;
  on(event: 'ready', handler: MediaPlayerEventHandlers['ready']): void;
  // on(event: "progress", handler: MediaPlayerEventHandlers["progress"]): void;
  on(event: keyof MediaPlayerEventHandlers, handler: () => {}): void {
    this.eventHandlers[event] = handler;
  }

  play(id?: string) {
    const { tracks, queue } = this;
    // play item in queue
    // load next item in queue too
    const trackId = id || this.queue[this.currentTrackIndex || 0];
    this.stopIfPlaying();
    this.currentTrackIndex = queue.indexOf(trackId);
    const track = tracks[trackId];
    console.log('play', track);
    if (!track) return;
    if (!track.ready()) {
      track
        .load()
        .then(() => {
          this.preload(this.nextTrackId());
        })
        .catch((e) => {
          console.log(e);
        });
      console.log('loaded', track.id);
    }
    track.play();
    this.eventHandlers.playing?.(track.id);
  }

  next() {
    console.log('next');
    // slip to next track
    // load next in queue too
    const nextTrackId = this.nextTrackId();
    this.stop();
    this.play(nextTrackId);
  }

  prev() {
    // skip to start of current track or if withing a threshold the prev track
    const currentTrack = this.currentTrack();
    const elapsed = (currentTrack && currentTrack.elapsed()) || 0;
    // console.log(elapsed);
    if (elapsed < 0.5) {
      this.stop();
      this.play();
      return;
    }
    const prevTrackId = this.prevTrackId();
    this.stop();
    this.play(prevTrackId);
  }

  stop(id?: string) {
    // stop playing
    const trackId = id || this.queue[this.currentTrackIndex || 0];
    if (!trackId) return;
    this.tracks[trackId].stop();
  }

  private stopIfPlaying() {
    // stop playing
    const trackId = this.queue[this.currentTrackIndex || 0];
    if (!trackId) return;
    const track = this.tracks[trackId];
    if (track.playing()) {
      track.stop();
    }
  }

  pause(id?: string) {
    // pause playing
    const trackId = id || this.queue[this.currentTrackIndex || 0];
    if (!trackId) return;
    this.tracks[trackId].pause();
  }

  progress(): number {
    const trackId = this.queue[this.currentTrackIndex || 0];
    if (!trackId) return 0;
    const elapsed = this.elapsed();
    const duration = this.duration();
    if (!duration || !elapsed) return 0;
    // console.log(elapsed, duration);
    return elapsed / duration;
  }

  elapsed(): number {
    const trackId = this.queue[this.currentTrackIndex || 0];
    if (!trackId) return 0;
    return this.tracks[trackId].elapsed() || 0;
  }

  duration(): number {
    const trackId = this.queue[this.currentTrackIndex || 0];
    if (!trackId) return 0;
    return this.tracks[trackId].duration();
  }

  clear() {
    // stop playing and unload all items
    for (const key in this.tracks) {
      this.tracks[key].unload();
    }
    this.tracks = {};
    this.queue = [];
    this.currentTrackIndex = undefined;
  }
}

export function createMediaPlayer(fileUploadService: FileUploadService) {
  const getUrl = (id: string) =>
    fileUploadService
      .getPresignedTrackUrl({ trackId: id })
      .then((res) => res.url);
  return new MediaPlayer(getUrl);
}
