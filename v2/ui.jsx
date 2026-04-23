/* Shared UI for the kid's app */

const Scene = ({ children, variant = 'dawn', style = {} }) => {
  const bgs = {
    dawn: 'linear-gradient(180deg, #ffe4f1 0%, #e0d4ff 50%, #c5e1f5 100%)',
    day:  'linear-gradient(180deg, #c5e1f5 0%, #e8f4ff 60%, #fff4e6 100%)',
    dusk: 'linear-gradient(180deg, #8b6fd4 0%, #c89ce0 40%, #ffd4a8 100%)',
    night:'linear-gradient(180deg, #2a1f4a 0%, #5a4a8a 50%, #8b6fd4 100%)',
    forest:'linear-gradient(180deg, #c4e8c8 0%, #e8f4d4 50%, #fff4e6 100%)',
    calm: 'linear-gradient(180deg, #f4ecff 0%, #ffe4f1 100%)',
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bgs[variant],
      overflow: 'hidden', ...style,
    }}>
      {/* floating stars decoration */}
      <StarsBg variant={variant}/>
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>{children}</div>
    </div>
  );
};

const StarsBg = ({ variant }) => {
  const dark = variant === 'night' || variant === 'dusk';
  const stars = [
    { left: '10%', top: '8%', size: 12, d: 0 },
    { left: '82%', top: '12%', size: 8, d: 1 },
    { left: '25%', top: '18%', size: 6, d: 2 },
    { left: '70%', top: '28%', size: 10, d: 0.5 },
    { left: '5%', top: '35%', size: 8, d: 1.5 },
    { left: '90%', top: '45%', size: 6, d: 2.5 },
    { left: '15%', top: '60%', size: 10, d: 1 },
    { left: '85%', top: '75%', size: 8, d: 2 },
    { left: '40%', top: '85%', size: 6, d: 0.8 },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top,
          fontSize: s.size, color: dark ? '#ffd166' : '#8b6fd4',
          opacity: dark ? 0.9 : 0.4,
          animation: `twinkle 3s ease-in-out ${s.d}s infinite`,
        }}>✦</div>
      ))}
      {/* soft clouds for day */}
      {!dark && <>
        <div style={{ position: 'absolute', left: '-5%', top: '15%', width: 120, height: 40, borderRadius: 40, background: 'rgba(255,255,255,0.5)', filter: 'blur(4px)' }}/>
        <div style={{ position: 'absolute', right: '-8%', top: '45%', width: 140, height: 46, borderRadius: 46, background: 'rgba(255,255,255,0.4)', filter: 'blur(6px)' }}/>
      </>}
    </>
  );
};

const Card = ({ children, style = {}, color = '#fff', onClick, pressable = true }) => (
  <div
    onClick={onClick}
    style={{
      background: color, borderRadius: 24,
      boxShadow: '0 4px 0 rgba(106,79,184,0.15), 0 10px 30px rgba(106,79,184,0.12)',
      border: '2px solid rgba(106,79,184,0.15)',
      padding: 18, cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s ease',
      ...style,
    }}
    onMouseDown={pressable && onClick ? e => e.currentTarget.style.transform = 'translateY(2px) scale(0.98)' : undefined}
    onMouseUp={pressable && onClick ? e => e.currentTarget.style.transform = '' : undefined}
    onMouseLeave={pressable && onClick ? e => e.currentTarget.style.transform = '' : undefined}
    onTouchStart={pressable && onClick ? e => e.currentTarget.style.transform = 'translateY(2px) scale(0.98)' : undefined}
    onTouchEnd={pressable && onClick ? e => e.currentTarget.style.transform = '' : undefined}
  >
    {children}
  </div>
);

