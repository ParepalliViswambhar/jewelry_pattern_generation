import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import './styles/variables.css';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      sessionStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('token');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>404</h1>
              <p>Page not found</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
