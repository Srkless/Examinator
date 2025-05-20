import { useEffect, useRef, useState } from 'react';
import HeaderComponent from './HeaderComponent';

const SettingsForm = () => {
    const [isDark, setIsDark] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#f66f19');
    const [colorName, setColorName] = useState('Narandžasta');

    const themeToggleRef = useRef(null);
    const themeNameRef = useRef(null);
    const selectedColorNameRef = useRef(null);

    document.body.classList.add('settings-body');

    useEffect(() => {
        // Tema
        const storedTheme = localStorage.getItem('darkTheme');
        if (storedTheme === 'true') {
            document.body.classList.add('dark-theme');
            setIsDark(true);
            if (themeNameRef.current)
                themeNameRef.current.textContent = 'Tamna';
        } else {
            document.body.classList.remove('dark-theme');
            setIsDark(false);
            if (themeNameRef.current)
                themeNameRef.current.textContent = 'Svijetla';
        }
        // Akcentna boja
        const storedColor = localStorage.getItem('accentColor');
        const storedName = localStorage.getItem('colorName');
        if (storedColor && storedName) {
            document.documentElement.style.setProperty(
                '--accent-color',
                storedColor,
            );
            setSelectedColor(storedColor);
            setColorName(storedName);
        }
    }, []);

    const handleThemeChange = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('darkTheme', newIsDark);
        document.body.classList.toggle('dark-theme', newIsDark);
        if (themeNameRef.current)
            themeNameRef.current.textContent = newIsDark ? 'Tamna' : 'Svijetla';
    };

    const handleColorSelect = (color, name) => {
        setSelectedColor(color);
        setColorName(name);
        document.documentElement.style.setProperty('--accent-color', color);
        localStorage.setItem('accentColor', color);
        localStorage.setItem('colorName', name);
    };

    return (
        <div>
            <HeaderComponent />

            <div className="settings-container">
                <div className="settings-section">
                    <div className="setting-label">Promjena teme</div>
                    <div className="theme-toggle-container">
                        <span className="theme-name" ref={themeNameRef}>
                            Svijetla
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={handleThemeChange}
                                ref={themeToggleRef}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="setting-label">Akcentna boja</div>
                    <div className="color-setting-container">
                        <span
                            className="selected-color-name"
                            ref={selectedColorNameRef}
                        >
                            {colorName}
                        </span>
                        <div className="color-options">
                            {[
                                {
                                    color: '#dc3545',
                                    name: 'Crvena',
                                    class: 'color-red',
                                },
                                {
                                    color: '#0d6efd',
                                    name: 'Plava',
                                    class: 'color-blue',
                                },
                                {
                                    color: '#f66f19',
                                    name: 'Narandžasta',
                                    class: 'color-orange',
                                },
                                {
                                    color: '#ffc107',
                                    name: 'Žuta',
                                    class: 'color-yellow',
                                },
                                {
                                    color: '#28a745',
                                    name: 'Zelena',
                                    class: 'color-green',
                                },
                            ].map(({ color, name, class: className }) => (
                                <div
                                    key={color}
                                    className={`color-option ${className} ${selectedColor === color ? 'selected' : ''}`}
                                    data-color={color}
                                    data-name={name}
                                    onClick={() =>
                                        handleColorSelect(color, name)
                                    }
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsForm;
