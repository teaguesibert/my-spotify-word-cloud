import React from 'react';
import { useTheme } from 'next-themes';
import "./ThemeButton.css"

const ThemeButton = () => {
    const { theme, setTheme } = useTheme();

    return (
        <label className="toggle-switch hover:scale-110">
            <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <span className="slider round"></span>
        </label>
    );
};

export default ThemeButton;
