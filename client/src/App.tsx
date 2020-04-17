import React from "react";
import Playlists from "./containers/playlists";
import Page from "./components/page/page";
import { CreatePlaylist } from "./containers/create_playlist";
import { Switch, Route } from "react-router-dom";
import { About } from "./containers/about";
import { PlaylistView } from "./containers/playlist";
import Header from "./components/header/header";
import {
  createPlaylistUrl,
  feedUrl,
  logOutUrl,
  myPlaylistsUrl,
  profileUrl,
} from "./routes/routes";
import { ProfileView } from "./containers/profile";
import { Typography } from "./components/typography/typography";
import { useDispatch } from "react-redux";
import { fetchWhoAmI } from "./redux/actions/user_actions";

function App() {
  const mainMenuOptions = {
    primaryAction: {
      label: "Log out",
      url: logOutUrl(),
    },
    menuItems: [
      {
        label: "Profile",
        url: profileUrl(),
      },
      {
        label: "Feed",
        url: feedUrl(),
      },
      {
        label: "My playlists",
        url: myPlaylistsUrl(),
      },
      {
        label: "Add playlist",
        url: createPlaylistUrl(),
      },
    ],
  };

  const searchMenuOptions = {
    Content: () => <div>Search</div>,
  };

  const plusMenuOptions = {
    Content: () => <div>Plus</div>,
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchWhoAmI());
  }, [dispatch]);
  return (
      <Page>
        <Header
          searchOptions={searchMenuOptions}
          plusOptions={plusMenuOptions}
          mainMenuOptions={mainMenuOptions}
        />
        <main>
          <Switch>
            <Route path="/me">
              <ProfileView />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route exact path="/playlist/new">
              <CreatePlaylist />
            </Route>
            <Route path="/playlist/:id">
              <PlaylistView />
            </Route>
            <Route path="/">
              <Playlists />
            </Route>
          </Switch>
          <Typography align="center"> ( ( ( ❤ ) ) ) ️</Typography>
        </main>
      </Page>
  );
}

export default App;
