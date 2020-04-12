import { combineReducers } from "redux";
import {playlistReducer, PlaylistsState} from "./playlists";
import { userReducer, UserState } from "./user";

export const reducer = combineReducers({
  user: userReducer,
  entities: combineReducers({
    playlists: playlistReducer,
  }),
  // ui: ,
});

export type RootState = ReturnType<typeof reducer>;

// {
//   user: UserState;
//   entities: {
//     playlists: PlaylistsState;
//   };
// };
