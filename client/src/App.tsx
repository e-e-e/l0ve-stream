import React from 'react';
import Playlists from './containers/playlists';
import Page from './components/page/page';
import { CreatePlaylist } from './containers/create_playlist';
import { Switch, Route } from 'react-router-dom';
import { About } from './containers/about';
import { PlaylistView } from './containers/playlist';
import Header from './components/header/header';
import {
  createPlaylistUrl,
  feedUrl,
  logOutUrl,
  myPlaylistsUrl,
  profileUrl,
} from './routes/routes';
import { ProfileView } from './containers/profile';
import { Typography } from './components/typography/typography';
import { useDispatch } from 'react-redux';
import { fetchWhoAmI } from './redux/actions/user_actions';
// import { AddTrackView } from './containers/add_track';
import { Player } from './containers/player';
import { ScrollToTop } from './components/scroll_to_top/scroll_to_top';

function App() {
  const mainMenuOptions = {
    primaryAction: {
      label: 'Log out',
      url: logOutUrl(),
    },
    menuItems: [
      {
        label: 'Profile',
        url: profileUrl(),
      },
      {
        label: 'Feed',
        url: feedUrl(),
      },
      {
        label: 'My playlists',
        url: myPlaylistsUrl(),
      },
      {
        label: 'Add playlist',
        url: createPlaylistUrl(),
      },
    ],
  };

  const searchMenuOptions = {
    Content: () => <div>Search</div>,
  };

  const plusMenuOptions = {
    Content: ({ close }: { close?(): void }) => (
      <Switch>
        {/*<Route path="/playlist/:id">*/}
        {/*  <AddTrackView close={close} />*/}
        {/*</Route>*/}
        <Route path="/">
          <CreatePlaylist close={close} />
        </Route>
      </Switch>
    ),
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchWhoAmI());
  }, [dispatch]);
  return (
    <Page>
      <ScrollToTop />
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
      <Player />
    </Page>
  );
}

export default App;
