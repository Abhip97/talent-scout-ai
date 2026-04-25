import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar } from './components/Layout/Navbar.jsx';
import { Sidebar } from './components/Layout/Sidebar.jsx';
import { Footer } from './components/Layout/Footer.jsx';
import { AgentDashboard } from './components/Agent/AgentDashboard.jsx';
import { ApiKeyModal } from './components/Settings/ApiKeyModal.jsx';
import { AboutModal } from './components/Settings/AboutModal.jsx';
import { LandingPage } from './components/Landing/LandingPage.jsx';

function MainLayout() {
  const { theme, showApp, setShowApp } = useApp();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(249,115,22,0.10) 0%, transparent 60%), #0d0800';
      document.body.style.minHeight = '100vh';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = 'linear-gradient(135deg, #dde4ff 0%, #eef2ff 50%, #f0f4ff 100%)';
      document.body.style.minHeight = '100vh';
    }
  }, [isDark]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="h-screen flex flex-col overflow-hidden" style={{ color: isDark ? '#fff7ed' : '#1e293b' }}>
        <Navbar onGoHome={() => setShowApp(false)} />

        <AnimatePresence mode="wait">
          {!showApp ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-h-0 overflow-y-auto"
            >
              <LandingPage onGetStarted={() => setShowApp(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 min-h-0 overflow-hidden"
            >
              <Sidebar />
              <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <AgentDashboard />
                <Footer />
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        <ApiKeyModal />
        <AboutModal />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
