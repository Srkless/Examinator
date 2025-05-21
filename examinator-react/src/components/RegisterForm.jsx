import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/loginService';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrorMessage(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setErrorMessage('Lozinke se ne poklapaju.');
            return;
        }

        try {
            await registerUser(
                form.firstName,
                form.lastName,
                form.username,
                form.email,
                form.password,
            );
            navigate('/login');
        } catch (err) {
            setErrorMessage(
                err.message || 'Došlo je do greške pri registraciji.',
            );
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
        <main className="login-page">
            <div className="login-card">
                <h1 className="login-title">Kreirajte nalog</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reg-first-name" className="form-label">
                            Ime
                        </label>
                        <input
                            type="text"
                            id="reg-first-name"
                            className="form-input"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-last-name" className="form-label">
                            Prezime
                        </label>
                        <input
                            type="text"
                            id="reg-last-name"
                            className="form-input"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-username" className="form-label">
                            Korisničko ime
                        </label>
                        <input
                            type="text"
                            id="reg-username"
                            className="form-input"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="reg-email"
                            className="form-input"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password" className="form-label">
                            Lozinka
                        </label>
                        <input
                            type="password"
                            id="reg-password"
                            className="form-input"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-confirm" className="form-label">
                            Potvrdi lozinku
                        </label>
                        <input
                            type="password"
                            id="reg-confirm"
                            className="form-input"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div
                            className="error-message"
                            style={{ color: 'red', marginBottom: '1rem' }}
                        >
                            {errorMessage}
                        </div>
                    )}

                    <button type="submit" className="login-button">
                        Registruj se
                    </button>
                </form>

                <p className="register-prompt">
                    Već imate nalog?{' '}
                    <Link to="/login" className="register-link">
                        Prijavite se
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default RegisterForm;
