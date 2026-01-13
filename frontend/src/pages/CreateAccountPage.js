import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faUser, faEnvelope, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPages.css';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Error creating account');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Start your jewelry design journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              icon={<FontAwesomeIcon icon={faUser} />}
              required
            />

            <div className="form-row">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                icon={<FontAwesomeIcon icon={faPhone} />}
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                icon={<FontAwesomeIcon icon={faLock} />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                icon={<FontAwesomeIcon icon={faLock} />}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
