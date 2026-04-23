/* Sketch primitives for wireframes — low-fi, hand-drawn feel, mobile frames */

const SketchFrame = ({ w = 360, h = 640, children, label, style = {} }) => (
  <div style={{
    width: w, height: h, background: '#fffdf7',
    border: '2.5px solid #1a1a1a', borderRadius: 32,
    position: 'relative', padding: 0, boxShadow: '6px 6px 0 #1a1a1a',
    fontFamily: 'var(--sketch-hand)', color: '#1a1a1a',
    overflow: 'hidden', ...style,
  }}>
    {/* phone notch */}
    <div style={{
      position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
      width: 90, height: 18, background: '#1a1a1a', borderRadius: 12, zIndex: 10,
    }} />
    <div style={{ paddingTop: 38, height: '100%', boxSizing: 'border-box', position: 'relative' }}>
      {children}
    </div>
    {label && (
      <div style={{
        position: 'absolute', top: -34, left: 10, fontFamily: 'var(--sketch-hand)',
        fontSize: 18, fontWeight: 700,
      }}>{label}</div>
    )}
  </div>
);

const SketchBox = ({ children, style = {}, dashed = false, fill, round = 14, thick = 2 }) => (
  <div style={{
    border: `${thick}px ${dashed ? 'dashed' : 'solid'} #1a1a1a`,
    borderRadius: round, padding: 10, background: fill || 'transparent',
    boxSizing: 'border-box', ...style,
  }}>{children}</div>
);

// "image/placeholder" with diagonal stripes
const SketchPic = ({ style = {}, label, round = 14 }) => (
  <div style={{
    border: '2px solid #1a1a1a', borderRadius: round,
    background: 'repeating-linear-gradient(135deg, #f4ecd8 0 8px, #fff8e1 8px 16px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#6b5e3c',
    textAlign: 'center', padding: 6, ...style,
  }}>{label}</div>
);

// scribble line (for text)
const Scribble = ({ width = '100%', style = {} }) => (
  <div style={{
    width, height: 4, background: '#1a1a1a',
    borderRadius: 2, margin: '6px 0', opacity: 0.75, ...style,
  }} />
);
const ScribbleLines = ({ lines = 3, widths = ['100%','85%','60%'] }) => (
  <div>{Array.from({length: lines}).map((_,i) => <Scribble key={i} width={widths[i] || '80%'} />)}</div>
);

// sketchy tag/chip
const SketchChip = ({ children, fill = '#fff', style = {} }) => (
  <span style={{
    display: 'inline-block', border: '2px solid #1a1a1a', borderRadius: 999,
    padding: '3px 10px', fontSize: 11, background: fill, fontWeight: 600,
    marginRight: 4, marginBottom: 4, ...style,
  }}>{children}</span>
);

// sketchy button
const SketchBtn = ({ children, fill = '#fff', big = false, style = {} }) => (
  <div style={{
    border: '2.5px solid #1a1a1a', borderRadius: 999,
    padding: big ? '14px 22px' : '8px 14px',
    background: fill, fontWeight: 700, textAlign: 'center',
    fontSize: big ? 16 : 13, boxShadow: '3px 3px 0 #1a1a1a',
    display: 'inline-block', ...style,
  }}>{children}</div>
);

// bottom nav for mobile
const SketchBottomNav = ({ items = ['🏠','📔','🐱','🎁','⭐'], active = 0 }) => (
  <div style={{
    position: 'absolute', bottom: 8, left: 8, right: 8,
    border: '2.5px solid #1a1a1a', borderRadius: 24, background: '#fff',
    display: 'flex', justifyContent: 'space-around', padding: '8px 4px',
    boxShadow: '3px 3px 0 #1a1a1a',
  }}>
    {items.map((it, i) => (
      <div key={i} style={{
        width: 40, height: 40, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: i === active ? '#ffe8a3' : 'transparent',
        border: i === active ? '2px solid #1a1a1a' : '2px solid transparent',
        fontSize: 18,
      }}>{it}</div>
    ))}
  </div>
);

