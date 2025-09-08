import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EpubViewer from './pages/EpubViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ebook_reader" element={<EpubViewer />}/>
        <Route path="/" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;
