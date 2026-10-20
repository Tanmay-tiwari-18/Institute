import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap } from 'lucide-react';

const links = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Results', path: '/results' },
  { label: 'Contact', path: '/contact' },
  { label: 'Notes', path: '/notes' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-amber-100/50' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-gray-900 tracking-tight">Kavita Shree</span>
            <span className="block text-xs text-amber-600 font-semibold tracking-widest uppercase">Institute</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.path;
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active ? 'text-amber-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-amber-50 rounded-lg -z-10 border border-amber-200"
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ml-4 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-amber-200 hover:scale-105 transition-all duration-200"
          >
            Enroll Now
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-700">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.path
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-xl text-center"
              >
                Enroll Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