// The mascot cat "Mila" — drawn as simple sketch shapes, no complex SVG.
// Round head + ears + whiskers + stars — kept minimal.
const MilaCat = ({ size = 60, style = {} }) => (
  <div style={{
    width: size, height: size, position: 'relative', display: 'inline-block',
    ...style,
  }}>
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ overflow: 'visible' }}>
      {/* ears */}
      <polygon points="14,14 20,4 24,16" fill="#fff" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <polygon points="46,14 40,4 36,16" fill="#fff" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      {/* head */}
      <circle cx="30" cy="30" r="18" fill="#fff" stroke="#1a1a1a" strokeWidth="2"/>
      {/* eyes (closed/content) */}
      <path d="M22 28 q3 -3 6 0" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 28 q3 -3 6 0" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
      {/* nose + mouth */}
      <path d="M30 32 l-1.5 2 h3 z" fill="#1a1a1a"/>
      <path d="M30 34 q-2 3 -4 2 M30 34 q2 3 4 2" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      {/* whiskers */}
      <path d="M16 32 h-6 M16 35 h-6 M44 32 h6 M44 35 h6" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      {/* star on forehead */}
      <text x="30" y="20" fontSize="9" textAnchor="middle">✦</text>
      {/* sparkles around */}
      <text x="6" y="8" fontSize="8">✦</text>
      <text x="52" y="10" fontSize="6">✧</text>
      <text x="4" y="50" fontSize="6">✧</text>
    </svg>
  </div>
);

// Cloud/tuchka for mood
const Cloud = ({ size = 50, mood = '😊', style = {} }) => (
  <div style={{
    width: size, height: size * 0.7, position: 'relative', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', ...style,
  }}>
    <svg viewBox="0 0 50 35" width={size} height={size * 0.7} style={{ position: 'absolute', inset: 0 }}>
      <path d="M8 28 Q2 28 2 22 Q2 16 8 16 Q8 8 16 8 Q20 2 28 6 Q36 4 40 12 Q48 12 48 20 Q48 28 42 28 Z"
        fill="#fff" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
    <span style={{ position: 'relative', fontSize: size * 0.3 }}>{mood}</span>
  </div>
);

// Mini parcel/gift box for "посылки спокойствия"
const Parcel = ({ size = 60, label, style = {} }) => (
  <div style={{
    width: size, height: size, position: 'relative', ...style,
  }}>
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <rect x="6" y="18" width="48" height="36" fill="#fff" stroke="#1a1a1a" strokeWidth="2" rx="4"/>
      <rect x="6" y="14" width="48" height="10" fill="#fff" stroke="#1a1a1a" strokeWidth="2" rx="2"/>
      <rect x="26" y="14" width="8" height="40" fill="#ffe8a3" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M30 14 q-8 -8 -12 0 q6 0 12 0 z M30 14 q8 -8 12 0 q-6 0 -12 0 z" fill="#ffd166" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
    {label && <div style={{ position: 'absolute', bottom: -18, width: '100%', textAlign: 'center', fontSize: 11, fontWeight: 600 }}>{label}</div>}
  </div>
);

// Star sticker
const Star = ({ size = 24, fill = '#ffd166', style = {} }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={style}>
    <path d="M12 2 l3 7 7 1 -5 5 1.5 7 -6.5 -4 -6.5 4 1.5 -7 -5 -5 7 -1 z"
      fill={fill} stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Caption/annotation (designer note)
const Note = ({ children, style = {}, arrow = 'none' }) => (
  <div style={{
    fontFamily: 'var(--sketch-hand)', fontSize: 12, color: '#5a4a2a',
    background: '#fff9d9', border: '2px dashed #b7a04f', borderRadius: 8,
    padding: '6px 10px', display: 'inline-block', lineHeight: 1.3,
    ...style,
  }}>
    {arrow === 'left' && <span style={{ marginRight: 6 }}>←</span>}
    {children}
    {arrow === 'right' && <span style={{ marginLeft: 6 }}>→</span>}
    {arrow === 'down' && <span style={{ marginLeft: 6 }}>↓</span>}
  </div>
);

Object.assign(window, {
  SketchFrame, SketchBox, SketchPic, Scribble, ScribbleLines,
  SketchChip, SketchBtn, SketchBottomNav, MilaCat, Cloud, Parcel, Star, Note,
});
