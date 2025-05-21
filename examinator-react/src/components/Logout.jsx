import React, { useEffect } from 'react';
import '../styles/logout.scss';
import logoutGif from '../assets/logout.GIF';
import { Link } from 'react-router-dom';

export default function Logout() {
    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('logout-body');
    }, []);
    return (
        <div className="logout-container">
            <img
                src={logoutGif}
                alt="Odjava animacija"
                className="logout-gif"
            />
            <Link to="/login" className="loginout-button">
                Prijavi se ponovo
            </Link>

            <footer className="page-footer">
                Copyright© Karirane papuče 2025
            </footer>
        </div>
    );
}
