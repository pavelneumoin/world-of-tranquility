/* Enhancements: voice input, TTS, before/after scale, pets, accessibility */

// Speech-to-text helper
const useSpeech = () => {
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const recRef = React.useRef(null);
  React.useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = 'ru-RU'; r.continuous = false; r.interimResults = false;
    r.onresult = (e) => setTranscript(e.results[0][0].transcript);
    r.onend = () => setListening(false);
    recRef.current = r;
  }, []);
  const start = () => { if (recRef.current) { setTranscript(''); recRef.current.start(); setListening(true); } };
  return { listening, transcript, start, supported: !!recRef.current };
};

const VoiceButton = ({ onText, size = 48 }) => {
  const { listening, transcript, start, supported } = useSpeech();
  React.useEffect(() => { if (transcript) onText(transcript); }, [transcript]);
  if (!supported) return null;
  return (
    <button onClick={start} disabled={listening} title="голосом" style={{
      background: listening ? '#ff6b8a' : '#ffd166',
      border: 'none', borderRadius: '50%', width: size, height: size,
      fontSize: size * 0.45, cursor: 'pointer', fontFamily: 'inherit',
      boxShadow: listening ? '0 0 0 6px rgba(255,107,138,0.3)' : '0 3px 0 #b88a2e',
      animation: listening ? 'pulse 1s infinite' : 'none',
    }}>🎤</button>
  );
};

// Text-to-speech for Mila
const speakMila = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[✦✧♡]/g,''));
  u.lang = 'ru-RU'; u.rate = 0.95; u.pitch = 1.3; u.volume = 0.9;
  const voices = speechSynthesis.getVoices();
  const ru = voices.find(v => v.lang.startsWith('ru'));
  if (ru) u.voice = ru;
  window.speechSynthesis.speak(u);
};

const SpeakBtn = ({ text }) => (
  <button onClick={() => speakMila(text)} title="послушать" style={{
    background: 'rgba(255,255,255,0.8)', border: '2px solid rgba(106,79,184,0.2)',
    borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
    fontSize: 14, fontFamily: 'inherit', padding: 0,
  }}>🔊</button>
);

// Before/After mood scale
const MoodScale = ({ value, onChange, label }) => {
  const faces = ['😢','😕','😐','🙂','😊'];
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: 14,
      border: '2px solid rgba(106,79,184,0.15)',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#2a1f4a', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
        {faces.map((f, i) => (
          <button key={i} onClick={() => onChange(i)} style={{
            background: value === i ? '#ffd166' : 'rgba(106,79,184,0.05)',
            border: `2px solid ${value === i ? '#b88a2e' : 'rgba(106,79,184,0.15)'}`,
            borderRadius: 14, padding: '8px 4px', flex: 1, cursor: 'pointer',
            fontSize: 26, fontFamily: 'inherit',
            transform: value === i ? 'translateY(-2px)' : 'none',
            transition: 'all 0.15s',
            boxShadow: value === i ? '0 3px 0 #b88a2e' : 'none',
          }}>{f}</button>
        ))}
      </div>
    </div>
  );
};

// Before/after banner — shows improvement
const ImprovementBanner = ({ before, after }) => {
  if (before == null || after == null) return null;
  const diff = after - before;
  if (diff <= 0) return (
    <div style={{
      padding: 14, background: 'linear-gradient(135deg,#c5e1f5,#e0f0ff)',
      borderRadius: 20, textAlign: 'center',
      border: '2px solid rgba(106,79,184,0.2)',
    }}>
      <div style={{ fontSize: 30 }}>💜</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>
        Ничего, иногда нужно больше времени
      </div>
      <div style={{ fontSize: 12, color: '#6a4fb8' }}>попробуй ещё одно упражнение</div>
    </div>
  );
  return (
    <div style={{
      padding: 14, background: 'linear-gradient(135deg,#d4f5d4,#eafbe4)',
      borderRadius: 20, textAlign: 'center',
      border: '2px solid rgba(106,79,184,0.2)',
    }}>
      <div style={{ fontSize: 30 }}>✨</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>
        Стало лучше на {diff} {diff === 1 ? 'шажок' : 'шажка'}!
      </div>
      <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 2 }}>
        ты молодец — упражнение помогло
      </div>
    </div>
  );
};

// Accessibility toggle widget
const A11yPanel = ({ settings, setSettings }) => (
  <div style={{
    position: 'fixed', top: 10, right: 10, zIndex: 200,
    display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    <button onClick={() => setSettings({...settings, bigText: !settings.bigText})}
      title="крупный текст" style={a11yBtn(settings.bigText)}>A+</button>
    <button onClick={() => setSettings({...settings, highContrast: !settings.highContrast})}
      title="контраст" style={a11yBtn(settings.highContrast)}>◐</button>
    <button onClick={() => setSettings({...settings, dyslexia: !settings.dyslexia})}
      title="для дислексии" style={a11yBtn(settings.dyslexia)}>Dx</button>
  </div>
);
const a11yBtn = (on) => ({
  background: on ? '#ffd166' : 'rgba(255,255,255,0.85)',
  border: '2px solid rgba(106,79,184,0.3)', borderRadius: '50%',
  width: 32, height: 32, cursor: 'pointer',
  fontSize: 11, fontWeight: 800, fontFamily: 'inherit',
  color: '#2a1f4a',
});

// Pet collection
const PETS = [
  { id: 1, e: '🦊', name: 'Лисёнок Тим', unlockAt: 0 },
  { id: 2, e: '🦉', name: 'Совушка Уна', unlockAt: 3 },
  { id: 3, e: '🦔', name: 'Ёжик Пых', unlockAt: 6 },
  { id: 4, e: '🐰', name: 'Зайка Луна', unlockAt: 10 },
  { id: 5, e: '🐢', name: 'Черепашка Тоша', unlockAt: 15 },
  { id: 6, e: '🦄', name: 'Единорог Звёздочка', unlockAt: 25 },
];

Object.assign(window, {
  useSpeech, VoiceButton, speakMila, SpeakBtn,
  MoodScale, ImprovementBanner, A11yPanel, PETS,
});
