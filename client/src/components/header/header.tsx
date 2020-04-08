import React from "react";
import styles from "./header.module.css";
import { AddIcon, MenuIcon, SearchIcon } from "../icons/icons";
import { IconButton } from "../button/button";
import { Layer } from "../layer/layer";

function LayerButton({
  children,
  Content,
}: {
  children: React.ReactNode;
  Content: React.ComponentType<{}>;
}) {
  const [open, setOpen] = React.useState(false);
  const hide = React.useCallback(() => setOpen(false), [setOpen]);
  const show = React.useCallback(() => setOpen(true), [setOpen]);
  return (
    <span>
      <IconButton onClick={show}>{children}</IconButton>
      {open && <Layer onBackgroundClick={hide}><Content/></Layer>}
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
        <LayerButton Content={() => <div>Menu</div>}>
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
