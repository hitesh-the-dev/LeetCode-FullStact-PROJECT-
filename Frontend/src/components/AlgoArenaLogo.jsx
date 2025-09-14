import React from 'react';
import { NavLink } from 'react-router';

const AlgoArenaLogo = ({ className = "", showText = true, size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8", 
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-lg",
    large: "text-2xl"
  };

  return (
    <NavLink to="/" className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Incomplete Circle with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          
          {/* Incomplete Circle */}
          <path
            d="M 20 50 A 30 30 0 1 1 80 50"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Letter A */}
          <path
            d="M 35 70 L 45 50 L 55 50 L 65 70 M 40 60 L 60 60"
            stroke="url(#logoGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Letter E (three horizontal lines) */}
          <path
            d="M 70 50 L 85 50 M 70 60 L 85 60 M 70 70 L 85 70"
            stroke="url(#logoGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-white ${textSizeClasses[size]}`}>
          AlgoArena
        </span>
      )}
    </NavLink>
  );
};

export default AlgoArenaLogo;
