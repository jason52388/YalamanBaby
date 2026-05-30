import { useEffect, useState } from 'react';

// The single breakpoint that decides "mobile" vs "desktop" for the whole app.
// Kept here (and mirrored in theme.css) so the JS logic and the CSS agree.
export const MOBILE_BREAKPOINT = 768;

// useIsMobile — the bit of logic that decides whether we render the mobile
// layout. We listen to a matchMedia query (not a one-off width check) so the
// answer stays correct when the device rotates or the window is resized, and
// so it works on real phones, tablets, and resized desktop browsers alike.
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width: ${breakpoint}px)`;

  // Guard for SSR / non-browser environments where `window` is undefined.
  const getMatch = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(query).matches;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mql = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);

    // Sync once on mount in case the viewport changed before the listener
    // was attached (e.g. fast rotation during load).
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
