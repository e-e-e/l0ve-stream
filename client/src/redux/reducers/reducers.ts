import { combineReducers } from "redux";
import { playlistReducer } from "./playlists";

export const reducer = combineReducers({
  entities: combineReducers({
    playlists: playlistReducer,
  }),
  // ui: ,
});
