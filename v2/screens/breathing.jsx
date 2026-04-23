/* Breathing — animated cloud, 4-4-4-4 */

const BreathingScreen = ({ onNav, addStar }) => {
  const [phase, setPhase] = React.useState('before'); // before, ready, in, hold1, out, hold2, after
  const [cycle, setCycle] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [before, setBefore] = React.useState(null);
  const [after, setAfter] = React.useState(null);
  const totalCycles = 4;

  React.useEffect(() => {
    if (phase === 'ready' || cycle >= totalCycles) return;
    const phases = { in: 'hold1', hold1: 'out', out: 'hold2', hold2: 'in' };
    const timer = setTimeout(() => {
      setPhase(p => {
        if (p === 'hold2') {
          setCycle(c => {
            if (c + 1 >= totalCycles) {
              addStar();
              return c + 1;
            }
            return c + 1;
          });
        }
        return phases[p];
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [phase, cycle]);

  React.useEffect(() => {
    if (phase === 'ready') return;
    setElapsed(0);
    const interval = setInterval(() => setElapsed(e => e + 0.05), 50);
    return () => clearInterval(interval);
  }, [phase]);

  const cloudScale = phase === 'in' ? 1.3 : phase === 'out' ? 0.7 : phase === 'hold1' ? 1.3 : 0.7;
  const label = { ready: 'Готов?', in: 'вдыхай...', hold1: 'держи', out: 'выдыхай...', hold2: 'держи' }[phase];

  const done = cycle >= totalCycles;

  if (phase === 'before') {
    return (
      <Scene variant="calm">
        <TopBar title="Перед упражнением" left={<BackBtn onClick={() => onNav('home')}/>}/>
        <div style={{ padding: 24, height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#2a1f4a', textAlign: 'center', marginBottom: 20 }}>
            Как ты сейчас?
          </div>
          <MoodScale value={before} onChange={setBefore} label="отметь своё настроение"/>
          <div style={{ marginTop: 20 }}>
            <BigButton onClick={() => { if (before != null) setPhase('ready'); }}
              color={before != null ? '#ffd166' : '#e8e4f0'}
              style={{ opacity: before != null ? 1 : 0.5 }}>начать →</BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  if (done && phase !== 'after') {
    return (
      <Scene variant="calm">
        <TopBar title="После упражнения"/>
        <div style={{ padding: 24, height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#2a1f4a', textAlign: 'center', marginBottom: 20 }}>
            А теперь как?
          </div>
          <MoodScale value={after} onChange={setAfter} label="изменилось что-то?"/>
          <div style={{ marginTop: 20 }}>
            <BigButton onClick={() => { if (after != null) setPhase('after'); }}
              color={after != null ? '#ffd166' : '#e8e4f0'}
              style={{ opacity: after != null ? 1 : 0.5 }}>готово ✨</BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  if (phase === 'after') {
    return (
      <Scene variant="calm">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
          <div style={{ fontSize: 100 }}>☁️</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2a1f4a', marginTop: 16 }}>Ты молодец ⭐</div>
          <div style={{ width: '100%', maxWidth: 320, marginTop: 16 }}>
            <ImprovementBanner before={before} after={after}/>
          </div>
          <div style={{ marginTop: 20, width: '100%', maxWidth: 320 }}>
            <BigButton onClick={() => onNav('parcels-send')} icon="💌">Отправить это другу</BigButton>
            <div style={{ height: 10 }}/>
            <BigButton color="#fff" onClick={() => onNav('home')}>Домой</BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  return (
    <Scene variant="day">
      <TopBar
        title="Дыхание облачка"
        subtitle={phase === 'ready' ? 'подыши со мной 4 круга' : `круг ${cycle + 1} из ${totalCycles}`}
        left={<BackBtn onClick={() => onNav('home')}/>}
      />

      <div style={{ padding: 20, height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: 260, height: 260,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* pulsing halo */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)',
            transform: `scale(${cloudScale})`,
            transition: 'transform 4s cubic-bezier(0.4, 0, 0.6, 1)',
          }}/>
          {/* cloud */}
          <div style={{
            position: 'relative',
            transform: `scale(${cloudScale})`,
            transition: 'transform 4s cubic-bezier(0.4, 0, 0.6, 1)',
            filter: 'drop-shadow(0 8px 20px rgba(139,111,212,0.3))',
          }}>
            <svg viewBox="0 0 200 140" width="200" height="140">
              <defs>
                <radialGradient id="cloud-grad" cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#fff"/>
                  <stop offset="100%" stopColor="#e4eeff"/>
                </radialGradient>
              </defs>
              <path d="M40 110 Q15 110 15 85 Q15 60 42 60 Q45 30 75 30 Q90 10 115 20 Q145 10 155 45 Q185 45 185 75 Q185 110 160 110 Z"
                fill="url(#cloud-grad)" stroke="#8b6fd4" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="75" cy="70" r="3" fill="#2a1f4a"/>
              <circle cx="115" cy="70" r="3" fill="#2a1f4a"/>
              <path d="M85 85 q10 8 20 0" fill="none" stroke="#2a1f4a" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="60" cy="82" r="5" fill="#ffb8d4" opacity="0.6"/>
              <circle cx="130" cy="82" r="5" fill="#ffb8d4" opacity="0.6"/>
            </svg>
          </div>
          <div style={{
            position: 'absolute',
            fontSize: 26, fontWeight: 800, color: '#2a1f4a',
            textShadow: '0 2px 10px rgba(255,255,255,0.8)',
            bottom: -36,
          }}>{label}</div>
        </div>

        {phase === 'ready' ? (
          <div style={{ marginTop: 80, width: '100%', maxWidth: 320 }}>
            <BigButton onClick={() => { setPhase('in'); setCycle(0); }} icon="✦">
              начать
            </BigButton>
          </div>
        ) : (
          <div style={{ marginTop: 70, display: 'flex', gap: 6 }}>
            {[...Array(totalCycles)].map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: i < cycle ? '#8b6fd4' : i === cycle ? '#ffd166' : 'rgba(139,111,212,0.2)',
                border: '2px solid #8b6fd4',
              }}/>
            ))}
          </div>
        )}
      </div>
    </Scene>
  );
};

window.BreathingScreen = BreathingScreen;
