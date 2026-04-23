/* Techniques, Map, SOS, Parent screens */

const TechniquesScreen = ({ onNav }) => {
  const items = [
    ['☁️','Дыхание облачка','#c5e1f5','когда страшно, вдыхай на 4 и выдыхай на 4','breathing'],
    ['👃','5-4-3-2-1','#d4f5d4','назови что видишь, слышишь, чувствуешь','tech-54321'],
    ['🦁','Львиный рык','#ffd166','выдохни громко, высунув язык — страх убегает','tech-lion'],
    ['🧸','Мягкое место','#ffd4e8','представь самое тёплое место на свете','tech-safe'],
    ['💪','Тигр-спагетти','#e0d4ff','напряги всё тело как тигр — потом расслабь как спагетти','tech-muscles'],
  ];
  return (
    <Scene variant="forest">
      <TopBar title="Волшебные штучки" subtitle="всё, что помогает" left={<BackBtn onClick={() => onNav('home')}/>}/>
      <div style={{ padding: '8px 20px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
        {items.map(([e, t, c, d, act]) => (
          <Card key={t} color={c} style={{ marginBottom: 12, display: 'flex', gap: 14, alignItems: 'center' }}
            onClick={() => onNav(act === 'breathing' ? 'breathing' : 'home')}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, border: '2px solid rgba(106,79,184,0.2)',
              boxShadow: '0 2px 0 rgba(106,79,184,0.2)',
            }}>{e}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#2a1f4a' }}>{t}</div>
              <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 2, lineHeight: 1.4 }}>{d}</div>
            </div>
            <div style={{ fontSize: 20, color: '#6a4fb8' }}>→</div>
          </Card>
        ))}
      </div>
      <BottomNav current="map" onNav={onNav}/>
    </Scene>
  );
};

