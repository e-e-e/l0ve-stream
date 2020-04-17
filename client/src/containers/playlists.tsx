import React, { useCallback } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { GridCard } from "../components/grid_card/grid_card";
import { PlayIcon, TrashIcon } from "../components/icons/icons";
import { Typography } from "../components/typography/typography";
import { playlistUrl, useNavigationHandler } from "../routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylists } from "../redux/actions/playlists_actions";
import { RootState } from "../redux/reducers/reducers";
import { LoadingState } from "../redux/reducers/helpers";
import { IconButton } from "../components/button/button";

const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($id: ID) {
    deletePlaylist(id: $id) {
      message
      success
    }
  }
`;

type PlaylistCardProps = {
  title: string;
  owner: string;
  description?: string | null;
  id: string;
};

const PlaylistCard = ({ title, owner, description, id }: PlaylistCardProps) => {
  const openPlaylist = useNavigationHandler(playlistUrl(id));
  const [deletePlaylistWithId, { data, error }] = useMutation(DELETE_PLAYLIST, {
    variables: { id },
  });
  // replace with dispatch
  const deletePlaylist = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await deletePlaylistWithId();
    },
    [deletePlaylistWithId]
  );
  console.log(error, data);
  return (
    <div>
      <GridCard
        onClick={openPlaylist}
        topLeft={
          <div>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="subtitle">{description}</Typography>
          </div>
        }
        bottomLeft={<Typography>{owner}</Typography>}
        bottomRight={
          <div style={{ textAlign: "center" }}>
            <IconButton onClick={deletePlaylist}>
              <TrashIcon />
            </IconButton>
            <PlayIcon />
          </div>
        }
        info={{ top: "2", bottom: "14m" }}
      />
    </div>
  );
};

const selectPlaylists = (state: RootState) => {
  const { allIds, byId } = state.entities.playlists;
  return allIds.map((id) => byId[id]);
};

const isLoading = (state: RootState) =>
  state.entities.playlists.state === LoadingState.LOADING;
const error = (state: RootState) =>
  state.entities.playlists.state === LoadingState.ERROR &&
  state.entities.playlists.errorMessage;
function Playlists() {
  const data = useSelector(selectPlaylists);
  const loading = useSelector(isLoading);
  const errorMessage = useSelector(error);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchPlaylists());
  }, [dispatch]);
  return (
    <section>
      <Typography variant="h1">Playlists</Typography>
      {loading && <div>loading</div>}
      {errorMessage && <div>{errorMessage}</div>}
      {data.map((v, i) => {
        if (!v || !v.id || !v.title || !v.owner?.name) return undefined;
        return (
          <PlaylistCard
            key={`${i}-${v?.id}`}
            title={v?.title}
            owner={v?.owner?.name}
            id={v.id}
            description={v.description}
          />
        );
      })}
    </section>
  );
}

export default Playlists;
