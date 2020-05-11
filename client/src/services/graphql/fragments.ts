import { gql } from 'apollo-boost';

export const TRACK_INFO = gql`
  fragment TrackInfo on Track {
    id
    title
    album
    artist
    year
    genre
    files {
      id
      filename
      status
    }
  }
`;

export const OWNER_INFO = gql`
  fragment OwnerInfo on User {
    id
    name
  }
`;

export const PLAYLIST_INFO = gql`
  fragment PlaylistInfo on Playlist {
    id
    title
    description
    tracks {
      ...TrackInfo
    }
    owner {
      ...OwnerInfo
    }
  }
  ${TRACK_INFO}
  ${OWNER_INFO}
`;
