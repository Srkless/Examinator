import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/RequireAuth';
import SettingsPage from './pages/SettingsPage';
import LogoutPage from './pages/LogoutPage.jsx'
import ActivitiesPage from './pages/ActivitiesPage.jsx'
import StudentManagementPage from './pages/StudentManagementPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx'
import { AuthContext } from './contexts/AuthContext.jsx';
import { useContext } from 'react';
import './styles/styles.scss';

const App = () => {
    const { token, loading } = useContext(AuthContext);
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

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/students" element={<StudentManagementPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
