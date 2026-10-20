import React from 'react';

export default function ConceptorsLogo({ className = "h-10", variant = "full", light = false }) {
  const brandGreen = light ? "#FFFFFF" : "#0B431E";
  const brandTextDark = light ? "#FFFFFF" : "#0F172A";
  const brandSubtext = light ? "#E2E8F0" : "#0B431E";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Authentic "C" Swirl Brand Icon */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto aspect-square flex-shrink-0"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78 22 C65 10 40 10 26 25 C10 42 10 68 28 82 C44 94 72 90 84 74 C90 66 90 56 84 50 C78 44 68 46 64 52 C58 62 44 66 36 58 C26 48 28 34 38 26 C46 20 60 20 68 28 C72 32 80 30 82 26 C84 24 82 23 78 22 Z"
          fill={light ? "#34D399" : "#0B431E"}
        />
        <circle cx="50" cy="50" r="14" fill={light ? "#FCD34D" : "#96916E"} />
      </svg>

      {/* Typography Wordmark */}
      {variant === "full" && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center tracking-tight">
            <span 
              className="text-base sm:text-lg font-black tracking-wider uppercase font-sans"
              style={{ color: brandTextDark }}
            >
              THE CON<span style={{ color: light ? "#34D399" : "#0B431E" }}>C</span>EPTORS
            </span>
          </div>
          <span 
            className="text-[11px] sm:text-xs font-bold tracking-tight -mt-0.5"
            style={{ color: brandSubtext }}
          >
            for Animal Health
          </span>
        </div>
      )}
    </div>
  );
}
