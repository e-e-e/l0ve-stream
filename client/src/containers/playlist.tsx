import { GridCard } from '../components/grid_card/grid_card';
import { Typography } from '../components/typography/typography';
import { PlayIcon } from '../components/icons/icons';
import { Section } from '../components/section/section';
import { TrackItem } from '../components/track_item/track_item';
import React from 'react';
import { useParams } from 'react-router-dom';
import { AddTrackView } from './add_track';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPlaylistTrack,
  deletePlaylistTrack,
  fetchPlaylist,
  updatePlaylistTrackOrder,
} from '../redux/actions/playlists_actions';
import { DropResult } from 'react-beautiful-dnd';
import { DraggableList } from '../components/draggable_list/draggable_list';
import { DropArea } from '../components/drop_area/drop_area';
import {
  selectError,
  selectIsLoading,
  selectPlaylist,
} from '../redux/selectors/playlists';
import { Layer } from '../components/layer/layer';
import { Button } from '../components/button/button';
import { Playlist } from '../redux/reducers/playlists';
import { Metadata } from '../services/metadata/metadata';
import { playTrack } from '../redux/actions/media_player';
import { getFileUpload } from '../redux/selectors/ui';

const getTrackData = (playlist: Playlist, trackId: string) => {
  const track = playlist.tracks?.find((t) => t.id === trackId);
  if (!track || !track.id) return undefined;
  return {
    ...track,
    id: track.id,
  };
};

const metadataService = new Metadata();

const TrackView = ({
  id,
  index,
  title,
  artist,
  album,
  filename,
  hasFiles,
  onEdit,
  onDelete,
  onPlay,
}: {
  id?: string | null;
  index: number;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  filename?: string;
  hasFiles?: boolean;
  onDelete?: (id: string) => void;
  onPlay?: (id: string) => void;
  onEdit?: (id: string) => void;
  progress?: number;
}) => {
  console.log('render track', id);
  const upload = useSelector(getFileUpload(id || undefined));
  if (!id || !title || !artist || !album) {
    return null;
  }
  console.log('status', upload?.status);
  return (
    <TrackItem
      id={id}
      index={index}
      title={title}
      artist={artist}
      album={album}
      isDraggable={true}
      onDelete={onDelete}
      onEdit={onEdit}
      onPlay={hasFiles ? onPlay : undefined}
      progress={upload?.progress || 0.5}
    />
  );
};

export const PlaylistView = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const data = useSelector(selectPlaylist(id));
  const error = useSelector(selectError);
  const loading = useSelector(selectIsLoading);
  React.useEffect(() => {
    if (!data && id) {
      dispatch(fetchPlaylist({ id }));
    }
  }, [id, dispatch, data]);
  const [editingTrackId, setEditingTrackWithId] = React.useState<string | null>(
    null,
  );
  const openAddTrackLayer = (id?: string) => setEditingTrackWithId(id || null);
  const hideAddTrackLayer = () => setEditingTrackWithId(null);

  const deleteTrack = React.useCallback(
    (trackId: string) => {
      dispatch(deletePlaylistTrack({ playlistId: id, trackId }));
    },
    [dispatch, id],
  );
  // const editTrack = React.useCallback(() => openAddTrackLayer(id), []);
  const updateTrackOrder = React.useCallback(
    (result: DropResult) => {
      console.log(result);
      if (result.source.index == null || result.destination?.index == null)
        return;
      dispatch(
        updatePlaylistTrackOrder({
          from: result.source.index,
          to: result.destination?.index,
          playlistId: id,
        }),
      );
    },
    [id, dispatch],
  );
  const playTrackWithId = React.useCallback((trackId: string) => {
    console.log('play', trackId, id);
    dispatch(playTrack({ track: trackId, playlist: id }));
  }, []);
  const addTrackFile = React.useCallback(
    async (file: File) => {
      const data = await metadataService.read(file);
      dispatch(
        createPlaylistTrack({
          playlistId: id,
          track: {
            title: data.title || data.filename,
            album: data.album || 'unknown',
            artist: data.album || 'unknown',
            // year: data.year,
            // genre: data.genre,
            file: file,
          },
        }),
      );
    },
    [dispatch, id],
  );
  if (error) return <div>{error}</div>;
  if (loading) return <div>{loading}</div>;
  if (!data) {
    return <>Not found</>;
  }
  return (
    <DropArea onFileDrop={addTrackFile}>
      <GridCard
        topLeft={<Typography variant="h2">{data.title}</Typography>}
        bottomLeft={<Typography>{data.owner?.name}</Typography>}
        bottomRight={
          <div style={{ textAlign: 'center' }}>
            <PlayIcon />
          </div>
        }
        info={{ top: '2', bottom: '14m' }}
      />
      <p>{data.description}</p>
      <Section>
        <DraggableList onDrop={updateTrackOrder}>
          {data.tracks?.map((track, i) => {
            console.log(i, track?.files)
            return (
              track && (
                <TrackView
                  key={track.id || i}
                  id={track.id}
                  index={i}
                  title={track.title}
                  artist={track.artist}
                  album={track.album}
                  onDelete={deleteTrack}
                  filename={
                    track.files?.length
                      ? track.files[0].filename || undefined
                      : undefined
                  }
                  hasFiles={
                    track.files?.length ? track.files[0]?.status === '2' : false
                  }
                  onEdit={openAddTrackLayer}
                  onPlay={playTrackWithId}
                />
              )
            );
          })}
        </DraggableList>
        {editingTrackId && (
          <Layer onBackgroundClick={hideAddTrackLayer}>
            <AddTrackView
              close={hideAddTrackLayer}
              initialState={getTrackData(data, editingTrackId)}
            />
          </Layer>
        )}
        <Button onClick={() => openAddTrackLayer('new')}>Add new track</Button>
      </Section>
    </DropArea>
  );
};
