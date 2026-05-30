import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import { config } from './config.js';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="site-footer">
        Made with <span className="heart">♥</span> by {config.parentNames}
      </footer>
    </>
  );
}
