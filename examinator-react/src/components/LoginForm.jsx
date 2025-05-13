import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Dobrodošli nazad!</h1>

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Korisničko ime</label>
            <input type="text" id="username" className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Lozinka</label>
            <input type="password" id="password" className="form-input" required />
          </div>

          <a href="#" className="forgot-password">Zaboravili ste lozinku?</a>

          <button type="submit" className="login-button">Prijavi se</button>
        </form>

        <p className="register-prompt">
          Još uvijek nemate nalog?{' '}
          <Link to="/register" className="register-link">Kreiraj</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
