/* Direction C: Почта спокойствия — mail/friends-centric, fantasy forest */

const DirC_Home = () => (
  <SketchFrame label="C · Главная · Почта">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'linear-gradient(180deg, #d4ffd4 0%, #fff4e6 60%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>🏡 Тихая полянка</div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>твой домик в лесу</div>
        </div>
        <MilaCat size={40}/>
      </div>

      {/* Mailbox hero */}
      <SketchBox fill="#fff" style={{ marginTop: 8, padding: 14, position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>📮</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>3 новые посылки!</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>от детей, которые уже справились</div>
        <SketchBtn big fill="#ffe8a3" style={{ marginTop: 6 }}>открыть почту →</SketchBtn>
        <div style={{ position: 'absolute', top: -8, right: 10, background: '#ff6b6b', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: '2px solid #1a1a1a' }}>3</div>
      </SketchBox>

      {/* Friends circle */}
      <SketchBox fill="#fff" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>✨ твои помощники</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, overflowX: 'auto' }}>
          {['🦊','🦉','🦔','🐰','🐢','?'].map((a,i) => (
            <div key={i} style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #1a1a1a', background: i===5?'#f0ecff':'#ffe8a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, opacity: i===5?0.5:1 }}>{a}</div>
          ))}
        </div>
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>5 из 12 — открывай новых делая упражнения</div>
      </SketchBox>

      {/* Quick SOS */}
      <div style={{ position: 'absolute', bottom: 80, left: 14, right: 14 }}>
        <SketchBtn big fill="#ffd4d4" style={{ width: '100%', boxSizing: 'border-box' }}>
          🤗 мне плохо — обними меня
        </SketchBtn>
      </div>

      <Note style={{ position: 'absolute', top: 100, right: -120, maxWidth: 110 }} arrow="left">
        вся механика = «получай + дари» посылки спокойствия. соц-терапевтично
      </Note>
    </div>
    <SketchBottomNav items={['🏡','📮','🐱','⭐','👤']} active={0}/>
  </SketchFrame>
);

