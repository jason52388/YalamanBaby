import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { config } from '../config.js';
import { useIsMobile } from '../lib/useIsMobile.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/plan', label: 'Your Plan' },
  { to: '/body', label: 'Your Body' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/names', label: 'Names' },
  { to: '/tips', label: 'Tips & Tricks' },
  { to: '/diet', label: "Diet Do's & Don'ts" },
];

export default function NavBar() {
  // Logic that decides which navigation to render: a tap-to-open drawer on
  // phones, the full inline link row on larger screens.
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the menu whenever we navigate to a new page…
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // …and whenever we grow back to the desktop layout, so we never leave a
  // stale "open" state lingering when the hamburger disappears.
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Prevent the page behind an open mobile drawer from scrolling.
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    return undefined;
  }, [isMobile, open]);

  return (
    <header className="site-header">
      <nav className="nav-inner">
        <NavLink to="/" end className="brand">
          <span className="heart">👶</span>
          {config.babyNickname || 'Our Baby Journey'}
        </NavLink>

        {isMobile ? (
          <>
            <button
              type="button"
              className="nav-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>

            {/* The drawer + backdrop are portaled to <body> so they aren't
                trapped inside the header's backdrop-filter containing block
                (which would clip a position:fixed child to the header). */}
            {createPortal(
              <>
                <div
                  className={`nav-backdrop ${open ? 'is-open' : ''}`}
                  onClick={() => setOpen(false)}
                />
                <div
                  id="mobile-menu"
                  className={`nav-links mobile ${open ? 'is-open' : ''}`}
                  aria-hidden={!open}
                >
                  <button
                    type="button"
                    className="drawer-close"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                  >
                    ×
                  </button>
                  {links.map((l) => (
                    <NavLink key={l.to} to={l.to} end={l.end} tabIndex={open ? 0 : -1}>
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </>,
              document.body,
            )}
          </>
        ) : (
          <div className="nav-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
