import React from 'react';

interface HelloKittyProps {
  className?: string;
  size?: number;
  showBow?: boolean;
  bowColor?: string;
  expression?: 'happy' | 'wink' | 'love' | 'blush';
}

export const HelloKittyFace: React.FC<HelloKittyProps> = ({
  className = '',
  size = 64,
  bowColor = '#f43f5e',
  expression = 'happy',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none drop-shadow-sm ${className}`}
    >
      {/* Hello Kitty head */}
      <ellipse
        cx="50"
        cy="50"
        rx="40"
        ry="32"
        fill="#FFFFFF"
        stroke="#1e293b"
        strokeWidth="3.5"
      />

      {/* Left Ear */}
      <path
        d="M 18 36 Q 16 12 33 24"
        fill="#FFFFFF"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right Ear */}
      <path
        d="M 82 36 Q 84 12 67 24"
        fill="#FFFFFF"
        stroke="#1e293b"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cute Whiskers Left */}
      <line x1="14" y1="46" x2="28" y2="48" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="12" y1="53" x2="28" y2="53" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="14" y1="60" x2="28" y2="57" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />

      {/* Cute Whiskers Right */}
      <line x1="86" y1="46" x2="72" y2="48" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="88" y1="53" x2="72" y2="53" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="86" y1="60" x2="72" y2="57" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />

      {/* Eyes */}
      {expression === 'wink' ? (
        <>
          <ellipse cx="34" cy="52" rx="4.2" ry="5.8" fill="#1e293b" />
          <path d="M 60 52 Q 66 48 72 52" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : expression === 'love' ? (
        <>
          <path
            d="M 34 50 C 31 46 26 47 26 51 C 26 55 34 60 34 60 C 34 60 42 55 42 51 C 42 47 37 46 34 50 Z"
            fill="#e11d48"
          />
          <path
            d="M 66 50 C 63 46 58 47 58 51 C 58 55 66 60 66 60 C 66 60 74 55 74 51 C 74 47 69 46 66 50 Z"
            fill="#e11d48"
          />
        </>
      ) : (
        <>
          <ellipse cx="34" cy="52" rx="4.2" ry="5.8" fill="#1e293b" />
          <ellipse cx="66" cy="52" rx="4.2" ry="5.8" fill="#1e293b" />
        </>
      )}

      {/* Yellow Nose */}
      <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#facc15" stroke="#1e293b" strokeWidth="2" />

      {/* Sweet Cheeks/Blush */}
      {(expression === 'blush' || expression === 'love') && (
        <>
          <ellipse cx="26" cy="57" rx="5" ry="3" fill="#fbcfe8" opacity="0.85" />
          <ellipse cx="74" cy="57" rx="5" ry="3" fill="#fbcfe8" opacity="0.85" />
        </>
      )}

      {/* Signature Red/Pink Bow on Left Ear */}
      <g id="kitty-bow">
        {/* Left loop of bow */}
        <ellipse
          cx="22"
          cy="22"
          rx="9"
          ry="7"
          transform="rotate(-20 22 22)"
          fill={bowColor}
          stroke="#1e293b"
          strokeWidth="3"
        />
        {/* Right loop of bow */}
        <ellipse
          cx="38"
          cy="26"
          rx="9"
          ry="7"
          transform="rotate(25 38 26)"
          fill={bowColor}
          stroke="#1e293b"
          strokeWidth="3"
        />
        {/* Center knot */}
        <circle
          cx="30"
          cy="24"
          r="5.5"
          fill={bowColor}
          stroke="#1e293b"
          strokeWidth="3"
        />
        <circle cx="28" cy="22" r="1.5" fill="#FFFFFF" opacity="0.6" />
      </g>
    </svg>
  );
};

export const HelloKittyBow: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 32,
  className = '',
  color = '#fb7185',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-sm ${className}`}
    >
      <ellipse
        cx="14"
        cy="18"
        rx="12"
        ry="9"
        transform="rotate(-15 14 18)"
        fill={color}
        stroke="#1e293b"
        strokeWidth="2.5"
      />
      <ellipse
        cx="34"
        cy="18"
        rx="12"
        ry="9"
        transform="rotate(15 34 18)"
        fill={color}
        stroke="#1e293b"
        strokeWidth="2.5"
      />
      <circle
        cx="24"
        cy="18"
        r="7"
        fill={color}
        stroke="#1e293b"
        strokeWidth="2.5"
      />
      <circle cx="22" cy="16" r="2" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
};
