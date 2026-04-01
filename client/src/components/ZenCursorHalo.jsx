import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

const ZenCursorFlower = () => {
    const { theme } = useTheme();
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed pointer-events-none z-[9999] hidden md:block" 
            style={{
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {/* Revolving Petals */}
            <div className="relative w-12 h-12">
                <svg viewBox="0 0 100 100" className={`w-full h-full ${theme.svgColor} animate-spin-slow opacity-60`}>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <ellipse
                            key={i}
                            cx="50"
                            cy="50"
                            rx="10"
                            ry="30"
                            transform={`rotate(${angle}, 50, 50)`}
                            fill="currentColor"
                            opacity="0.5"
                        />
                    ))}
                    <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.8" />
                </svg>
                
                {/* A second, faster revolving layer */}
                <div className="absolute inset-2">
                    <svg viewBox="0 0 100 100" className={`w-full h-full ${theme.svgColor} animate-spin-reverse opacity-40`}>
                         {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                            <path
                                key={i}
                                d="M50 50 Q60 20 50 10 Q40 20 50 50"
                                transform={`rotate(${angle}, 50, 50)`}
                                fill="currentColor"
                            />
                        ))}
                    </svg>
                </div>

                {/* Subtle core glow */}
                <div className={`absolute inset-4 rounded-full ${theme.particle} blur-md opacity-30 animate-pulse-soft`} />
            </div>
        </div>
    );
};

export default ZenCursorFlower;
