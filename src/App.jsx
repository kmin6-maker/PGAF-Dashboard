import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Directory from './components/Directory';
import WelcomeScreen from './components/WelcomeScreen';
import { LayoutDashboard, Users, Loader2, Menu } from 'lucide-react';
import { fetchGoogleSheetData } from './utils/excelParser';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1HsjwyXSfkf0EtJCZkYI9ECQb59GyeMwxKpoMDVH1OaQ/edit?usp=sharing";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('pgaf_auth') === 'true';
  });
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    sessionStorage.setItem('pgaf_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pgaf_auth');
    setIsAuthenticated(false);
    setData(null); // Clear data from memory
  };

  // Only fetch data if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const parsedData = await fetchGoogleSheetData(SHEET_URL);
        setData(parsedData);
      } catch (err) {
        setError("Failed to load data from the Google Sheet. Ensure it is published or publicly accessible.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="icon">
            <LayoutDashboard size={18} />
          </div>
          P&G Network
        </div>

        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('directory'); setMobileMenuOpen(false); }}
          >
            <Users size={18} />
            <span>Ambassador Directory</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <button className="btn btn-secondary mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', marginRight: 'auto' }}>
            <Menu size={20} />
          </button>
          
          <div className="user-profile">
            <span>Dashboard</span>
            <div className="avatar">L</div>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: '1rem' }} onClick={handleLogout}>
              Lock
            </button>
          </div>
        </header>

        <div className="content-wrapper">
          {loading ? (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <Loader2 className="upload-icon" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', width: 48, height: 48, marginBottom: '1rem' }} />
              <h3>Syncing with Database...</h3>
              <p>Fetching the latest ambassador data securely</p>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ color: 'var(--danger)', textAlign: 'center', padding: '3rem' }}>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="animate-fade-in">
              {activeTab === 'overview' && <Dashboard data={data} />}
              {activeTab === 'directory' && <Directory data={data} />}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;
