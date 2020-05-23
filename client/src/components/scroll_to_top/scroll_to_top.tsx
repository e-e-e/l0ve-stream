import React from 'react';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

function ScrollToTopInternal({ history }: { history: History<unknown> }) {
  React.useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
}

export const ScrollToTop = withRouter(ScrollToTopInternal);
