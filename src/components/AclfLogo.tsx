import React from 'react';

interface AclfLogoProps {
  className?: string;
  size?: number;
}

export const AclfLogo: React.FC<AclfLogoProps> = ({ className = 'w-10 h-10', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="Logo ACLF"
    >
      {/* Top Left - Dark Green Sloped Bar */}
      <polygon
        points="16,56 51,11 51,28 16,67"
        fill="#395829"
      />

      {/* Bottom Left - Light Olive Green Sloped Bar */}
      <polygon
        points="16,78 51,62 51,72 16,82"
        fill="#87AA43"
      />

      {/* Top Right - Dark Green Roof Block */}
      <polygon
        points="52,28 81,55 81,74 52,53"
        fill="#395829"
      />

      {/* Bottom Right - Dark Green Base Block */}
      <polygon
        points="52,72 81,80 81,89 52,89"
        fill="#2A4420"
      />
    </svg>
  );
};
