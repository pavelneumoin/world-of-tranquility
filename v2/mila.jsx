/* Mila — the magical cat mascot. Friendly, starry, watercolor feel. */
const Mila = ({ size = 100, mood = 'happy', sparkle = true }) => {
  const eyeY = mood === 'sleep' ? 58 : 54;
  const eyeShape = mood === 'sleep'
    ? <>
        <path d="M38 58 q5 -4 10 0" fill="none" stroke="#2a1f4a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M62 58 q5 -4 10 0" fill="none" stroke="#2a1f4a" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    : mood === 'happy'
    ? <>
        <path d="M38 54 q5 -5 10 0" fill="none" stroke="#2a1f4a" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M62 54 q5 -5 10 0" fill="none" stroke="#2a1f4a" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    : <>
        <ellipse cx="43" cy="56" rx="3.5" ry="4.5" fill="#2a1f4a"/>
        <ellipse cx="67" cy="56" rx="3.5" ry="4.5" fill="#2a1f4a"/>
        <circle cx="44.2" cy="54.5" r="1.2" fill="#fff"/>
        <circle cx="68.2" cy="54.5" r="1.2" fill="#fff"/>
      </>;
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'inline-block' }}>
      <svg viewBox="0 0 110 110" width={size} height={size} style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 12px rgba(138,98,208,0.25))' }}>
        <defs>
          <radialGradient id="mila-body" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#fff"/>
            <stop offset="60%" stopColor="#f4ecff"/>
            <stop offset="100%" stopColor="#d9c6f5"/>
          </radialGradient>
          <radialGradient id="mila-cheek" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffb8d4" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffb8d4" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* ears */}
        <path d="M25 35 L20 10 L40 25 Z" fill="url(#mila-body)" stroke="#6a4fb8" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M85 35 L90 10 L70 25 Z" fill="url(#mila-body)" stroke="#6a4fb8" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M27 28 L23 15 L35 23 Z" fill="#ffd4e8"/>
        <path d="M83 28 L87 15 L75 23 Z" fill="#ffd4e8"/>
        {/* head */}
        <circle cx="55" cy="58" r="32" fill="url(#mila-body)" stroke="#6a4fb8" strokeWidth="2"/>
        {/* cheeks */}
        <circle cx="35" cy="66" r="7" fill="url(#mila-cheek)"/>
        <circle cx="75" cy="66" r="7" fill="url(#mila-cheek)"/>
        {/* star on forehead */}
        <g transform="translate(55 38)">
          <path d="M0 -7 L2 -2 L7 -2 L3 1 L5 6 L0 3 L-5 6 L-3 1 L-7 -2 L-2 -2 Z" fill="#ffd166" stroke="#6a4fb8" strokeWidth="1.5" strokeLinejoin="round"/>
        </g>
        {eyeShape}
        {/* nose */}
        <path d="M55 64 l-2.5 3 h5 z" fill="#e85a8f"/>
        {/* mouth */}
        <path d="M55 67 q-3 4 -6 3 M55 67 q3 4 6 3" fill="none" stroke="#2a1f4a" strokeWidth="2" strokeLinecap="round"/>
        {/* whiskers */}
        <path d="M28 64 L15 62 M28 68 L15 69 M82 64 L95 62 M82 68 L95 69" stroke="#6a4fb8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        {sparkle && <>
          <text x="8" y="16" fontSize="12" fill="#ffd166">✦</text>
          <text x="95" y="20" fontSize="10" fill="#b8a4e8">✧</text>
          <text x="100" y="85" fontSize="10" fill="#ffd166">✦</text>
          <text x="2" y="90" fontSize="8" fill="#b8a4e8">✧</text>
        </>}
      </svg>
    </div>
  );
};

window.Mila = Mila;