const MapScreen = ({ onNav, stars, friends, helpCount }) => {
  const locations = [
    { x: 15, y: 80, emoji: '🏡', label: 'дом', done: true },
    { x: 45, y: 68, emoji: '☁️', label: 'дыхание', done: true },
    { x: 70, y: 52, emoji: '📖', label: 'журнал', done: true },
    { x: 40, y: 38, emoji: '🌲', label: 'лес покоя', done: stars >= 6 },
    { x: 75, y: 22, emoji: '🏔️', label: 'гора храбрости', done: stars >= 10 },
    { x: 30, y: 10, emoji: '✨', label: '?', done: false },
  ];
  const friendsList = PETS.map(p => ({
    e: p.e, name: p.name,
    locked: stars < p.unlockAt,
    justUnlocked: stars >= p.unlockAt && stars < p.unlockAt + 2,
  }));

  return (
    <Scene variant="day">
      <TopBar title="Карта путешествия" subtitle={`⭐ ${stars} звёзд`} left={<BackBtn onClick={() => onNav('home')}/>}/>
      <div style={{ padding: '8px 20px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
        <Card style={{
          background: 'linear-gradient(180deg, #c4e8c8, #e8f4d4)',
          padding: 0, height: 340, position: 'relative', overflow: 'hidden',
        }}>
          {/* path */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
            <path d="M 15 80 Q 30 74 45 68 Q 58 60 70 52 Q 55 45 40 38 Q 58 30 75 22 Q 52 16 30 10"
              fill="none" stroke="#8b6fd4" strokeWidth="0.8" strokeDasharray="2 2" strokeLinecap="round"/>
          </svg>
          {/* trees */}
          <div style={{ position: 'absolute', left: '28%', top: '55%', fontSize: 22 }}>🌳</div>
          <div style={{ position: 'absolute', left: '60%', top: '72%', fontSize: 18 }}>🌿</div>
          <div style={{ position: 'absolute', left: '10%', top: '45%', fontSize: 22 }}>🌲</div>
          <div style={{ position: 'absolute', left: '82%', top: '60%', fontSize: 18 }}>🌿</div>
          {/* locations */}
          {locations.map((l, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${l.x}%`, top: `${l.y}%`,
              transform: 'translate(-50%, -50%)', textAlign: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: l.done ? '#ffd166' : 'rgba(255,255,255,0.7)',
                border: `3px solid ${l.done ? '#b88a2e' : 'rgba(106,79,184,0.4)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, margin: '0 auto',
                boxShadow: l.done ? '0 4px 0 #b88a2e' : '0 2px 0 rgba(106,79,184,0.2)',
                opacity: l.done ? 1 : 0.6,
              }}>{l.done ? l.emoji : '🔒'}</div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#2a1f4a',
                marginTop: 2, textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              }}>{l.label}</div>
            </div>
          ))}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
            ✨ Твои помощники ({friendsList.filter(f => !f.locked).length}/{friendsList.length})
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {friendsList.map((f, i) => (
              <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: f.locked ? 'rgba(106,79,184,0.15)' : '#fff4d9',
                  border: `2px solid ${f.justUnlocked ? '#ffd166' : 'rgba(106,79,184,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, filter: f.locked ? 'grayscale(1)' : 'none',
                  opacity: f.locked ? 0.5 : 1,
                  animation: f.justUnlocked ? 'bob 2s ease-in-out infinite' : 'none',
                  boxShadow: f.justUnlocked ? '0 0 0 4px rgba(255,209,102,0.4)' : 'none',
                }}>{f.locked ? '🔒' : f.e}</div>
                <div style={{ fontSize: 10, color: '#6a4fb8', marginTop: 4, maxWidth: 60 }}>
                  {f.locked ? `⭐ ${PETS[i].unlockAt}` : f.name}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card color="linear-gradient(135deg, #ffd4e8, #ffe4f1)" style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 36 }}>💝</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>
            Ты помог {helpCount} детям
          </div>
          <div style={{ fontSize: 11, color: '#6a4fb8', marginTop: 2 }}>
            они сказали «спасибо» на твои посылки
          </div>
        </Card>
      </div>
      <BottomNav current="map" onNav={onNav}/>
    </Scene>
  );
};

const SOSScreen = ({ onNav }) => {
  const [phase, setPhase] = React.useState('welcome');
  const [breathScale, setBreathScale] = React.useState(1);
  React.useEffect(() => {
    if (phase !== 'breathing') return;
    const iv = setInterval(() => setBreathScale(s => s === 1 ? 1.4 : 1), 3500);
    return () => clearInterval(iv);
  }, [phase]);

  if (phase === 'welcome') {
    return (
      <Scene variant="calm" style={{ background: 'linear-gradient(180deg, #ffd4d4 0%, #ffe4e4 50%, #fff 100%)' }}>
        <TopBar title=" " left={<BackBtn onClick={() => onNav('home')}/>}/>
        <div style={{ padding: 24, height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ animation: 'bob 2s ease-in-out infinite' }}><Mila size={140}/></div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2a1f4a', marginTop: 20 }}>
            Я с тобой ✦
          </div>
          <div style={{ fontSize: 16, color: '#6a4fb8', marginTop: 10, lineHeight: 1.5, maxWidth: 280 }}>
            Всё будет хорошо. Давай подышим вместе — ты не один
          </div>
          <div style={{ marginTop: 40, width: '100%', maxWidth: 320 }}>
            <BigButton onClick={() => setPhase('breathing')} color="#ffd166" icon="☁️">
              давай подышим
            </BigButton>
            <div style={{ height: 10 }}/>
            <BigButton color="#fff" onClick={() => setPhase('help')}>
              💬 позвать на помощь
            </BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  if (phase === 'breathing') {
    return (
      <Scene variant="calm">
        <TopBar title="дыши со мной" left={<BackBtn onClick={() => setPhase('welcome')}/>}/>
        <div style={{ padding: 20, height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, #fff, #ffd166)',
            border: '4px solid #b88a2e',
            transform: `scale(${breathScale})`,
            transition: 'transform 3.5s ease-in-out',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(184,138,46,0.4)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2a1f4a' }}>
              {breathScale === 1 ? 'выдох' : 'вдох'}
            </div>
          </div>
          <div style={{ marginTop: 40, fontSize: 16, color: '#2a1f4a', fontWeight: 700, textAlign: 'center' }}>
            ✦ ты здесь ✦ ты в безопасности ✦
          </div>
          <div style={{ marginTop: 30, width: '100%', maxWidth: 320 }}>
            <BigButton onClick={() => setPhase('help')} color="#fff">
              мне нужен взрослый
            </BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  // help phase
  return (
    <Scene variant="calm">
      <TopBar title="кому позвонить" left={<BackBtn onClick={() => setPhase('welcome')}/>}/>
      <div style={{ padding: '20px 24px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
        <Card color="linear-gradient(135deg, #ffd166, #ffe8a3)" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>📞</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#2a1f4a', marginTop: 6 }}>
            Детский телефон доверия
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6a4fb8', marginTop: 10, letterSpacing: 1 }}>
            8-800-2000-122
          </div>
          <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 6 }}>
            бесплатно · всегда · доверительно
          </div>
          <a href="tel:88002000122" style={{ textDecoration: 'none', display: 'block', marginTop: 14 }}>
            <BigButton color="#fff">Позвонить сейчас</BigButton>
          </a>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#2a1f4a' }}>Позвать маму или папу</div>
          <div style={{ fontSize: 13, color: '#6a4fb8', marginTop: 6, lineHeight: 1.5 }}>
            Взрослый, который любит тебя, всегда хочет знать, что тебе плохо.
            Подойди и скажи: «мне нужна твоя помощь»
          </div>
        </Card>

        <Card style={{ marginTop: 12, background: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: 13, color: '#6a4fb8', lineHeight: 1.5 }}>
            <b>Мила напоминает:</b> ✦ твои чувства важны. Нет плохих чувств — есть разные. Ты не один.
          </div>
        </Card>
      </div>
    </Scene>
  );
};

const ParentScreen = ({ onNav, childName }) => (
  <Scene variant="calm" style={{ background: '#f4f0f8' }}>
    <TopBar title="Для родителя" subtitle={`наблюдение за ${childName}`} left={<BackBtn onClick={() => onNav('home')}/>}/>
    <div style={{ padding: '8px 20px 30px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
          📊 Активность за неделю
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {[40, 65, 25, 80, 50, 70, 45].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(180deg, #ffd166, #ffb8d4)', borderRadius: '6px 6px 0 0', border: '1.5px solid #b88a2e' }}/>
              <div style={{ fontSize: 10, color: '#6a4fb8', fontWeight: 700 }}>{'пнвтсрчтптсбвс'.slice(i*2, i*2+2)}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 10 }}>
          минут использования · ежедневно занимается
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
          🌤 Погода настроения
        </div>
        {[['☀️', 'солнечно', 8, '#ffd166'], ['⛅', 'немного туч', 5, '#c5e1f5'], ['🌧', 'дождливо', 3, '#8bb8e8'], ['🌈', 'радуга', 2, '#ffd4e8']].map(([e, l, c, col]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ fontSize: 20 }}>{e}</div>
            <div style={{ fontSize: 12, width: 90, color: '#2a1f4a' }}>{l}</div>
            <div style={{ flex: 1, height: 10, background: '#f0ecff', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${c * 10}%`, background: col, borderRadius: 6 }}/>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6a4fb8', width: 24 }}>{c}×</div>
          </div>
        ))}
      </Card>

      <Card color="linear-gradient(135deg, #d4f5d4, #eafbe4)" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginBottom: 8 }}>
          📈 Эффективность упражнений
        </div>
        <div style={{ fontSize: 11, color: '#6a4fb8', marginBottom: 10 }}>
          настроение «до» и «после» (средние за неделю)
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 90 }}>
          {[
            { label: 'дыхание', before: 2.1, after: 3.6 },
            { label: 'журнал', before: 2.4, after: 3.3 },
            { label: 'сказка', before: 2.0, after: 3.8 },
            { label: 'посылки', before: 2.7, after: 4.0 },
          ].map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 70 }}>
                <div style={{ flex: 1, height: `${d.before * 18}px`, background: '#c5e1f5', borderRadius: '4px 4px 0 0', border: '1.5px solid #6a4fb8' }}/>
                <div style={{ flex: 1, height: `${d.after * 18}px`, background: '#8ed18e', borderRadius: '4px 4px 0 0', border: '1.5px solid #4a7c59' }}/>
              </div>
              <div style={{ fontSize: 10, color: '#2a1f4a', fontWeight: 700 }}>{d.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: '#6a4fb8' }}>
          <div>■ до</div>
          <div style={{ color: '#4a7c59' }}>■ после</div>
          <div style={{ marginLeft: 'auto', fontWeight: 800, color: '#4a7c59' }}>+48% 📈</div>
        </div>
      </Card>

      <Card color="linear-gradient(135deg, #fff4d9, #ffe8a3)" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a' }}>⚠️ Внимание</div>
        <div style={{ fontSize: 13, color: '#6a4fb8', marginTop: 6, lineHeight: 1.5 }}>
          На этой неделе ребёнок 2 раза открывал «Мне страшно». Возможно, стоит спокойно поговорить — в безопасное время, без давления.
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginBottom: 6 }}>
          🔒 Приватность
        </div>
        <div style={{ fontSize: 12, color: '#6a4fb8', lineHeight: 1.5 }}>
          Записи из журнала и разговоры с Милой — личные. Ты видишь только общие тенденции, чтобы сохранить доверие ребёнка.
        </div>
      </Card>

      <Card color="linear-gradient(135deg, #d4f5d4, #eafbe4)">
        <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a' }}>💝 Активность</div>
        <div style={{ fontSize: 13, color: '#6a4fb8', marginTop: 6 }}>
          • 12 записей в журнале<br/>
          • 8 сеансов дыхания<br/>
          • Отправлено 4 посылки другим детям<br/>
          • Получено 6 благодарностей
        </div>
      </Card>
    </div>
  </Scene>
);

window.TechniquesScreen = TechniquesScreen;
window.MapScreen = MapScreen;
window.SOSScreen = SOSScreen;
window.ParentScreen = ParentScreen;
