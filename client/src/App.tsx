import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Playlists from "./containers/playlists";
import Page from "./components/page/page";
import { CreatePlaylist } from "./containers/create_playlist";
import { WhoAmI } from "./__generated_types__/WhoAmI";
import { Layer } from "./components/layer/layer";
import { Button } from "./components/button/button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { About } from "./containers/about";
import { PlaylistView } from "./containers/playlist";
import Header from "./components/header/header";
import {
  createPlaylistUrl,
  feedUrl,
  homeUrl,
  logOutUrl,
  myPlaylistsUrl,
  profileUrl,
} from "./routes/routes";
import { ProfileView } from "./containers/profile";
import { Typography } from "./components/typography/typography";
import { useDispatch } from "react-redux";
import { FETCH_PLAYLISTS } from "./redux/actions/actions";

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
    console.log('displatch')
    dispatch({ type: FETCH_PLAYLISTS });
  }, [dispatch]);
  return (
    <Router>
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
    </Router>
  );
}

export default App;
