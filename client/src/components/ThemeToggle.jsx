import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="px-6 py-2 rounded-xl bg-pink-200 dark:bg-gray-800 text-black dark:text-white font-semibold transition duration-300 shadow-lg hover:scale-105"
      >
        {darkMode ? '🌙 Night Mode' : '🌞 Light Mode'}
      </button>
    </div>
  );
};

export default ThemeToggle;
