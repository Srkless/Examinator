import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/RequireAuth';
import SettingsPage from './pages/SettingsPage';
import './styles/styles.scss';

const App = () => {
    useEffect(() => {
        const storedAccentColor = localStorage.getItem('accentColor');
        if (storedAccentColor) {
            document.documentElement.style.setProperty(
                '--accent-color',
                storedAccentColor,
            );
        }

        const storedTheme = localStorage.getItem('darkTheme');
        if (storedTheme == 'true') {
            document.body.classList.add('dark-theme');
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
