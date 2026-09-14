import React from 'react';

/**
 * Orbit Verified Badge Component
 * Renders a sleek blue-purple gradient badge with a white checkmark
 */
export default function VerifiedBadge({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle ${className}`}
      title="حساب موثق في Orbit"
    >
      <defs>
        <linearGradient id="verifiedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      
      {/* Starburst Verified Seal Path */}
      <path
        d="M22.5 12.5C22.5 11.22 21.6 10.15 20.45 9.77C20.8 8.54 20.35 7.15 19.34 6.16C18.35 5.15 16.96 4.7 15.73 5.05C15.35 3.9 14.28 3 13 3C11.72 3 10.65 3.9 10.27 5.05C9.04 4.7 7.65 5.15 6.66 6.16C5.65 7.15 5.2 8.54 5.55 9.77C4.4 10.15 3.5 11.22 3.5 12.5C3.5 13.78 4.4 14.85 5.55 15.23C5.2 16.46 5.65 17.85 6.66 18.84C7.65 19.85 9.04 20.3 10.27 19.95C10.65 21.1 11.72 22 13 22C14.28 22 15.35 21.1 15.73 19.95C16.96 20.3 18.35 19.85 19.34 18.84C20.35 17.85 20.8 16.46 20.45 15.23C21.6 14.85 22.5 13.78 22.5 12.5Z"
        fill="url(#verifiedGradient)"
      />
      
      {/* White Checkmark */}
      <path
        d="M9.5 12L11.5 14L16 9.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
