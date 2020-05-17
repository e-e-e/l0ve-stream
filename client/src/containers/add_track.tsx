import { Input } from '../components/input/input';
import React from 'react';
import { Button } from '../components/button/button';
import { DropArea } from '../components/drop_area/drop_area';
import { Typography } from '../components/typography/typography';
import { useDispatch } from 'react-redux';
import {
  createPlaylistTrack,
  updatePlaylistTrack,
} from '../redux/actions/playlists_actions';
import { TrackInput } from '../../__generated_types__/globalTypes';
import { useParams } from 'react-router-dom';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type TrackInputWithFile = TrackInput & { file?: File };

type AddTrackProps = {
  initialState?: Nullable<TrackInput> & { id: string };
  close?(): void;
};

export const AddTrackView = ({ close, initialState }: AddTrackProps) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [trackData, setTrackData] = React.useState<TrackInputWithFile>({
    title: initialState?.title || '',
    artist: initialState?.artist || '',
    album: initialState?.album || '',
    duration: null,
  });
  const submit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!(event.target instanceof HTMLFormElement)) return;
      if (initialState) {
        dispatch(
          updatePlaylistTrack({
            playlistId: id,
            track: { ...trackData, id: initialState.id },
          }),
        );
      } else {
        dispatch(createPlaylistTrack({ playlistId: id, track: trackData }));
      }
      close?.();
    },
    [close, dispatch, id, trackData, initialState],
  );
  // TODO: think about generalising form input
  const onTitleChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, title: value }));
    },
    [setTrackData],
  );
  const onArtistChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, artist: value }));
    },
    [setTrackData],
  );
  const onAlbumChange = React.useCallback(
    (value: string) => {
      setTrackData((state) => ({ ...state, album: value }));
    },
    [setTrackData],
  );
  const onFileChange = React.useCallback(
    (value?: File) => {
      console.log(value);
      setTrackData((state) => ({ ...state, file: value }));
    },
    [setTrackData],
  );
  return (
    <DropArea onFileDrop={() => {}} overlayText="Drop a music file here.">
      <form onSubmit={submit}>
        <Input
          name="title"
          placeholder="title"
          onChange={onTitleChange}
          value={trackData.title}
        />
        <Input
          name="artist"
          placeholder="artist/s"
          onChange={onArtistChange}
          value={trackData.artist}
        />
        <Input
          name="album"
          placeholder="album"
          onChange={onAlbumChange}
          value={trackData.album}
        />
        {initialState ? undefined : (
          <Input name="file" type="file" onChange={onFileChange} />
        )}
        <Button type="submit" disabled={false}>
          {initialState ? 'Update track' : 'Add new track'}
        </Button>
        <Typography>
          Or drag and drop a music file to automatically populate.
        </Typography>
      </form>
    </DropArea>
  );
};
