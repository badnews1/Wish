import React from 'react';

interface RoundedButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'tab' | 'full';
  disabled?: boolean;
}

export function RoundedButton({ label, isActive, onClick, variant = 'tab', disabled = false }: RoundedButtonProps) {
  const sizeClasses = variant === 'tab' 
    ? 'w-full h-11' 
    : 'w-full h-14';

  const viewBox = variant === 'tab' ? '0 0 118 44' : '0 0 331 52.0001';
  const pathD = variant === 'tab' 
    ? 'M0 13.5131C0 8.73679 3.71721 4.79611 8.48783 4.56298C20.5312 3.97444 42.902 3 59 3C75.098 3 97.4688 3.97444 109.512 4.56298C114.283 4.79611 118 8.73679 118 13.5131V30.4869C118 35.2632 114.283 39.2039 109.512 39.437C97.4688 40.0256 75.098 41 59 41C42.902 41 20.5312 40.0256 8.48783 39.437C3.71721 39.2039 0 35.2632 0 30.4869V13.5131Z'
    : 'M0 15.724C0 8.10067 6.07038 1.88084 13.6925 1.74209C43.5022 1.19944 115.638 -0.00983027 166 6.03052e-05C215.917 0.00986348 287.606 1.20648 317.308 1.74385C324.93 1.88176 331 8.10198 331 15.7262V36.2738C331 43.898 324.931 50.1183 317.308 50.2562C287.606 50.7936 215.917 51.9902 166 52C115.638 52.0099 43.5022 50.8006 13.6925 50.2579C6.07037 50.1192 0 43.8994 0 36.276V15.724Z';

  const fontSize = variant === 'tab' ? 'var(--text-sm)' : 'var(--text-lg)';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${sizeClasses} transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        <path
          d={pathD}
          className={`transition-colors ${isActive ? 'fill-accent' : 'fill-[var(--accent-muted)]'}`}
        />
      </svg>
      <div
        className={`relative flex items-center justify-center gap-2 h-full transition-colors ${
          isActive ? 'text-white' : 'text-accent'
        }`}
      >
        <span className={isActive ? 'font-semibold' : 'font-medium'} style={{ fontSize }}>{label}</span>
      </div>
    </button>
  );
}