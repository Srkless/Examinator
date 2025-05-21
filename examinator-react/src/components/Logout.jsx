import React from 'react';
import '../styles/logout.scss';
import logoutGif from '../assets/logout.GIF';
import { Link } from 'react-router-dom';

export default function Logout() {
  return (
    <div className="logout-container">
      <img src={logoutGif} alt="Odjava animacija" className="logout-gif" />
      <Link to="/login" className="login-button-logout">Prijavi se ponovo</Link>

      <footer className="page-footer">
        Copyright© Karirane papuče 2025
      </footer>
    </div>
  );
}
