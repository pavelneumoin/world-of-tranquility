/* Mila chat — storyteller powered by Claude (GigaChat-style integration).
   In real deployment this calls GigaChat; here it uses window.claude.complete as a stand-in. */

const MilaChat = ({ onNav, addStar }) => {
  const [messages, setMessages] = React.useState([
    { from: 'mila', text: 'Муррр ✦ Привет! Я Мила. Хочешь, расскажу тебе сказку? Или просто поболтаем?' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const newMsgs = [...messages, { from: 'child', text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    const system = `Ты — Мила, волшебная кошка-сказочница со звёздочкой на лбу. Ты общаешься с ребёнком 6-12 лет, который может быть встревожен или испуган. Правила:
- Говори очень тепло, мягко, простыми словами.
- Используй ласковые "мурр", "✦", называй ребёнка "малыш" или "дружок".
- Если ребёнок просит сказку — расскажи КОРОТКУЮ (4-6 предложений) добрую историю про лесных зверят, которая учит справляться со страхами.
- Если ребёнок грустит — утешь, предложи простое упражнение (дыхание облачком, обнять мягкую игрушку).
- НИКОГДА не давай медицинских советов. Если ребёнок говорит о серьёзной опасности или тяжёлых чувствах — мягко предложи рассказать маме/папе или позвонить по номеру 8-800-2000-122.
- Отвечай 2-5 предложениями, не длинно.`;

    try {
      const history = messages.map(m => ({
        role: m.from === 'mila' ? 'assistant' : 'user',
        content: m.text
      }));
      const resp = await fetch('/tranquility/api/mila-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });
      const data = await resp.json();
      const reply = data.answer || 'Муррр ✦ я тебя услышала';
      setMessages([...newMsgs, { from: 'mila', text: reply }]);
      setTimeout(() => speakMila(reply), 300);
      if (Math.random() < 0.3) addStar();
    } catch (e) {
      setMessages([...newMsgs, { from: 'mila', text: 'Муррр ✦ я немножко замечталась. Расскажи мне это ещё раз?' }]);
    }
    setLoading(false);
  };

  const quickTopics = [
    '🌙 расскажи сказку про сон',
    '😨 мне страшно',
    '😢 мне грустно',
    '🐉 сказку про храбрость',
    '🤗 просто поговори со мной',
  ];

  return (
    <Scene variant="dusk">
      <TopBar
        title="Мила"
        subtitle="✦ волшебная кошка-сказочница"
        left={<BackBtn onClick={() => onNav('home')}/>}
        right={
          <div style={{ animation: 'bob 3s ease-in-out infinite' }}>
            <Mila size={44}/>
          </div>
        }
      />
      <div ref={scrollRef} style={{
        padding: '10px 16px 220px',
        height: 'calc(100% - 70px)', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end',
            flexDirection: m.from === 'mila' ? 'row' : 'row-reverse' }}>
            {m.from === 'mila' && <Mila size={36}/>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: m.from === 'mila' ? 'flex-start' : 'flex-end' }}>
              <SpeechBubble from={m.from}>{m.text}</SpeechBubble>
              {m.from === 'mila' && <SpeakBtn text={m.text}/>}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <Mila size={36}/>
            <div style={{
              background: '#fff', borderRadius: '20px 20px 20px 6px',
              padding: '12px 16px', border: '2px solid rgba(106,79,184,0.2)',
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="dot" style={{ animation: 'dot 1.2s ease-in-out infinite' }}>●</span>
                <span className="dot" style={{ animation: 'dot 1.2s ease-in-out 0.2s infinite' }}>●</span>
                <span className="dot" style={{ animation: 'dot 1.2s ease-in-out 0.4s infinite' }}>●</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 14px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(139,111,212,0.15) 20%, rgba(139,111,212,0.35) 100%)',
      }}>
        {/* quick topic chips */}
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
            {quickTopics.map(t => (
              <button key={t} onClick={() => send(t.replace(/^[^\s]+\s/, ''))}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: 999, padding: '8px 12px',
                  fontSize: 13, fontWeight: 700, color: '#2a1f4a',
                  whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit',
                  flexShrink: 0,
                }}>{t}</button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <VoiceButton onText={(t) => { setInput(t); send(t); }} size={44}/>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="скажи или нажми 🎤"
            style={{
              flex: 1, background: '#fff',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: 999, padding: '12px 18px',
              fontSize: 15, color: '#2a1f4a',
              fontFamily: 'inherit', outline: 'none',
              minWidth: 0,
            }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{
            background: input.trim() && !loading ? '#ffd166' : '#e8e4f0',
            border: 'none', borderRadius: '50%',
            width: 44, height: 44, cursor: 'pointer',
            fontSize: 20, fontFamily: 'inherit',
            boxShadow: input.trim() ? '0 3px 0 #b88a2e' : 'none',
            flexShrink: 0,
          }}>✦</button>
        </div>
      </div>
    </Scene>
  );
};

window.MilaChat = MilaChat;
