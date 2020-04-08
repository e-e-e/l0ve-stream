import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import img1 from "./1.jpeg";
import img2 from "./2.jpeg";
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

function App() {
  const { data, loading, error } = useQuery<WhoAmI>(gql`
    query WhoAmI {
      whoami {
        id
        name
        role
      }
    }
  `);
  const [openLayer, setOpenLayer] = useState<boolean>(false);
  return (
    <Router>
      <Page>
        <main>
          {loading && <p>loading</p>}
          {error && <p>{error?.message}</p>}
          <div>
            {data?.whoami?.name} {data?.whoami?.id} {data?.whoami?.role}
          </div>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/playlist/:id">
              <div>what playlist</div>
            </Route>
            <Route path="/">
              <Playlists />
            </Route>
          </Switch>
          {data?.whoami?.id && <CreatePlaylist userId={data.whoami.id} />}
          <div>{/*<img style={{ width: "100%" }} src={img1} />*/}</div>
          <p> ( ( ( ❤ ) ) ) ️</p>
          <Button onClick={() => setOpenLayer(true)}>open layer</Button>
          {openLayer && (
            <Layer onBackgroundClick={() => setOpenLayer(false)}>HELLO</Layer>
          )}
        </main>
      </Page>
    </Router>
  );
}

export default App;
