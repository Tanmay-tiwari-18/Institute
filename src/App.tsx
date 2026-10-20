import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Contact from './pages/Contact';
import UploadNote from './pages/UploadNote';
import Notes from './pages/Notes';
import UploadResult from './pages/UploadResult';
import SearchResult from './pages/SearchResult';
import AddStudent from "./pages/AddStudent";
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-inter">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload-note" element={<UploadNote />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/upload-result" element={<UploadResult />} />
          <Route path="/search-result" element={<SearchResult />} />
          <Route path="/add-student" element={<AddStudent />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
