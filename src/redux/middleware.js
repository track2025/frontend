/* Core */
import { createLogger } from 'redux-logger';

const middleware = [];

if (process.env.NODE_ENV === 'development') {
  // Dynamically import redux-logger so it never bundles in prod
  const { createLogger } = require('redux-logger');

  middleware.push(
    createLogger({
      duration: true,
      timestamp: false,
      collapsed: true,
      colors: {
        title: () => '#139BFE',
        prevState: () => '#1C5FAF',
        action: () => '#149945',
        nextState: () => '#A47104',
        error: () => '#ff0005'
      },
      predicate: (getState, action) =>
        typeof window !== 'undefined' && !action.type.startsWith('persist/')
    })
  );
}

export { middleware };
