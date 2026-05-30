import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Progress from './pages/Progress.jsx';
import Tips from './pages/Tips.jsx';
import Diet from './pages/Diet.jsx';
import Gallery from './pages/Gallery.jsx';
import './styles/theme.css';

// HashRouter keeps deep links working on static hosts (GitHub Pages, etc.)
// without any server-side routing config.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="progress" element={<Progress />} />
          <Route path="tips" element={<Tips />} />
          <Route path="diet" element={<Diet />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
