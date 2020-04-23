import { combineReducers } from "redux";
import { playlistReducer } from "./playlists";
import { userReducer } from "./user";
import { uiReducer } from "./ui";

export const reducer = combineReducers({
  user: userReducer,
  entities: combineReducers({
    playlists: playlistReducer,
  }),
  ui: uiReducer,
});

export type RootState = ReturnType<typeof reducer>;
