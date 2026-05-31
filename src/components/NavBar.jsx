import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { config } from '../config.js';
import { useIsMobile } from '../lib/useIsMobile.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/progress', label: 'Progress' },
  { to: '/tips', label: 'Tips & Tricks' },
  { to: '/diet', label: "Diet & Do's" },
  { to: '/gallery', label: 'Gallery' },
  { to: '/names', label: 'Names' },
];

export default function NavBar() {
  // Logic that decides which navigation to render: a tap-to-open menu on
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

  // Prevent the page behind an open mobile menu from scrolling.
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
              className={`nav-toggle ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>

            {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

            <div id="mobile-menu" className={`nav-links mobile ${open ? 'is-open' : ''}`}>
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end}>
                  {l.label}
                </NavLink>
              ))}
            </div>
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
