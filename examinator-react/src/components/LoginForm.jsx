import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // adjust the path as needed

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // <-- get login from context

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'http://localhost:8080/api/users/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();
            login(data.token); // <--- sets token to localStorage + context
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('login-register-body');
    }, []);

    return (
        <main className="login-page login-register-body">
            <div className="login-card">
                <h1 className="login-title">Dobrodošli nazad!</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Korisničko ime</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Lozinka</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <a href="#" className="forgot-password">Zaboravili ste lozinku?</a>

                    <button type="submit" className="login-button">Prijavi se</button>

                    {error && <p className="error-message">{error}</p>}
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
