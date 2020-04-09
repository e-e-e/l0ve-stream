import React from "react";
import styles from "./header.module.css";
import { AddIcon, MenuIcon, SearchIcon } from "../icons/icons";
import { IconButton, Button, ListButton } from "../button/button";
import { Layer } from "../layer/layer";
import {
  createPlaylistUrl,
  feedUrl,
  logOutUrl,
  myPlaylistsUrl,
  useNavigationHandler,
} from "../../routes/routes";

function MainMenu({ close }: { close?(): void }) {
  const goToFeed = useNavigationHandler(feedUrl(), close);
  const goToCreatePlaylist = useNavigationHandler(createPlaylistUrl(), close);
  const goToMyPlaylists = useNavigationHandler(myPlaylistsUrl(), close);
  const goToLogOut = useNavigationHandler(logOutUrl(), close);
  return (
    <div>
      <div className={styles.list}>
        <ListButton onClick={goToFeed}>Profile</ListButton>
        <ListButton onClick={goToFeed}>Feed</ListButton>
        <ListButton onClick={goToCreatePlaylist}>Add playlist</ListButton>
        <ListButton onClick={goToMyPlaylists}>My playlists</ListButton>
      </div>
      <Button onClick={goToLogOut}>Log out</Button>
    </div>
  );
}

function LayerButton({
  children,
  Content,
}: {
  children: React.ReactNode;
  Content: React.ComponentType<{ close?(): void }>;
}) {
  const [open, setOpen] = React.useState(false);
  const hide = React.useCallback(() => setOpen(false), [setOpen]);
  const show = React.useCallback(() => setOpen(true), [setOpen]);
  return (
    <span>
      <IconButton onClick={show}>{children}</IconButton>
      {open && (
        <Layer onBackgroundClick={hide}>
          <Content close={hide} />
        </Layer>
      )}
    </span>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <LayerButton Content={() => <div>Search</div>}>
          <SearchIcon />
        </LayerButton>
        <LayerButton Content={MainMenu}>
          <MenuIcon />
        </LayerButton>
        <LayerButton Content={() => <div>Add</div>}>
          <AddIcon />
        </LayerButton>
      </nav>
    </header>
  );
}

export default Header;
