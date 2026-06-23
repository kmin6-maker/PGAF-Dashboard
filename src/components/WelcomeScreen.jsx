import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const WelcomeScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'PGAF2026') {
      setError(false);
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="welcome-container">
      {/* Animated background circles */}
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>
      <div className="bg-circle circle-3"></div>

      <div className="login-panel animate-fade-in">
        <div className="login-header">
          <div className="login-icon">
            <ShieldCheck size={32} color="white" />
          </div>
          <h1>PGAF Ambassadors Volunteer Management Platform</h1>
          <p>PGAF AVMP Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="password">Access Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="password"
                type="password" 
                className={`input-field login-input ${error ? 'error-shake' : ''}`} 
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="error-text">Incorrect password. Please try again.</p>}
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Access Dashboard
            <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="login-footer">
          <p>Confidential • Internal Use Only</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
