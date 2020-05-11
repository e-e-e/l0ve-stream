import { useHistory } from 'react-router';
import React from 'react';

export function feedUrl() {
  return '/feed';
}

export function homeUrl() {
  return '/';
}

export function profileUrl() {
  return '/me';
}

export function myPlaylistsUrl() {
  return '/mine';
}

export function createPlaylistUrl() {
  return '/playlist/new';
}

export function playlistUrl(id: string) {
  return `/playlist/${id}`;
}

export function logOutUrl() {
  return '/logout';
}

export function signupUrl() {
  return '/signup';
}

export function logInUrl() {
  return '/login';
}

export const useNavigationHandler = (url: string, callback?: () => void) => {
  const history = useHistory();
  return React.useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      console.log(e, url);
      callback?.();
      history.push(url);
    },
    [history, url, callback],
  );
};
