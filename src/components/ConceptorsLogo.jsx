import React from 'react';

export default function ConceptorsLogo({ className = "h-10", variant = "full", light = false }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/conceptors-logo.png"
        alt="The Conceptors for Animal Health"
        className={`h-full w-auto object-contain max-h-12 transition-all ${
          light ? 'brightness-0 invert drop-shadow-sm' : ''
        }`}
        draggable={false}
      />
    </div>
  );
}
