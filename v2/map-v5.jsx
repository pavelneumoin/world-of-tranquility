// === РАСШИРЕННАЯ КАРТА ПУТЕШЕСТВИЙ v5 ===
// Заменяет MapScreen из other.jsx на богатую версию с 10 локациями + достижениями

(function(){
  const { useState: _us, useEffect: _ue } = React;

  const MAP_LOCS = [
    // [x%, y%, emoji, title, desc, starsRequired, action]
    [12, 88, '🏡', 'Дом',           'Твоё уютное начало',          0,  'home'],
    [28, 78, '☁️', 'Облачко',       'Учит дышать',                 0,  'breathing'],
    [48, 72, '📖', 'Сад чувств',    'Журнал сердца',               0,  'journal'],
    [66, 62, '🐱', 'Домик Милы',    'Сказки и разговоры',          2,  'mila'],
    [82, 48, '💌', 'Почта друзей',  'Посылки спокойствия',         3,  'parcels'],
    [58, 42, '🌲', 'Лес покоя',     'Техники заземления',          5,  'techniques'],
    [32, 32, '🌊', 'Море снов',     'Истории на ночь (скоро)',     8,  null],
    [70, 22, '🏔️', 'Гора храбрости', 'Победа над страхом',          12, null],
    [45, 14, '🎨', 'Радуга чувств', 'Назови, что чувствуешь',      16, null],
    [20, 6,  '✨', 'Звёздный зал',  'Секрет — открой сам',         25, null],
  ];

  const ACHIEVEMENTS = [
    ['🌱', 'Первый вдох',   'Сделал(а) 1 дыхательное упр.',  1],
    ['💌', 'Отзывчивое сердце', 'Отправил(а) первую посылку', 2],
    ['🎯', 'Неделя спокойствия', '7 дней подряд в приложении', 7],
    ['🐱', 'Лучший друг Милы', '10 разговоров с Милой',       10],
    ['🏆', 'Герой чувств',   'Помог(ла) 10 детям',             10],
    ['🌈', 'Мастер эмоций',  'Заполнил(а) журнал 20 раз',      20],
  ];

  const WEEKLY_QUESTS = [
    { e: '☁️', t: 'Подыши 3 раза', goal: 3, got: 2, reward: '⭐3' },
    { e: '📖', t: 'Запиши чувство в журнал', goal: 5, got: 3, reward: '⭐2' },
    { e: '💌', t: 'Поддержи друга — отправь посылку', goal: 1, got: 0, reward: '⭐5 + 🎁' },
  ];

  const MapScreenV5 = ({ onNav, stars, friends, helpCount }) => {
    const [activeTab, setActiveTab] = _us('map');
    const visitedCount = MAP_LOCS.filter(l => stars >= l[5]).length;
    const totalAchievements = ACHIEVEMENTS.filter(a => stars >= a[3]).length;

    return (
      <Scene variant="day">
        <TopBar title="Карта путешествия"
          subtitle={`⭐ ${stars} · посещено ${visitedCount} из ${MAP_LOCS.length}`}
          left={<BackBtn onClick={() => onNav('home')}/>}/>

        <div style={{ padding: '6px 18px 120px', overflow: 'auto', height: 'calc(100% - 70px)' }}>
          {/* Табы */}
          <div style={{display:'flex',gap:6,marginBottom:10,background:'rgba(255,255,255,0.5)',padding:4,borderRadius:999}}>
            {['map','quests','achievements'].map(k => (
              <button key={k} onClick={()=>setActiveTab(k)} style={{
                flex:1, padding:'8px 10px', borderRadius:999, border:'none',
                background: activeTab===k ? 'linear-gradient(135deg,#8b6fd4,#6a4fb8)' : 'transparent',
                color: activeTab===k ? '#fff' : '#6a4fb8',
                fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'inherit'
              }}>
                {k==='map'?'🗺 Карта':k==='quests'?'🎯 Задания':'🏆 Награды'}
              </button>
            ))}
          </div>

          {activeTab === 'map' && (
            <>
              <Card style={{
                background:'linear-gradient(180deg,#c4e8c8 0%,#e8f4d4 50%,#fff4e6 100%)',
                padding:0, height: 420, position:'relative', overflow:'hidden',
              }}>
                {/* path */}
                <svg viewBox="0 0 100 100" style={{position:'absolute',inset:0,width:'100%',height:'100%'}} preserveAspectRatio="none">
                  <path d="M 12 88 Q 20 84 28 78 Q 38 75 48 72 Q 57 67 66 62 Q 74 55 82 48 Q 70 45 58 42 Q 45 37 32 32 Q 51 27 70 22 Q 57 18 45 14 Q 32 10 20 6"
                    fill="none" stroke="#8b6fd4" strokeWidth="0.7" strokeDasharray="2 2" strokeLinecap="round"/>
                </svg>
                {/* decorations */}
                {[
                  ['🌳','20%','70%',22],['🌿','35%','65%',18],['🌲','62%','70%',20],
                  ['🌿','80%','55%',16],['🌸','15%','30%',20],['🦋','90%','30%',18],
                  ['🌿','58%','18%',18],['✨','38%','20%',16],['☁️','25%','12%',24],
                  ['🌞','85%','8%',28],
                ].map(([e,x,y,s],i)=>(
                  <div key={i} style={{position:'absolute',left:x,top:y,fontSize:s,opacity:0.85}}>{e}</div>
                ))}
                {/* локации */}
                {MAP_LOCS.map(([x,y,emoji,title,desc,req,act], i) => {
                  const unlocked = stars >= req;
                  const clickable = unlocked && act;
                  return (
                    <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,transform:'translate(-50%,-50%)',textAlign:'center',cursor:clickable?'pointer':'default'}}
                      onClick={() => clickable && onNav(act)}
                      title={desc}>
                      <div style={{
                        width:52, height:52, borderRadius:'50%',
                        background: unlocked ? '#ffd166' : 'rgba(255,255,255,0.7)',
                        border: `3px solid ${unlocked ? '#b88a2e' : 'rgba(106,79,184,0.4)'}`,
                        display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto',
                        boxShadow: unlocked ? '0 4px 0 #b88a2e' : '0 2px 0 rgba(106,79,184,0.2)',
                        animation: clickable ? 'bob 3s ease-in-out infinite' : 'none',
                      }}>
                        {unlocked ? emoji : '🔒'}
                      </div>
                      <div style={{fontSize:10,fontWeight:800,color:'#2a1f4a',marginTop:2,textShadow:'0 1px 2px rgba(255,255,255,0.9)',whiteSpace:'nowrap'}}>
                        {unlocked ? title : `⭐${req}`}
                      </div>
                    </div>
                  );
                })}
              </Card>

              {/* Персонажи-помощники */}
              <Card style={{marginTop:12}}>
                <div style={{fontSize:14,fontWeight:800,color:'#2a1f4a',marginBottom:10}}>
                  🦋 Помощники в путешествии
                </div>
                <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:4}}>
                  {[
                    ['🐱','Мила','главная'],
                    ['🦊','Лисёнок Тим','в гостях' , stars >= 2],
                    ['🦉','Сова Уна','с 5⭐',        stars >= 5],
                    ['🐻','Мишка Плюш','с 10⭐',    stars >= 10],
                    ['🦌','Оленёнок','с 15⭐',      stars >= 15],
                    ['🦄','Единорог','с 25⭐',       stars >= 25],
                  ].map(([e,n,s,un],i)=>{
                    const unlocked = un !== undefined ? un : true;
                    return (
                      <div key={i} style={{textAlign:'center',flexShrink:0,minWidth:64}}>
                        <div style={{
                          width:56, height:56, borderRadius:'50%',
                          background: unlocked?'#fff4d9':'rgba(106,79,184,0.1)',
                          border:`2px solid ${unlocked?'rgba(255,209,102,0.6)':'rgba(106,79,184,0.2)'}`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:30, filter: unlocked?'none':'grayscale(1)', opacity: unlocked?1:0.5,
                        }}>{unlocked?e:'🔒'}</div>
                        <div style={{fontSize:10,color:'#6a4fb8',marginTop:4,fontWeight:700}}>
                          {unlocked?n:s}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card color="linear-gradient(135deg, #ffd4e8, #ffe4f1)" style={{marginTop:12,textAlign:'center'}}>
                <div style={{fontSize:32}}>💝</div>
                <div style={{fontSize:14,fontWeight:800,color:'#2a1f4a',marginTop:4}}>
                  Ты помог {helpCount} детям
                </div>
                <div style={{fontSize:11,color:'#6a4fb8',marginTop:2}}>
                  они сказали «спасибо» на твои посылки
                </div>
              </Card>
            </>
          )}

          {activeTab === 'quests' && (
            <>
              <Card color="linear-gradient(135deg, #fff4d9, #ffe8a3)">
                <div style={{fontSize:14,fontWeight:800,color:'#2a1f4a'}}>🔥 Серия дней</div>
                <div style={{fontSize:36,fontWeight:900,color:'#2a1f4a',marginTop:4}}>4 дня подряд!</div>
                <div style={{fontSize:12,color:'#6a4fb8',marginTop:2}}>Возвращайся каждый день, чтобы серия росла</div>
                <div style={{display:'flex',gap:4,marginTop:10}}>
                  {['пн','вт','ср','чт','пт','сб','вс'].map((d,i)=>(
                    <div key={i} style={{flex:1,textAlign:'center'}}>
                      <div style={{
                        width:28,height:28,margin:'0 auto',borderRadius:'50%',
                        background: i<4?'#ffd166':'rgba(106,79,184,0.15)',
                        color: i<4?'#2a1f4a':'#6a4fb8',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:14,fontWeight:800,border:i===3?'2px solid #b88a2e':'none',
                      }}>{i<4?'✓':'·'}</div>
                      <div style={{fontSize:9,color:'#6a4fb8',marginTop:2,fontWeight:700}}>{d}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{fontSize:13,fontWeight:800,color:'#2a1f4a',margin:'14px 4px 6px'}}>
                🎯 Задания на неделю
              </div>
              {WEEKLY_QUESTS.map((q,i)=>{
                const done = q.got >= q.goal;
                const pct = Math.min(100, (q.got/q.goal)*100);
                return (
                  <Card key={i} style={{marginBottom:8, opacity: done?0.7:1}}>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <div style={{fontSize:32}}>{q.e}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:800,color:'#2a1f4a'}}>{q.t}</div>
                        <div style={{fontSize:11,color:'#6a4fb8',marginTop:2}}>
                          {q.got}/{q.goal} · награда {q.reward} {done?'✓':''}
                        </div>
                        <div style={{height:6,background:'rgba(106,79,184,0.12)',borderRadius:99,marginTop:6,overflow:'hidden'}}>
                          <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#ffd166,#b88a2e)',borderRadius:99}}/>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          {activeTab === 'achievements' && (
            <>
              <Card color="linear-gradient(135deg, #e0f4f7, #c5e7ee)" style={{textAlign:'center'}}>
                <div style={{fontSize:36,fontWeight:900,color:'#2a1f4a'}}>{totalAchievements} / {ACHIEVEMENTS.length}</div>
                <div style={{fontSize:13,color:'#6a4fb8',marginTop:4}}>ачивок открыто</div>
              </Card>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:12}}>
                {ACHIEVEMENTS.map(([e,t,d,req],i)=>{
                  const unlocked = stars >= req;
                  return (
                    <Card key={i} style={{textAlign:'center',opacity:unlocked?1:0.5}}>
                      <div style={{fontSize:40,filter:unlocked?'none':'grayscale(1)'}}>{unlocked?e:'🔒'}</div>
                      <div style={{fontSize:12,fontWeight:800,color:'#2a1f4a',marginTop:4}}>{t}</div>
                      <div style={{fontSize:10,color:'#6a4fb8',marginTop:2,lineHeight:1.3}}>{d}</div>
                      {!unlocked && <div style={{fontSize:10,color:'#ff8ab6',marginTop:4,fontWeight:800}}>⭐ {req}</div>}
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <BottomNav current="map" onNav={onNav}/>
      </Scene>
    );
  };

  window.MapScreen = MapScreenV5;
})();
