import React from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Kreirajte nalog</h1>

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Ime i prezime</label>
            <input
              type="text"
              id="reg-name"
              className="form-input"
              name="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">Korisničko ime</label>
            <input
              type="text"
              id="reg-username"
              className="form-input"
              name="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input
              type="email"
              id="reg-email"
              className="form-input"
              name="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Lozinka</label>
            <input
              type="password"
              id="reg-password"
              className="form-input"
              name="password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Potvrdi lozinku</label>
            <input
              type="password"
              id="reg-confirm"
              className="form-input"
              name="confirmPassword"
              required
            />
          </div>

          <button type="submit" className="login-button">Registruj se</button>
        </form>

        <p className="register-prompt">
          Već imate nalog?{' '}
          <Link to="/" className="register-link">Prijavite se</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterForm;
