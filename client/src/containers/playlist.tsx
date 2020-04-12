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
import { fetchPlaylist } from "../redux/actions/playlists_actions";
import { LoadingState } from "../redux/reducers/helpers";

const selectPlaylist = (id: string) => (state: RootState) =>
  state.entities.playlists.byId[id];
const selectError = (state: RootState) =>
  state.entities.playlists.state === LoadingState.ERROR &&
  state.entities.playlists.errorMessage;
const selectIsLoading = (state: RootState) =>
  state.entities.playlists.state === LoadingState.LOADING;

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
  }, [id, data]);
  const AddTrack = React.useCallback(
    ({ close }: { close?(): void }) => (
      <AddTrackView close={close} playlistId={id} />
    ),
    [id]
  );
  if (error) return <div>{error}</div>;
  if (loading) return <div>{loading}</div>;
  if (!data) {
    return <>Not found</>;
  }
  const playlist = data;
  return (
    <div>
      <GridCard
        topLeft={<Typography variant="h2">{playlist.title}</Typography>}
        bottomLeft={<Typography>{playlist.owner?.name}</Typography>}
        bottomRight={
          <div style={{ textAlign: "center" }}>
            <PlayIcon />
          </div>
        }
        info={{ top: "2", bottom: "14m" }}
      />
      <p>{playlist.description}</p>
      <Section>
        {playlist.tracks?.map((track, i) => {
          if (!track?.id || !track.title || !track.artist || !track.album)
            return;
          return (
            <TrackItem
              key={track.id}
              index={i}
              title={track.title}
              artist={track.artist}
              album={track.album}
            />
          );
        })}
        <LayerButton Content={AddTrack}>Add new track</LayerButton>
      </Section>
    </div>
  );
};
