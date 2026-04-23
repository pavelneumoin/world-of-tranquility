/* Home screen — magical cottage with Mila, daily hello, quick actions, SOS */

const HomeScreen = ({ onNav, stars, helpCount, childName, onSOS }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Привет' : 'Добрый вечер';
  return (
    <Scene variant="dawn">
      <TopBar
        title={`${greeting}, ${childName}!`}
        subtitle="Мила рада тебя видеть ✦"
        left={
          <div style={{
            background: 'rgba(255,255,255,0.9)', borderRadius: 999,
            padding: '6px 10px', border: '2px solid rgba(106,79,184,0.2)',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 800, color: '#b88a2e',
          }}>⭐ {stars}</div>
        }
        right={
          <button onClick={() => onNav('parent')} style={{
            background: 'rgba(255,255,255,0.9)', border: '2px solid rgba(106,79,184,0.2)',
            borderRadius: '50%', width: 40, height: 40, cursor: 'pointer',
            fontSize: 18, fontFamily: 'inherit',
          }}>👨‍👩‍👧</button>
        }
      />

      <div style={{ padding: '8px 20px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
        {/* Mila hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(244,236,255,0.85))',
          borderRadius: 32, padding: 20, marginTop: 8,
          border: '2px solid rgba(106,79,184,0.15)',
          boxShadow: '0 8px 24px rgba(106,79,184,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ animation: 'bob 3s ease-in-out infinite' }}>
              <Mila size={110}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#2a1f4a', marginBottom: 4 }}>
                Как ты сегодня?
              </div>
              <div style={{ fontSize: 13, color: '#6a4fb8', lineHeight: 1.4, marginBottom: 10 }}>
                Расскажи мне — я рядом
              </div>
              <button onClick={() => onNav('journal')} style={{
                background: '#ffd166', color: '#2a1f4a',
                border: 'none', borderRadius: 999,
                padding: '8px 14px', fontSize: 13, fontWeight: 800,
                fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '0 3px 0 #b88a2e',
              }}>✨ Рассказать</button>
            </div>
          </div>
        </div>

        {/* Parcels teaser */}
        <Card
          color="linear-gradient(135deg, #fff4d9, #ffe8a3)"
          style={{ marginTop: 14, display: 'flex', gap: 14, alignItems: 'center' }}
          onClick={() => onNav('parcels')}
        >
          <div style={{ fontSize: 44, filter: 'drop-shadow(0 4px 6px rgba(184,138,46,0.3))' }}>💌</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#2a1f4a' }}>
              3 новые посылки!
            </div>
            <div style={{ fontSize: 12, color: '#6a4fb8' }}>
              от друзей, которым тоже было страшно
            </div>
          </div>
          <div style={{
            background: '#ff6b8a', color: '#fff', fontWeight: 800, fontSize: 14,
            width: 30, height: 30, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff', boxShadow: '0 3px 0 rgba(184,46,74,0.4)',
          }}>3</div>
        </Card>

        {/* Quick grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
          <Card color="linear-gradient(135deg, #c5e1f5, #e0f0ff)" onClick={() => onNav('breathing')} style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 40 }}>☁️</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>Дыши</div>
            <div style={{ fontSize: 11, color: '#6a4fb8' }}>с облачком</div>
          </Card>
          <Card color="linear-gradient(135deg, #ffd4e8, #ffe4f1)" onClick={() => onNav('mila')} style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 40 }}>🌙</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>Сказка</div>
            <div style={{ fontSize: 11, color: '#6a4fb8' }}>от Милы</div>
          </Card>
          <Card color="linear-gradient(135deg, #d4f5d4, #eafbe4)" onClick={() => onNav('techniques')} style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 40 }}>🪄</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>Магия</div>
            <div style={{ fontSize: 11, color: '#6a4fb8' }}>успокоения</div>
          </Card>
          <Card color="linear-gradient(135deg, #e0d4ff, #f0e8ff)" onClick={() => onNav('map')} style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 40 }}>🗺️</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2a1f4a', marginTop: 4 }}>Путь</div>
            <div style={{ fontSize: 11, color: '#6a4fb8' }}>{stars} звёзд</div>
          </Card>
        </div>

        {/* Help count */}
        <div style={{
          marginTop: 14, textAlign: 'center',
          background: 'rgba(255,255,255,0.6)', borderRadius: 20,
          padding: '10px 16px', fontSize: 13, color: '#6a4fb8', fontWeight: 600,
          border: '2px dashed rgba(106,79,184,0.25)',
        }}>
          💝 Ты уже помог <b>{helpCount} детям</b> стать спокойнее
        </div>

        {/* SOS button */}
        <div style={{ marginTop: 14 }}>
          <BigButton
            color="linear-gradient(135deg, #ffb8b8, #ffd4d4)"
            icon="🤗"
            onClick={onSOS}
          >
            Мне страшно — обними меня
          </BigButton>
        </div>
      </div>
      <BottomNav current="home" onNav={onNav}/>
    </Scene>
  );
};

window.HomeScreen = HomeScreen;