const BigButton = ({ children, onClick, color = '#ffd166', textColor = '#2a1f4a', icon, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      background: color, color: textColor,
      border: 'none', borderRadius: 24,
      padding: '18px 20px', width: '100%',
      fontSize: 18, fontWeight: 800,
      fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      boxShadow: '0 4px 0 rgba(106,79,184,0.3), 0 8px 20px rgba(106,79,184,0.15)',
      cursor: 'pointer',
      transition: 'transform 0.1s, box-shadow 0.1s',
      ...style,
    }}
    onMouseDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(106,79,184,0.3)'; }}
    onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 0 rgba(106,79,184,0.3), 0 8px 20px rgba(106,79,184,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 0 rgba(106,79,184,0.3), 0 8px 20px rgba(106,79,184,0.15)'; }}
  >
    {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
    {children}
  </button>
);

const Chip = ({ children, onClick, active = false, color = '#fff' }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? '#ffd166' : color,
      border: `2px solid ${active ? '#b88a2e' : 'rgba(106,79,184,0.2)'}`,
      borderRadius: 999, padding: '8px 14px',
      fontSize: 14, fontWeight: 700, color: '#2a1f4a',
      fontFamily: 'inherit', cursor: 'pointer',
      transition: 'all 0.15s',
      boxShadow: active ? '0 2px 0 #b88a2e' : '0 2px 0 rgba(106,79,184,0.1)',
    }}
  >{children}</button>
);

const BottomNav = ({ current, onNav }) => {
  const items = [
    { id: 'home', icon: '🏡', label: 'Дом' },
    { id: 'journal', icon: '📖', label: 'Журнал' },
    { id: 'mila', icon: '🐱', label: 'Мила' },
    { id: 'parcels', icon: '💌', label: 'Посылки' },
    { id: 'map', icon: '🗺️', label: 'Карта' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 10, left: 10, right: 10,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 28,
      border: '2px solid rgba(106,79,184,0.15)',
      boxShadow: '0 8px 24px rgba(106,79,184,0.18)',
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 6px',
      zIndex: 50,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => onNav(it.id)}
          style={{
            background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 2, padding: '4px 8px', cursor: 'pointer',
            fontFamily: 'inherit',
            color: current === it.id ? '#8b6fd4' : '#8a7ba8',
            transform: current === it.id ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s',
          }}>
          <div style={{
            fontSize: 24,
            filter: current === it.id ? 'none' : 'grayscale(0.3)',
          }}>{it.icon}</div>
          <div style={{ fontSize: 10, fontWeight: 700 }}>{it.label}</div>
        </button>
      ))}
    </div>
  );
};

const TopBar = ({ title, left, right, subtitle }) => (
  <div style={{
    padding: '8px 20px 4px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 8,
  }}>
    <div style={{ minWidth: 40 }}>{left}</div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#2a1f4a' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#6a4fb8', fontWeight: 600 }}>{subtitle}</div>}
    </div>
    <div style={{ minWidth: 40, textAlign: 'right' }}>{right}</div>
  </div>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(106,79,184,0.2)',
    borderRadius: '50%', width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 18, color: '#2a1f4a',
    fontFamily: 'inherit',
  }}>←</button>
);

const SpeechBubble = ({ children, from = 'mila', color }) => (
  <div style={{
    background: color || (from === 'mila' ? '#fff' : '#ffd166'),
    border: '2px solid rgba(106,79,184,0.2)',
    borderRadius: from === 'mila' ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
    padding: '12px 16px',
    maxWidth: '82%',
    alignSelf: from === 'mila' ? 'flex-start' : 'flex-end',
    color: '#2a1f4a', fontSize: 15, lineHeight: 1.45,
    boxShadow: '0 2px 8px rgba(106,79,184,0.12)',
    fontWeight: 500,
  }}>{children}</div>
);

window.Scene = Scene;
window.Card = Card;
window.BigButton = BigButton;
window.Chip = Chip;
window.BottomNav = BottomNav;
window.TopBar = TopBar;
window.BackBtn = BackBtn;
window.SpeechBubble = SpeechBubble;
