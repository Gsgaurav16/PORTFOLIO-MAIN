import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import AboutPlayer from './components/sections/AboutPlayer';
import SkillsLoadout from './components/sections/SkillsLoadout';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Reviews from './components/sections/Reviews';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import AdminLayout from './components/layout/AdminLayout';
import AdminProjects from './components/admin/AdminProjects';
import AdminSkills from './components/admin/AdminSkills';
import AdminExperience from './components/admin/AdminExperience';
import AdminReviews from './components/admin/AdminReviews';
import AdminSocials from './components/admin/AdminSocials';
import AdminProfile from './components/admin/AdminProfile';
import AdminSettings from './components/admin/AdminSettings';
import AdminMessages from './components/admin/AdminMessages';
import Login from './pages/Login';
import Launcher from './components/sections/Launcher';

import { useEffect, useState, useRef } from 'react';
import { usePortfolioStore } from './store/useStore';
import AdminDashboard from './components/admin/AdminDashboard';
import beatUrl from './assets/beat.mp3';

// Public Portfolio Page
const Portfolio = () => {
  const { fetchAllData, error, hasFetched } = usePortfolioStore();

  useEffect(() => {
    // Data is fetched at App level (Launcher), but we ensure it's here
    fetchAllData();
  }, [fetchAllData]);

  // Loading screen removed as per user request (Handled by Launcher now)


  // Show error with retry button if fetch completely failed
  if (error && !hasFetched) {
    return (
      <div className="min-h-screen bg-pastel-yellow flex flex-col items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="font-display text-2xl text-retro-dark uppercase mb-2">Connection Error</h2>
          <p className="font-mono text-sm text-retro-dark/70 mb-6">{error}</p>
          <button
            onClick={() => fetchAllData()}
            className="px-6 py-3 bg-retro-orange text-white font-display uppercase text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Navbar />
      <Hero />
      <div className="bg-[#064e3b] rounded-[3rem] mt-12 mb-20 relative z-10 pt-16 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-retro-dark/50 animate-bounce">Scroll</span>
        </div>
        <AboutPlayer />
        <SkillsLoadout />
      </div>
      <Projects />
      <Experience />
      <Reviews />
      <Contact />
      <Footer />
    </Layout>
  );
};


// Auth Wrapper
const ProtectedRoute = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { fetchAllData } = usePortfolioStore();

  // Preload data immediately when App mounts (while Launcher is visible)
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleEnter = (withMusic: boolean) => {
    setIsLaunched(true);
    if (withMusic && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(err => console.log('Audio autoplay prevented:', err));
    }
  };

  return (
    <ToastProvider>
      {/* Background Audio */}
      <audio ref={audioRef} loop src={beatUrl} />

      {/* Launcher Overlay */}
      {!isLaunched && <Launcher onEnter={handleEnter} />}

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="socials" element={<AdminSocials />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
