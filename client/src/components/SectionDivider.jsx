import React from 'react';
import { useTheme } from '../ThemeContext';

const SectionDivider = () => {
  const { theme } = useTheme();

  return (
    <div className={`divider-mandala ${theme.divider} my-4`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="animate-spin-slow opacity-60">
        <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" />
        <path d="M12 22C12 22 14 18 14 16C14 14 12 12 12 12C12 12 10 14 10 16C10 18 12 22 12 22Z" />
        <path d="M2 12C2 12 6 10 8 10C10 10 12 12 12 12C12 12 10 14 8 14C6 14 2 12 2 12Z" />
        <path d="M22 12C22 12 18 10 16 10C14 10 12 12 12 12C12 12 14 14 16 14C18 14 22 12 22 12Z" />
        <path d="M4.93 4.93C4.93 4.93 8.1 6.34 9.17 7.41C10.24 8.48 12 12 12 12C12 12 8.48 10.24 7.41 9.17C6.34 8.1 4.93 4.93 4.93 4.93Z" />
        <path d="M19.07 19.07C19.07 19.07 15.9 17.66 14.83 16.59C13.76 15.52 12 12 12 12C12 12 15.52 13.76 16.59 14.83C17.66 15.9 19.07 19.07 19.07 19.07Z" />
        <path d="M4.93 19.07C4.93 19.07 6.34 15.9 7.41 14.83C8.48 13.76 12 12 12 12C12 12 10.24 15.52 9.17 16.59C8.1 17.66 4.93 19.07 4.93 19.07Z" />
        <path d="M19.07 4.93C19.07 4.93 17.66 8.1 16.59 9.17C15.52 10.24 12 12 12 12C12 12 13.76 8.48 14.83 7.41C15.9 6.34 19.07 4.93 19.07 4.93Z" />
      </svg>
    </div>
  );
};

export default SectionDivider;
