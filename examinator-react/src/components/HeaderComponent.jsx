import { useState, useEffect } from 'react';

const HeaderComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-icon')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    return (
        <header className="main-header">
            <a href="/" className="logo">
                Examinator
            </a>
            <div className="user-menu">
                <div
                    className="user-icon"
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
                    <span className="material-icons">account_circle</span>
                    <span className="material-icons arrow">expand_more</span>
                </div>
                {showDropdown && (
                    <ul className="dropdown">
                        <li>
                            <a href="/settings">
                                Podešavanja
                                <span className="material-icons">settings</span>
                            </a>
                        </li>
                        <li>
                            <a href="logout.html">
                                Odjava
                                <span className="material-icons">logout</span>
                            </a>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default HeaderComponent;