const DirC_SendParcel = () => (
  <SketchFrame label="C · Отправить посылку">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', background: '#fffdf7' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>✉️ подари спокойствие</div>
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8 }}>другой ребёнок получит твой подарок анонимно</div>

      <SketchBox fill="#fff" style={{ padding: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>1. Что тебе помогло?</div>
        <div style={{ marginTop: 6 }}>
          <SketchChip fill="#ffe8a3">дыхание</SketchChip>
          <SketchChip fill="#d4e8ff">рисование</SketchChip>
          <SketchChip fill="#d4ffd4">объятие</SketchChip>
          <SketchChip fill="#ffd4e8">мама</SketchChip>
          <SketchChip fill="#fff">своё…</SketchChip>
        </div>
      </SketchBox>

      <SketchBox fill="#fff" style={{ padding: 10, marginTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>2. Напиши совет или нарисуй</div>
        <SketchBox dashed style={{ marginTop: 6, minHeight: 60, padding: 6 }}>
          <div style={{ fontSize: 10, opacity: 0.5 }}>«я представляю, что мой страх — это...»</div>
        </SketchBox>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <SketchChip fill="#f0ecff">🎤 голосом</SketchChip>
          <SketchChip fill="#f0ecff">🎨 рисунком</SketchChip>
        </div>
      </SketchBox>

      <SketchBox fill="#fff" style={{ padding: 10, marginTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>3. Выбери обёртку</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {['#ffe8a3','#d4e8ff','#ffd4e8','#d4ffd4'].map((c,i) => (
            <div key={i} style={{ flex: 1, height: 40, borderRadius: 8, border: '2px solid #1a1a1a', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Parcel size={28}/>
            </div>
          ))}
        </div>
      </SketchBox>

      <SketchBtn big fill="#ffe8a3" style={{ width: '100%', boxSizing: 'border-box', marginTop: 8 }}>
        ✦ отправить в мир
      </SketchBtn>

      <Note style={{ marginTop: 6 }}>
        После отправки → Мила говорит «спасибо, ты сделал чью-то ночь спокойнее». Счётчик помощи
      </Note>
    </div>
  </SketchFrame>
);

const DirC_Inbox = () => (
  <SketchFrame label="C · Открываем посылку">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'radial-gradient(circle at 50% 30%, #ffe8a3 0%, #fffdf7 60%)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, opacity: 0.6 }}>посылка 1/3</div>
        <Parcel size={120} style={{ margin: '14px auto' }}/>
        <div style={{ fontSize: 11, opacity: 0.7 }}>от друга ·  ребёнок, 9 лет</div>
      </div>

      <SketchBox fill="#fff" style={{ marginTop: 12, padding: 12 }}>
        <div style={{ fontSize: 10, opacity: 0.6 }}>💌 совет внутри:</div>
        <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
          «Когда я боюсь, я беру плюшевого зайца и рассказываю ему всё, что меня злит. Потом мне легче»
        </div>
        <div style={{ fontSize: 10, marginTop: 8, opacity: 0.6 }}>✓ проверено Милой — безопасно</div>
      </SketchBox>

      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <SketchBtn fill="#fff" style={{ flex: 1 }}>♡ спасибо</SketchBtn>
        <SketchBtn fill="#ffe8a3" style={{ flex: 2 }}>попробовать →</SketchBtn>
      </div>

      <Note style={{ marginTop: 8 }}>
        После «попробовать» → техника → анкета «помогло?». Замыкает петлю помощи
      </Note>
    </div>
  </SketchFrame>
);

const DirC_Cat = () => (
  <SketchFrame label="C · Мила — сказочница">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'linear-gradient(180deg, #e0d4ff 0%, #fff 80%)' }}>

      {/* library of stories */}
      <div style={{ fontSize: 13, fontWeight: 700 }}>📚 Библиотека сказок Милы</div>
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8 }}>сказки, которые Мила сплела для других детей</div>

      {[
        ['🌙','как лисёнок перестал бояться ночи','3 мин'],
        ['🌧','когда мама опаздывает','4 мин'],
        ['🐉','дракон внутри меня','5 мин'],
        ['🌱','почему я злюсь','3 мин'],
      ].map(([ic,t,d], i) => (
        <SketchBox key={i} fill="#fff" style={{ marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 24 }}>{ic}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{t}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>⏱ {d}</div>
          </div>
          <SketchBtn fill="#ffe8a3">▶</SketchBtn>
        </SketchBox>
      ))}

      {/* Ask Mila */}
      <SketchBox fill="#ffe8a3" style={{ marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>🪄 попросить свою сказку</div>
        <div style={{ fontSize: 11 }}>расскажи Миле, что у тебя на душе</div>
        <SketchBtn fill="#fff" style={{ marginTop: 4 }}>заговорить с Милой →</SketchBtn>
      </SketchBox>

      <Note style={{ marginTop: 6 }}>
        Двухрежимный: готовые сказки (кеш) + живой GigaChat. Дети 6-9 могут только готовые
      </Note>
    </div>
    <SketchBottomNav items={['🏡','📮','🐱','⭐','👤']} active={2}/>
  </SketchFrame>
);

const DirC_Progress = () => (
  <SketchFrame label="C · Прогресс-карта">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', background: '#fffdf7' }}>
      <div style={{ fontSize: 13, fontWeight: 700 }}>🗺 карта тихого леса</div>
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 6 }}>ты прошёл 5 из 20 мест</div>

      <SketchBox fill="#f0fff0" style={{ padding: 8, height: 240, position: 'relative' }}>
        <SketchPic style={{ position: 'absolute', inset: 6, borderRadius: 6 }} label="карта с тропинками и локациями"/>
        {[{left:40, top:180, c:'#ffe8a3', on:true, e:'🏡'},
          {left:100, top:150, c:'#ffe8a3', on:true, e:'🌊'},
          {left:160, top:110, c:'#ffe8a3', on:true, e:'⛰'},
          {left:80, top:70, c:'#fff', on:false, e:'🔒'},
          {left:200, top:40, c:'#fff', on:false, e:'🔒'},
        ].map((p,i) => (
          <div key={i} style={{ position: 'absolute', left: p.left, top: p.top,
            width: 36, height: 36, borderRadius: '50%',
            background: p.c, border: '2.5px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            opacity: p.on?1:0.5 }}>{p.e}</div>
        ))}
      </SketchBox>

      <SketchBox fill="#fff" style={{ marginTop: 6, display: 'flex', gap: 8 }}>
        <Star size={28}/>
        <div style={{ flex: 1, fontSize: 11 }}>
          <b>12 звёзд спокойствия</b>
          <div style={{ opacity: 0.6 }}>ещё 3 — и откроется новый друг</div>
        </div>
      </SketchBox>

      <SketchBox fill="#fff" style={{ marginTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>✉️ ты помог 7 детям</div>
        <div style={{ fontSize: 10 }}>они сказали «спасибо» на твои посылки</div>
      </SketchBox>

      <Note style={{ marginTop: 6 }}>
        Две шкалы: «забота о себе» (звёзды) + «забота о других» (помощь). Важен баланс
      </Note>
    </div>
    <SketchBottomNav items={['🏡','📮','🐱','⭐','👤']} active={3}/>
  </SketchFrame>
);

Object.assign(window, { DirC_Home, DirC_SendParcel, DirC_Inbox, DirC_Cat, DirC_Progress });
