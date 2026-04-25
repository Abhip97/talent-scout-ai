import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar } from './components/Layout/Navbar.jsx';
import { Sidebar } from './components/Layout/Sidebar.jsx';
import { Footer } from './components/Layout/Footer.jsx';
import { AgentDashboard } from './components/Agent/AgentDashboard.jsx';
import { ApiKeyModal } from './components/Settings/ApiKeyModal.jsx';
import { AboutModal } from './components/Settings/AboutModal.jsx';

function MainLayout() {
  const { theme } = useApp();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0a0a0f';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fafafa';
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme === 'dark' ? '#0a0a0f' : '#fafafa', color: theme === 'dark' ? '#ffffff' : '#111111' }}
      >
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto flex flex-col">
            <AgentDashboard />
            <Footer />
          </main>
        </div>
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
