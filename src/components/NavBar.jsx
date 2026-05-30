import { NavLink } from 'react-router-dom';
import { config } from '../config.js';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/progress', label: 'Progress' },
  { to: '/tips', label: 'Tips & Tricks' },
  { to: '/diet', label: "Diet & Do's" },
  { to: '/gallery', label: 'Gallery' },
  { to: '/names', label: 'Names' },
];

export default function NavBar() {
  return (
    <header className="site-header">
      <nav className="nav-inner">
        <NavLink to="/" end className="brand">
          <span className="heart">👶</span>
          {config.babyNickname || 'Our Baby Journey'}
        </NavLink>
        <div className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
