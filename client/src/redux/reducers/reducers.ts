import { combineReducers } from "redux";
import { playlistReducer } from "./playlists";
import { userReducer } from "./user";

export const reducer = combineReducers({
  user: userReducer,
  entities: combineReducers({
    playlists: playlistReducer,
  }),
});

export type RootState = ReturnType<typeof reducer>;
