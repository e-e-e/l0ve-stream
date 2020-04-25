import { Howl } from "howler";
import { type } from "os";

type TrackState = "uninitialized" | "loading" | "loaded" | "error-loading";

class Track {
  private sound: Howl | null = null;
  private state: TrackState = "uninitialized";
  private playWhenReady = false;

  constructor(
    readonly id: string,
    private readonly onEnd: (id: string) => void
  ) {}

  async load() {
    if (this.state !== "uninitialized") return;
    this.state = "loading";
    const url = await Promise.resolve(this.id);
    this.sound = new Howl({
      src: [url],
      autoplay: false,
      volume: 1,
      onend: () => {
        // should go to next item in queue;
        this.onEnd(this.id);
      },
      onload: () => {
        this.state = "loaded";
        console.log("looolllooo");
        if (this.playWhenReady) {
          this.play();
          console.log("loaded and playing", this.id);
          this.playWhenReady = false;
        }
        // notify that track is ready to be played
      },
      onloaderror: () => {
        this.state = "error-loading";
      },
    });
  }

  ready() {
    return this.state === "loaded";
  }

  play() {
    if (!this.ready()) {
      console.log("not ready");
      this.playWhenReady = true;
      return;
    }
    console.log("--play", this.id, !!this.sound);
    if(this.sound?.playing()) return;
    this.sound?.play();
  }

  stop() {
    if (!this.ready()) {
      this.playWhenReady = false;
      return;
    }
    this.sound?.stop();
    console.log("--stop", this.id);
  }

  pause() {
    if (!this.ready()) {
      this.playWhenReady = false;
      return;
    }
    this.sound?.pause();
  }

  elapsed(): number | undefined {
    const pos = this.sound?.seek();
    console.log(pos);
    if (typeof pos !== "number" && pos !== undefined)
      throw new Error("This should not be possible");
    return pos;
  }

  unload() {
    this.state = "uninitialized";
    this.sound?.unload();
  }
}

class MediaPlayer {
  private currentTrackIndex?: number;
  private queue: string[] = [];
  private tracks: Record<string, Track> = {};

  constructor() {
    // include getTrackUrl info
  }

  init(tracks: string[]) {
    // add tracks to playlist
    this.clear();
    this.queue = tracks;
    this.tracks = tracks.reduce<Record<string, Track>>((acc, track) => {
      acc[track] = new Track(track, this.onTrackEnd);
      return acc;
    }, {});

    console.log("loaded", tracks);
  }

  onTrackEnd = (id: string) => {
    console.log("ended", id);
    this.next();
  };

  preload(id: string) {
    const track = this.tracks[id];
    if (!track) {
      console.log("track does not exist", id);
      return;
    }
    if (!track.ready()) {
      console.log("preload", id);
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

  play(id?: string) {
    const { tracks, queue } = this;
    // play item in queue
    // load next item in queue too
    const trackId = id || this.queue[this.currentTrackIndex || 0];
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
      console.log("loaded", track.id);
    }
    track.play();
  }

  next() {
    console.log("next");
    // slip to next track
    // load next in queue too
    const nextTrackId = this.nextTrackId();
    this.stop();
    this.play(nextTrackId);
  }

  prev() {
    // skip to start of current track or if withing a threshold the prev track
    const currentTrack = this.currentTrack();
    const elapsed = (currentTrack && currentTrack.elapsed()) || 0
    console.log(elapsed);
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

  pause(id?: string) {
    // pause playing
    const trackId = id || this.queue[this.currentTrackIndex || 0];
    if (!trackId) return;
    this.tracks[trackId].pause();
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

export function createMediaPlayer() {
  return new MediaPlayer();
}
