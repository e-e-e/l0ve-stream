import { combineReducers } from "redux";
import { playlistReducer } from "./playlists";
import { userReducer } from "./user";
import { uiReducer } from "./ui";
import { mediaPlayerReducer } from "./media_player";

export const reducer = combineReducers({
  user: userReducer,
  entities: combineReducers({
    playlists: playlistReducer,
  }),
  player: mediaPlayerReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof reducer>;
