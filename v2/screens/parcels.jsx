/* Parcels — inbox + send flow */

const INITIAL_PARCELS = [
  { id: 1, from: 'Тимофей, 8 лет', color: '#ffd166', emoji: '🫁', advice: 'Когда мне страшно, я представляю, что дую на горячий чай. Воздух выходит, и страх тоже немножко.', thanked: false, tried: false },
  { id: 2, from: 'Аня, 10 лет', color: '#c5e1f5', emoji: '🎨', advice: 'Я рисую свой страх. Сначала он большой, а потом я пририсовываю ему смешную шапку — и он превращается в клоуна.', thanked: false, tried: false },
  { id: 3, from: 'Миша, 7 лет', color: '#ffd4e8', emoji: '🧸', advice: 'Мой мишка умеет слушать. Я рассказываю ему всё — и становится легче. Попробуй со своей игрушкой!', thanked: false, tried: false },
];

const ParcelsInbox = ({ onNav, onOpen, parcels, onSend, helpCount }) => (
  <Scene variant="forest">
    <TopBar
      title="Почта спокойствия"
      subtitle={`${parcels.filter(p => !p.thanked).length} новых посылок`}
      left={<BackBtn onClick={() => onNav('home')}/>}
    />
    <div style={{ padding: '8px 20px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
      <Card color="linear-gradient(135deg, #fff4d9, #ffe8a3)" style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 40 }}>📮</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>
          Ты помог {helpCount} детям ✦
        </div>
        <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 4 }}>
          дети со всего мира делятся тем, что помогло им
        </div>
      </Card>

      <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', margin: '6px 4px' }}>
        ✉️ для тебя
      </div>
      {parcels.map(p => (
        <Card key={p.id} color={p.color} style={{
          marginBottom: 12, display: 'flex', gap: 14, alignItems: 'center',
          opacity: p.thanked ? 0.7 : 1,
        }} onClick={() => onOpen(p)}>
          <div style={{ fontSize: 44 }}>{p.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#6a4fb8', fontWeight: 600 }}>от {p.from}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2a1f4a', marginTop: 2, lineHeight: 1.3 }}>
              {p.advice.slice(0, 50)}...
            </div>
            <div style={{ fontSize: 12, color: '#6a4fb8', marginTop: 4, fontWeight: 700 }}>
              {p.thanked ? '✓ открыто' : 'тап чтобы открыть →'}
            </div>
          </div>
        </Card>
      ))}

      <div style={{ marginTop: 20 }}>
        <BigButton color="linear-gradient(135deg, #c5e1f5, #d4e8ff)" icon="💌" onClick={onSend}>
          Отправить своё спокойствие
        </BigButton>
      </div>
    </div>
    <BottomNav current="parcels" onNav={onNav}/>
  </Scene>
);

