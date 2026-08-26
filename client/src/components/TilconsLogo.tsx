import React from 'react';
import logoPath from "@assets/Top_Logo_Tilcons_SkyBlue.png";

export function TilconsLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <img src={logoPath} alt="Tilcons" className={`object-contain ${className}`} />
  );
}
