import React, { ComponentType, useCallback } from "react";
import styles from "./header.module.css";
import { AddIcon, MenuIcon, SearchIcon } from "../icons/icons";
import { IconButton, Button, ListButton } from "../button/button";
import { Layer } from "../layer/layer";
import {
  useNavigationHandler,
} from "../../routes/routes";

type HeaderLayerProps = { close?(): void };
type HeaderLayerContent = ComponentType<HeaderLayerProps>;

type MenuItem = { label: string; url: string };

type HeaderProps = {
  mainMenuOptions: MainMenuOptions;
  searchOptions?: { Content: HeaderLayerContent };
  plusOptions?: { Content: HeaderLayerContent };
};

type MainMenuOptions = { menuItems: MenuItem[]; primaryAction: MenuItem };

type MainMenuProps = HeaderLayerProps & MainMenuOptions;

function MenuItem({ url, label, close }: MenuItem & { close?: () => void }) {
  const onClick = useNavigationHandler(url, close);
  return <ListButton onClick={onClick}>{label}</ListButton>;
}

function MainMenu({ menuItems, primaryAction, close }: MainMenuProps) {
  const primaryNavigationHandler = useNavigationHandler(
    primaryAction.url,
    close
  );

  return (
    <div>
      <div className={styles.list}>
        {menuItems.map(({ label, url }) => (
          <MenuItem key={label} url={url} label={label} close={close} />
        ))}
      </div>
      <Button onClick={primaryNavigationHandler}>{primaryAction.label}</Button>
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

function Header({ mainMenuOptions, plusOptions, searchOptions }: HeaderProps) {
  const MainMenuWithItems = React.useCallback((props: HeaderLayerProps) => {
    if (!mainMenuOptions) throw new Error("Should have menu options");
    return (
      <MainMenu
        menuItems={mainMenuOptions?.menuItems}
        primaryAction={mainMenuOptions?.primaryAction}
        close={props.close}
      />
    );
  }, []);
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {searchOptions ? (
          <LayerButton Content={searchOptions?.Content}>
            <SearchIcon />
          </LayerButton>
        ) : (
          <span />
        )}
        <LayerButton Content={MainMenuWithItems}>
          <MenuIcon />
        </LayerButton>
        {plusOptions ? (
          <LayerButton Content={plusOptions?.Content}>
            <AddIcon />
          </LayerButton>
        ) : (
          <span />
        )}
      </nav>
    </header>
  );
}

export default Header;