const ParcelOpen = ({ parcel, onBack, onThank, onTry }) => (
  <Scene variant="calm">
    <TopBar title="Посылка от друга" left={<BackBtn onClick={onBack}/>}/>
    <div style={{ padding: '20px 24px', height: 'calc(100% - 80px)', overflow: 'auto' }}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 100, animation: 'bob 3s ease-in-out infinite' }}>{parcel.emoji}</div>
        <div style={{ fontSize: 13, color: '#6a4fb8', fontWeight: 700, marginTop: 8 }}>
          от {parcel.from}
        </div>
      </div>

      <Card style={{ background: '#fffdf7', borderRadius: 28, padding: 24, border: '2px dashed rgba(106,79,184,0.3)' }}>
        <div style={{ fontSize: 11, color: '#6a4fb8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>
          💌 совет внутри
        </div>
        <div style={{ fontSize: 18, color: '#2a1f4a', marginTop: 10, lineHeight: 1.55, fontWeight: 500 }}>
          «{parcel.advice}»
        </div>
        <div style={{ fontSize: 11, color: '#8b6fd4', marginTop: 14, padding: '8px 12px', background: '#f4ecff', borderRadius: 10, fontWeight: 700 }}>
          ✦ проверено Милой — совет безопасный
        </div>
      </Card>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <BigButton color="#fff" onClick={() => { onThank(); }} style={{ flex: 1 }}>
          ♡ спасибо
        </BigButton>
        <BigButton onClick={() => { onTry(); }} style={{ flex: 2 }} icon="✨">
          попробовать
        </BigButton>
      </div>
    </div>
  </Scene>
);

const ParcelSend = ({ onBack, onSent }) => {
  const [method, setMethod] = React.useState(null);
  const [text, setText] = React.useState('');
  const [wrap, setWrap] = React.useState('#ffd166');
  const [sent, setSent] = React.useState(false);

  const methods = [
    ['🫁','дыхание'], ['🎨','рисование'], ['🤗','объятие'],
    ['🧸','игрушка'], ['🌳','природа'], ['🎵','музыка'],
  ];
  const wraps = ['#ffd166','#c5e1f5','#ffd4e8','#d4f5d4','#e0d4ff'];

  if (sent) {
    return (
      <Scene variant="calm">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
          <div style={{ fontSize: 120, animation: 'fly 2s ease-out' }}>💌</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2a1f4a', marginTop: 20 }}>Посылка улетела ✦</div>
          <div style={{ fontSize: 15, color: '#6a4fb8', marginTop: 10, lineHeight: 1.5, maxWidth: 300 }}>
            Какой-то ребёнок сегодня получит твоё спокойствие. Ты сделал мир чуточку добрее.
          </div>
          <div style={{ marginTop: 30, width: '100%', maxWidth: 320 }}>
            <BigButton onClick={onSent} icon="🏡">Домой</BigButton>
          </div>
        </div>
      </Scene>
    );
  }

  return (
    <Scene variant="calm">
      <TopBar title="Подари спокойствие" subtitle="кто-то получит анонимно" left={<BackBtn onClick={onBack}/>}/>
      <div style={{ padding: '12px 20px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
            1. Что тебе помогло?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {methods.map(([e, l]) => (
              <button key={l} onClick={() => setMethod(l)} style={{
                background: method === l ? '#ffd166' : '#fff',
                border: `2px solid ${method === l ? '#b88a2e' : 'rgba(106,79,184,0.2)'}`,
                borderRadius: 16, padding: 12, cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: method === l ? '0 2px 0 #b88a2e' : 'none',
              }}>
                <div style={{ fontSize: 28 }}>{e}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2a1f4a' }}>{l}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
            2. Расскажи другу
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="когда мне страшно, я..."
            style={{
              width: '100%', minHeight: 90,
              border: '2px solid rgba(106,79,184,0.2)',
              borderRadius: 16, padding: 12,
              fontSize: 14, color: '#2a1f4a',
              fontFamily: 'inherit', resize: 'none', outline: 'none',
            }}/>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginBottom: 10 }}>
            3. Выбери обёртку
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {wraps.map(c => (
              <button key={c} onClick={() => setWrap(c)} style={{
                background: c, width: 50, height: 50, borderRadius: 14,
                border: `3px solid ${wrap === c ? '#2a1f4a' : 'rgba(255,255,255,0.5)'}`,
                cursor: 'pointer', fontSize: 24,
                transform: wrap === c ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s',
              }}>💌</button>
            ))}
          </div>
        </Card>

        <div style={{
          marginTop: 14, padding: 10, background: 'rgba(255,255,255,0.6)',
          borderRadius: 14, fontSize: 11, color: '#6a4fb8', textAlign: 'center',
        }}>
          🐱 Мила проверит твою посылку, чтобы она была доброй
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <BigButton
          onClick={() => method && text.trim() && setSent(true)}
          color={method && text.trim() ? '#ffd166' : '#e8e4f0'}
          icon="✦"
          style={{ opacity: method && text.trim() ? 1 : 0.5 }}
        >
          отправить в мир
        </BigButton>
      </div>
    </Scene>
  );
};

window.ParcelsInbox = ParcelsInbox;
window.ParcelOpen = ParcelOpen;
window.ParcelSend = ParcelSend;
window.INITIAL_PARCELS = INITIAL_PARCELS;
