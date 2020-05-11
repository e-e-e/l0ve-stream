import { GridCard } from "../components/grid_card/grid_card";
import { Typography } from "../components/typography/typography";
import { PlayIcon } from "../components/icons/icons";
import { Section } from "../components/section/section";
import { TrackItem } from "../components/track_item/track_item";
import React from "react";
import { useParams } from "react-router-dom";
import { AddTrackView } from "./add_track";
import { LayerButton } from "../components/layer_button/layer_button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/reducers";
import {
  deletePlaylistTrack,
  fetchPlaylist,
  updatePlaylistTrackOrder,
} from "../redux/actions/playlists_actions";
import { LoadingState } from "../redux/reducers/helpers";
import { DropResult } from "react-beautiful-dnd";
import { DraggableList } from "../components/draggable_list/draggable_list";
import { DropArea } from "../components/drop_area/drop_area";
import {
  selectError,
  selectIsLoading,
  selectPlaylist,
} from "../redux/selectors/playlists";
import { Layer } from "../components/layer/layer";
import { Button } from "../components/button/button";
import { Playlist } from "../redux/reducers/playlists";

const getTrackData = (playlist: Playlist, trackId: string) => {
  const track = playlist.tracks?.find((t) => t.id === trackId);
  if (!track || !track.id) return undefined;
  return {
    ...track,
    id: track.id,
  };
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
    null
  );
  const openAddTrackLayer = (id?: string) => setEditingTrackWithId(id || null);
  const hideAddTrackLayer = () => setEditingTrackWithId(null);

  const deleteTrack = React.useCallback(
    (trackId: string) => {
      dispatch(deletePlaylistTrack({ playlistId: id, trackId }));
    },
    [dispatch, id]
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
        })
      );
    },
    [id, dispatch]
  );
  const playTrack = React.useCallback((trackId: string) => {
    console.log("play", trackId);
  }, []);
  if (error) return <div>{error}</div>;
  if (loading) return <div>{loading}</div>;
  if (!data) {
    return <>Not found</>;
  }
  return (
    <DropArea
      onFileDrop={(file) => {
        // process file and open add dialog prefilled
      }}
    >
      <GridCard
        topLeft={<Typography variant="h2">{data.title}</Typography>}
        bottomLeft={<Typography>{data.owner?.name}</Typography>}
        bottomRight={
          <div style={{ textAlign: "center" }}>
            <PlayIcon />
          </div>
        }
        info={{ top: "2", bottom: "14m" }}
      />
      <p>{data.description}</p>
      <Section>
        <DraggableList onDrop={updateTrackOrder}>
          {data.tracks?.map((track, i) => {
            if (!track?.id || !track.title || !track.artist || !track.album)
              return;
            const hasFiles =
              track.files?.length && track.files[0]?.status === "2";
            return (
              <TrackItem
                key={track.id}
                id={track.id}
                index={i}
                title={track.title}
                artist={track.artist}
                album={track.album}
                isDraggable={true}
                onDelete={deleteTrack}
                onEdit={openAddTrackLayer}
                onPlay={hasFiles ? playTrack : undefined}
              />
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
        <Button onClick={() => openAddTrackLayer("new")}>Add new track</Button>
      </Section>
    </DropArea>
  );
};
