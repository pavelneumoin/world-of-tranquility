/* Direction B: Уютный дневник — watercolor/pastel, journal-centric */

const DirB_Home = () => (
  <SketchFrame label="B · Главная · Дневник">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'linear-gradient(180deg, #fff4e6 0%, #ffeef0 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, opacity: 0.7 }}>вторник, 23 апреля</div>
        <MilaCat size={36}/>
      </div>

      {/* Big journal open */}
      <SketchBox fill="#fffdf7" style={{ marginTop: 8, padding: 12, position: 'relative' }} round={6}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#1a1a1a', opacity: 0.15 }}/>
        <div style={{ fontSize: 12, fontWeight: 700 }}>✿ моя страничка сегодня</div>
        <ScribbleLines lines={2} widths={['90%','60%']}/>
        <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>настроение: 🌈</div>
        <SketchPic style={{ marginTop: 6, height: 60, borderRadius: 8 }} label="рисунок ребёнка"/>
      </SketchBox>

      {/* Mila suggestion */}
      <SketchBox fill="#ffe8a3" style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <MilaCat size={44}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Мила предлагает:</div>
          <div style={{ fontSize: 11 }}>«давай подышим облачками 5 минут?»</div>
          <div style={{ marginTop: 4 }}>
            <SketchChip fill="#fff">давай!</SketchChip>
            <SketchChip fill="#fff">позже</SketchChip>
          </div>
        </div>
      </SketchBox>

      {/* quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
        <SketchBox fill="#d4e8ff" style={{ textAlign: 'center', padding: 10 }}>
          <div style={{ fontSize: 22 }}>🫁</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>подышать</div>
        </SketchBox>
        <SketchBox fill="#ffd4e8" style={{ textAlign: 'center', padding: 10 }}>
          <div style={{ fontSize: 22 }}>🎁</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>посылка</div>
          <div style={{ fontSize: 9 }}>3 новых!</div>
        </SketchBox>
        <SketchBox fill="#d4ffd4" style={{ textAlign: 'center', padding: 10 }}>
          <div style={{ fontSize: 22 }}>🐱</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>сказка</div>
        </SketchBox>
        <SketchBox fill="#fff3d9" style={{ textAlign: 'center', padding: 10 }}>
          <div style={{ fontSize: 22 }}>⭐</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>техники</div>
        </SketchBox>
      </div>

      <div style={{ position: 'absolute', bottom: 76, left: 14, right: 14 }}>
        <SketchBtn big fill="#ffd4d4" style={{ width: '100%', boxSizing: 'border-box' }}>
          🤗 мне нужна помощь
        </SketchBtn>
      </div>

      <Note style={{ position: 'absolute', top: 140, left: -130, maxWidth: 120 }} arrow="right">
        главная = раскрытый дневник. всё строится вокруг «пишу себя»
      </Note>
    </div>
    <SketchBottomNav items={['📖','🫁','🐱','🎁','👤']} active={0}/>
  </SketchFrame>
);

const DirB_Journal = () => (
  <SketchFrame label="B · Журнал — расширенный">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative', background: '#fffdf7' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>Что у тебя в сердце? ♡</div>
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8 }}>выбирай всё, что подходит — хоть всё сразу</div>

      {/* mood weather */}
      <SketchBox fill="#fff" style={{ padding: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🌤 какая у меня погода?</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-around' }}>
          {['☀️','⛅','☁️','🌧','⛈','🌈'].map((w,i) => (
            <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: i===2?'#ffe8a3':'#fff', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{w}</div>
          ))}
        </div>
      </SketchBox>

      {/* color feeling */}
      <SketchBox fill="#fff" style={{ padding: 10, marginTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🎨 какой у меня цвет?</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ffd4d4','#ffe8a3','#d4ffd4','#d4e8ff','#e0d4ff','#fff','#1a1a1a'].map((c,i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #1a1a1a' }}/>
          ))}
        </div>
      </SketchBox>

      {/* body map */}
      <SketchBox fill="#fff" style={{ padding: 10, marginTop: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
        <SketchPic style={{ width: 70, height: 100 }} label="силуэт"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>где я это чувствую?</div>
          <div style={{ fontSize: 10, opacity: 0.7 }}>тапни по телу</div>
          <div style={{ marginTop: 6 }}>
            <SketchChip fill="#ffe8a3">голова 🔴</SketchChip>
            <SketchChip fill="#fff">живот</SketchChip>
          </div>
        </div>
      </SketchBox>

      <SketchBtn fill="#ffe8a3" style={{ width: '100%', boxSizing: 'border-box', marginTop: 8 }}>
        + добавить слова или рисунок
      </SketchBtn>

      <Note style={{ marginTop: 6 }}>
        3 разных канала выражения — чтобы не-вербальный ребёнок тоже мог рассказать
      </Note>
    </div>
    <SketchBottomNav items={['📖','🫁','🐱','🎁','👤']} active={0}/>
  </SketchFrame>
);

const DirB_Cat = () => (
  <SketchFrame label="B · Сказочница у костра">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'linear-gradient(180deg, #fff4e6 0%, #ffd9a3 100%)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>🔥 у костра с Милой</div>
      </div>

      {/* scene */}
      <SketchBox fill="#fffdf7" style={{ marginTop: 8, padding: 12, height: 160, position: 'relative' }}>
        <SketchPic style={{ position: 'absolute', inset: 8, borderRadius: 10 }} label="лес + костёр + мила"/>
        <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
          <MilaCat size={48}/>
        </div>
      </SketchBox>

      {/* Current story card */}
      <SketchBox fill="#fff" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>✦ Сказка о лисёнке, который не боялся темноты</div>
        <div style={{ fontSize: 10, opacity: 0.6 }}>5 минут · озвучено</div>
        <ScribbleLines lines={2} widths={['95%','70%']}/>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <SketchBtn fill="#ffe8a3" style={{ flex: 1 }}>▶ слушать</SketchBtn>
          <SketchBtn fill="#fff">♡</SketchBtn>
        </div>
      </SketchBox>

      {/* Request new story */}
      <SketchBox fill="#e0d4ff" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>🪄 попросить новую сказку</div>
        <div style={{ fontSize: 10, marginTop: 4 }}>о чём хочешь? </div>
        <div style={{ marginTop: 4 }}>
          <SketchChip fill="#fff">про страх</SketchChip>
          <SketchChip fill="#fff">про одиночество</SketchChip>
          <SketchChip fill="#fff">про маму</SketchChip>
          <SketchChip fill="#fff">свою…</SketchChip>
        </div>
      </SketchBox>

      <Note style={{ marginTop: 6 }}>
        GigaChat генерирует короткую сказку (200-300 слов). Можно озвучить TTS
      </Note>
    </div>
    <SketchBottomNav items={['📖','🫁','🐱','🎁','👤']} active={2}/>
  </SketchFrame>
);

const DirB_Techniques = () => (
  <SketchFrame label="B · Техники релаксации">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', background: '#fffdf7' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>Волшебные штучки</div>
      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 8 }}>то, что помогает, когда грустно</div>

      {[
        ['🫁','Дыхание облачка','1-2 мин','легко','#d4e8ff'],
        ['👃','5-4-3-2-1 вокруг','3 мин','легко','#d4ffd4'],
        ['💪','Тигр и спагетти','5 мин','средне','#ffe8a3'],
        ['🏞','Безопасное место','5 мин','средне','#ffd4e8'],
        ['🦁','Львиный выдох','1 мин','легко','#fff3d9'],
      ].map(([i,t,time,lvl,c], idx) => (
        <SketchBox key={idx} fill={c} style={{ marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{i}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{t}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>⏱ {time} · {lvl}</div>
          </div>
          <Star size={20}/>
        </SketchBox>
      ))}

      <Note style={{ marginTop: 4 }}>
        Игровые названия вместо «прогрессивная мышечная релаксация». Звёздочки = пройдено
      </Note>
    </div>
    <SketchBottomNav items={['📖','🫁','🐱','🎁','👤']} active={1}/>
  </SketchFrame>
);

const DirB_Breathing = () => (
  <SketchFrame label="B · Дыхание облачка">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'radial-gradient(circle at 50% 40%, #d4e8ff 0%, #fffdf7 70%)' }}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>← техники</div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Cloud size={180} mood="" style={{ margin: '0 auto' }}/>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: -20 }}>вдыхай…</div>
      </div>

      <SketchBox fill="#fff" style={{ marginTop: 30 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>🐱 Мила говорит:</div>
        <div style={{ fontSize: 11 }}>"представь, что дуешь на тёплый чай"</div>
      </SketchBox>

      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'center' }}>
        {[1,2,3,4].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i<=2?'#1a1a1a':'#fff', border: '2px solid #1a1a1a' }}/>)}
        <span style={{ fontSize: 10, marginLeft: 6, alignSelf: 'center' }}>2/4 цикла</span>
      </div>

      <div style={{ position: 'absolute', bottom: 80, left: 14, right: 14, display: 'flex', gap: 6 }}>
        <SketchBtn fill="#fff" style={{ flex: 1 }}>⏸ пауза</SketchBtn>
        <SketchBtn fill="#ffe8a3" style={{ flex: 1 }}>✓ готово</SketchBtn>
      </div>
    </div>
  </SketchFrame>
);

Object.assign(window, { DirB_Home, DirB_Journal, DirB_Cat, DirB_Techniques, DirB_Breathing });
