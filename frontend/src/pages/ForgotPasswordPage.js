import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faEnvelope, faKey, faLock, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPages.css';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Reset code sent to your email!' });
        setStep(2);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send reset code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.token);
        setMessage({ type: 'success', text: 'Code verified! Set your new password.' });
        setStep(3);
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid or expired code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map((s) => (
        <div key={s} className={'step-dot ' + (step >= s ? 'active' : '') + (step > s ? ' completed' : '')}>
          {step > s ? <FontAwesomeIcon icon={faCheck} /> : s}
        </div>
      ))}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-gradient" />
      </div>

      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <FontAwesomeIcon icon={faGem} />
          <span>Lustre</span>
        </Link>

        <div className="auth-card">
          {step < 4 && renderStepIndicator()}

          {step === 1 && (
            <>
              <div className="auth-header">
                <h1>Forgot Password</h1>
                <p>Enter your email to receive a reset code</p>
              </div>

              <form onSubmit={handleRequestCode} className="auth-form">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  icon={<FontAwesomeIcon icon={faEnvelope} />}
                  required
                />

                {message.text && (
                  <div className={'auth-message ' + message.type}>{message.text}</div>
                )}

                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="auth-header">
                <h1>Enter Code</h1>
                <p>We sent a 6-digit code to {email}</p>
              </div>

              <form onSubmit={handleVerifyCode} className="auth-form">
                <Input
                  label="Reset Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  icon={<FontAwesomeIcon icon={faKey} />}
                  maxLength={6}
                  required
                />

                {message.text && (
                  <div className={'auth-message ' + message.type}>{message.text}</div>
                )}

                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <button type="button" className="text-btn" onClick={() => setStep(1)}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Change email
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="auth-header">
                <h1>New Password</h1>
                <p>Create a strong password for your account</p>
              </div>

              <form onSubmit={handleResetPassword} className="auth-form">
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  icon={<FontAwesomeIcon icon={faLock} />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  icon={<FontAwesomeIcon icon={faLock} />}
                  required
                />

                {message.text && (
                  <div className={'auth-message ' + message.type}>{message.text}</div>
                )}

                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}

          {step === 4 && (
            <div className="success-state">
              <div className="success-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h1>Password Reset!</h1>
              <p>Your password has been successfully reset. You can now sign in with your new password.</p>
              <Button onClick={() => navigate('/login')} fullWidth>
                Sign In
              </Button>
            </div>
          )}

          {step < 4 && (
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
