import React from 'react';
import style from './icons.module.css';
// import { ReactComponent as PlayIconSvg } from "./play.svg";
// import { ReactComponent as PlayIconSvg } from './play-black.svg';
import { ReactComponent as PlayIconSvg } from './icon-play.svg';
import { ReactComponent as PlayingIconSvg } from './icon-playing.svg';
import { ReactComponent as PauseIconSvg } from './icon-pause.svg';
import { ReactComponent as PointIconSvg } from './icon-point.svg';
import { ReactComponent as MenuIconSvg } from './icon-menu.svg';
import { ReactComponent as TrashIconSvg } from './icon-trash.svg';
import { ReactComponent as AddIconSvg } from './icon-add.svg';
import { ReactComponent as CheckIconSvg } from './icon-check.svg';
import { ReactComponent as SearchIconSvg } from './icon-search.svg';
import { ReactComponent as CloudIconSvg } from './icon-cloud.svg';
import { ReactComponent as RefreshIconSvg } from './icon-refresh.svg';
import { ReactComponent as RearrangeIconSvg } from './icon-rearrange.svg';
import { ReactComponent as CloseIconSvg } from './icon-x.svg';

export const PlayIcon = () => <PlayIconSvg />;
export const PlayingIcon = () => <PlayingIconSvg />;
export const PauseIcon = () => <PauseIconSvg />;
export const PointIcon = () => <PointIconSvg />;
export const MenuIcon = () => <MenuIconSvg />;
export const TrashIcon = () => <TrashIconSvg />;
export const AddIcon = () => <AddIconSvg />;
export const CheckIcon = () => <CheckIconSvg />;
export const SearchIcon = () => <SearchIconSvg />;
export const RefreshIcon = () => <RefreshIconSvg />;
export const RearrangeIcon = () => <RearrangeIconSvg />;
export const CloseIcon = () => <CloseIconSvg />;
export const CloudIcon = () => <CloudIconSvg />;
export const Spinner = () => (
  <div className={style.spinner}>
    <RefreshIcon />
  </div>
);
