/* Journal screen — mood weather, color, body map, message */

const JournalScreen = ({ onNav, addStar }) => {
  const [step, setStep] = React.useState(0);
  const [weather, setWeather] = React.useState(null);
  const [color, setColor] = React.useState(null);
  const [body, setBody] = React.useState([]);
  const [note, setNote] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const weathers = [
    ['☀️','солнечно','#ffd166'],
    ['⛅','немного туч','#c5e1f5'],
    ['☁️','пасмурно','#d4d4d4'],
    ['🌧','дождливо','#8bb8e8'],
    ['⛈','гроза','#8a7ba8'],
    ['🌈','радуга','#ffb8d4'],
  ];
  const colors = ['#ffd4d4','#ffd166','#d4f5d4','#c5e1f5','#e0d4ff','#ffd4e8','#6a4fb8','#2a1f4a'];
  const bodyParts = ['голова','грудь','живот','руки','ноги','везде','нигде'];

  if (submitted) {
    return (
      <Scene variant="calm">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
          <div style={{ animation: 'bob 2s ease-in-out infinite' }}><Mila size={160}/></div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2a1f4a', marginTop: 20 }}>Спасибо, что рассказал ♡</div>
          <div style={{ fontSize: 16, color: '#6a4fb8', marginTop: 8, lineHeight: 1.5 }}>
            Мне было важно узнать, что у тебя в сердце. Ты получил звёздочку ⭐
          </div>
          <div style={{ marginTop: 30, width: '100%' }}>
            <BigButton onClick={() => onNav('mila')} icon="🐱">Поговорить с Милой</BigButton>
            <div style={{ height: 10 }}/>
            <BigButton color="#fff" onClick={() => onNav('home')}>Вернуться домой</BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  const steps = [
    {
      title: 'Какая у тебя сегодня погода?',
      sub: 'внутри — как будто ты маленький мир',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {weathers.map(([e,l,c]) => (
            <button key={l} onClick={() => setWeather(l)} style={{
              background: weather === l ? c : '#fff',
              border: `3px solid ${weather === l ? '#6a4fb8' : 'rgba(106,79,184,0.2)'}`,
              borderRadius: 20, padding: 16, cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: weather === l ? '0 4px 0 #6a4fb8' : '0 2px 0 rgba(106,79,184,0.15)',
              transform: weather === l ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 40 }}>{e}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2a1f4a', marginTop: 4 }}>{l}</div>
            </button>
          ))}
        </div>
      ),
      canNext: !!weather,
    },
    {
      title: 'Какой у тебя цвет?',
      sub: 'выбери любой — или несколько',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '20px 0' }}>
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{
              background: c, border: `4px solid ${color === c ? '#2a1f4a' : 'rgba(255,255,255,0.8)'}`,
              borderRadius: '50%', aspectRatio: '1', cursor: 'pointer',
              boxShadow: color === c ? '0 4px 0 rgba(42,31,74,0.6)' : '0 3px 0 rgba(106,79,184,0.2)',
              transform: color === c ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
            }}/>
          ))}
        </div>
      ),
      canNext: !!color,
    },
    {
      title: 'Где ты это чувствуешь?',
      sub: 'в теле — где живёт это облачко',
      content: (
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 120, height: 220, position: 'relative', flexShrink: 0 }}>
            <svg viewBox="0 0 120 220" width="120" height="220">
              <circle cx="60" cy="32" r="24" fill="#ffe8d4" stroke="#6a4fb8" strokeWidth="2"/>
              <path d="M30 60 Q60 50 90 60 L95 150 Q60 160 25 150 Z" fill="#c5e1f5" stroke="#6a4fb8" strokeWidth="2"/>
              <path d="M25 70 Q10 120 18 160" fill="none" stroke="#6a4fb8" strokeWidth="2"/>
              <path d="M95 70 Q110 120 102 160" fill="none" stroke="#6a4fb8" strokeWidth="2"/>
              <path d="M40 150 Q35 200 40 215" fill="none" stroke="#6a4fb8" strokeWidth="2"/>
              <path d="M80 150 Q85 200 80 215" fill="none" stroke="#6a4fb8" strokeWidth="2"/>
              {body.includes('голова') && <circle cx="60" cy="32" r="18" fill="#ffd166" opacity="0.7"/>}
              {body.includes('грудь') && <circle cx="60" cy="90" r="16" fill="#ffd166" opacity="0.7"/>}
              {body.includes('живот') && <circle cx="60" cy="125" r="14" fill="#ffd166" opacity="0.7"/>}
              {body.includes('руки') && <><circle cx="16" cy="110" r="10" fill="#ffd166" opacity="0.7"/><circle cx="104" cy="110" r="10" fill="#ffd166" opacity="0.7"/></>}
              {body.includes('ноги') && <><circle cx="42" cy="190" r="10" fill="#ffd166" opacity="0.7"/><circle cx="80" cy="190" r="10" fill="#ffd166" opacity="0.7"/></>}
            </svg>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {bodyParts.map(p => {
              const on = body.includes(p);
              return (
                <button key={p} onClick={() => setBody(on ? body.filter(b => b !== p) : [...body, p])}
                  style={{
                    background: on ? '#ffd166' : '#fff',
                    border: `2px solid ${on ? '#b88a2e' : 'rgba(106,79,184,0.2)'}`,
                    borderRadius: 14, padding: '10px 12px', textAlign: 'left',
                    fontSize: 14, fontWeight: 700, color: '#2a1f4a',
                    fontFamily: 'inherit', cursor: 'pointer',
                    boxShadow: on ? '0 2px 0 #b88a2e' : 'none',
                  }}>{on ? '✓ ' : ''}{p}</button>
              );
            })}
          </div>
        </div>
      ),
      canNext: body.length > 0,
    },
    {
      title: 'Хочешь рассказать словами?',
      sub: 'не обязательно — можно и без слов',
      content: (
        <div>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="я чувствую..."
            style={{
              width: '100%', minHeight: 120,
              background: '#fff', border: '2px solid rgba(106,79,184,0.2)',
              borderRadius: 20, padding: 14,
              fontSize: 15, color: '#2a1f4a',
              fontFamily: 'inherit', resize: 'none',
              boxShadow: 'inset 0 2px 4px rgba(106,79,184,0.05)',
            }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
            <VoiceButton onText={(t) => setNote(n => n ? n + ' ' + t : t)} size={40}/>
            <div style={{ fontSize: 12, color: '#6a4fb8' }}>или скажи голосом →</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {['мне страшно','мне грустно','я злюсь','мне хорошо','я устал'].map(t => (
              <Chip key={t} onClick={() => setNote(n => n ? n + ' ' + t : t)}>{t}</Chip>
            ))}
          </div>
        </div>
      ),
      canNext: true,
    },
  ];
  const cur = steps[step];

  return (
    <Scene variant="calm">
      <TopBar
        title="Журнал сердца"
        subtitle={`${step + 1} из ${steps.length}`}
        left={<BackBtn onClick={() => step === 0 ? onNav('home') : setStep(step - 1)}/>}
      />
      <div style={{ padding: '4px 20px', display: 'flex', gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i <= step ? '#8b6fd4' : 'rgba(139,111,212,0.2)',
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>
      <div style={{ padding: '18px 20px', overflow: 'auto', height: 'calc(100% - 210px)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#2a1f4a', textAlign: 'center' }}>
          {cur.title}
        </div>
        <div style={{ fontSize: 13, color: '#6a4fb8', textAlign: 'center', marginTop: 4, marginBottom: 20 }}>
          {cur.sub}
        </div>
        {cur.content}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <BigButton
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else { addStar(); setSubmitted(true); }
          }}
          color={cur.canNext ? '#ffd166' : '#e8e4f0'}
          style={{ opacity: cur.canNext ? 1 : 0.5 }}
        >
          {step < steps.length - 1 ? 'дальше →' : '✨ отправить Миле'}
        </BigButton>
      </div>
    </Scene>
  );
};

window.JournalScreen = JournalScreen;
