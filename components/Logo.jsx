import React from 'react';

/**
 * Modern & Professional Logo Component for Orbit
 * 
 * Includes an inline SVG planetary orbit icon with Tech Blue to Vibrant Purple gradient
 * accompanied by clean all-caps "ORBIT" text.
 */
export default function Logo({ size = 'md', showText = true, className = '' }) {
  // Preset sizes for flexibility across Navbar, Footer, and Landing pages
  const sizeMap = {
    sm: { icon: 28, text: 'text-xl tracking-wider', gap: 'gap-2' },
    md: { icon: 36, text: 'text-2xl tracking-widest', gap: 'gap-3' },
    lg: { icon: 48, text: 'text-3xl tracking-widest', gap: 'gap-3.5' },
    xl: { icon: 60, text: 'text-4xl tracking-widest', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none group cursor-pointer ${className}`}>
      {/* Inline SVG Planetary Orbit Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 ease-out group-hover:scale-105"
        >
          <defs>
            {/* Tech Blue to Vibrant Purple Gradient */}
            <linearGradient id="techBlueToVibrantPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />   {/* Tech Blue */}
              <stop offset="50%" stopColor="#4F46E5" />  {/* Tech Indigo */}
              <stop offset="100%" stopColor="#7C3AED" /> {/* Vibrant Purple */}
            </linearGradient>

            {/* Orbit Ring Gradient */}
            <linearGradient id="orbitRingGradSpec" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
            </linearGradient>

            {/* Core Glow Filter */}
            <filter id="orbitCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle Ambient Halo */}
          <circle cx="50" cy="50" r="26" fill="url(#techBlueToVibrantPurple)" opacity="0.12" />

          {/* Outer Orbit Ellipse (Angled Planetary Ring) */}
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="15"
            stroke="url(#orbitRingGradSpec)"
            strokeWidth="3.8"
            strokeLinecap="round"
            transform="rotate(-30 50 50)"
            className="transition-all duration-300 group-hover:opacity-90"
          />

          {/* Dashed Secondary Orbital Track */}
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="15"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeDasharray="6 12"
            strokeLinecap="round"
            transform="rotate(-30 50 50)"
            opacity="0.5"
          />

          {/* Central Planet Sphere */}
          <circle
            cx="50"
            cy="50"
            r="17"
            fill="url(#techBlueToVibrantPurple)"
            filter="url(#orbitCoreGlow)"
          />

          {/* Planet Surface Glint / Highlight */}
          <circle
            cx="43"
            cy="43"
            r="5"
            fill="#FFFFFF"
            opacity="0.35"
          />

          {/* Orbiting Satellite Node */}
          <circle
            cx="81"
            cy="35"
            r="4.5"
            fill="#EC4899"
            className="animate-pulse"
          />
          <circle
            cx="81"
            cy="35"
            r="2"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Brand Text: ORBIT (All-Caps) */}
      {showText && (
        <span
          className={`font-black uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent ${currentSize.text}`}
        >
          ORBIT
        </span>
      )}
    </div>
  );
}
