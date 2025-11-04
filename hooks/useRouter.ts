
import { useState, useEffect } from 'react';

const parseHash = (hash: string) => {
    console.log('useRouter: parsing hash:', hash);
    const [path, param, ...rest] = hash.substring(1).split('/');
    console.log('useRouter: path:', path, 'param:', param);
    let route = path || 'feed'; // Default to feed for logged-in developers

    // Handle auth routes specifically
    if (path === 'auth' && param === 'recruiter') {
        route = 'auth-recruiter';
    } else if (!path) {
        // If no hash, default could be auth if not logged in, but App handles that.
        // For logged-in state, default to feed.
        route = 'feed';
    }

    const params: Record<string, string> = {};
    if ((route === 'log' || route === 'circle' || route === 'profile') && param) {
        params.id = param;
    }

    console.log('useRouter: final route:', route, 'params:', params);
    return { route, params };
};

export const useRouter = () => {
  const [routerState, setRouterState] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRouterState(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return routerState;
};
