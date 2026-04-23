/* Direction A: Звёздная карта мира — gamified world map, night/cosmos vibe */

const DirA_Home = () => (
  <SketchFrame label="A · Главная · Карта мира">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'radial-gradient(circle at 30% 20%, #e8e1ff 0%, #fffdf7 60%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SketchChip fill="#ffe8a3">★ 12 звёзд</SketchChip>
        <SketchChip fill="#e0d4ff">ур. 3</SketchChip>
      </div>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Привет, Соня!</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>Мила ждёт тебя в пути ✦</div>
      </div>

      {/* World map with planets */}
      <SketchBox style={{ marginTop: 8, padding: 8, height: 340, position: 'relative' }} fill="#fffaf0">
        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>🌙 карта спокойствия</div>
        {/* dotted path */}
        <svg viewBox="0 0 280 300" style={{ position: 'absolute', inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)' }}>
          <path d="M40 260 Q80 180 140 200 Q200 220 180 140 Q160 80 220 50" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="4 5"/>
        </svg>
        {/* planets */}
        <div style={{ position: 'absolute', left: 18, bottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ffe8a3', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🫁</div>
          <div style={{ fontSize: 9, textAlign: 'center', marginTop: 2 }}>Дыхание</div>
        </div>
        <div style={{ position: 'absolute', left: 110, top: 150 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d4e8ff', border: '2px solid #1a1a1a', boxShadow: '0 0 0 4px #fff, 0 0 0 6px #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📔</div>
          <div style={{ fontSize: 9, textAlign: 'center', marginTop: 2, fontWeight: 700 }}>Журнал ←ты</div>
        </div>
        <div style={{ position: 'absolute', right: 30, top: 90 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', border: '2px dashed #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, opacity: 0.6 }}>🎁</div>
          <div style={{ fontSize: 9, textAlign: 'center', marginTop: 2, opacity: 0.6 }}>Посылки 🔒</div>
        </div>
        <div style={{ position: 'absolute', right: 10, top: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '2px dashed #1a1a1a', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
          <div style={{ fontSize: 9, textAlign: 'center', opacity: 0.5 }}>скоро</div>
        </div>
        {/* Mila cat floating */}
        <div style={{ position: 'absolute', right: 6, bottom: 6 }}>
          <MilaCat size={60}/>
        </div>
        {/* stars decoration */}
        <div style={{ position: 'absolute', left: 40, top: 30, fontSize: 12 }}>✦</div>
        <div style={{ position: 'absolute', left: 200, top: 10, fontSize: 10 }}>✧</div>
        <div style={{ position: 'absolute', left: 80, top: 80, fontSize: 8 }}>✦</div>
      </SketchBox>

      {/* SOS button */}
      <div style={{ position: 'absolute', bottom: 78, left: 14, right: 14 }}>
        <SketchBtn big fill="#ffd4d4" style={{ width: '100%', boxSizing: 'border-box' }}>
          🤗 Мне страшно — обними меня
        </SketchBtn>
      </div>

      <Note style={{ position: 'absolute', top: 50, right: -120, maxWidth: 110 }} arrow="left">
        каждая планета — это целая тема; открываются по ходу
      </Note>
    </div>
    <SketchBottomNav items={['🗺️','📔','🐱','🎁','⭐']} active={0}/>
  </SketchFrame>
);

const DirA_Journal = () => (
  <SketchFrame label="A · Журнал настроения">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'radial-gradient(circle at 70% 10%, #ffe8c8 0%, #fffdf7 60%)' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>← Как ты сегодня?</div>
      <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 10 }}>Выбери своё облачко</div>

      {/* mood clouds 3x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[['😊','радость'],['😢','грусть'],['😠','злость'],['😨','страх'],['😐','никак'],['🤗','тепло']].map(([e,l],i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <Cloud size={70} mood={e} style={{ margin: '0 auto' }}/>
            <div style={{ fontSize: 11, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* follow-up question */}
      <SketchBox style={{ marginTop: 14, background: '#fff' }} fill="#fff">
        <div style={{ fontSize: 12, fontWeight: 700 }}>🐱 Мила спрашивает:</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>"А где в теле ты чувствуешь это облачко?"</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
          {['в груди','в животе','в голове','в руках','не знаю'].map(t => <SketchChip key={t} fill="#f0ecff">{t}</SketchChip>)}
        </div>
      </SketchBox>

      <SketchBox style={{ marginTop: 10, minHeight: 70 }} dashed>
        <div style={{ fontSize: 11, opacity: 0.6 }}>🎨 нарисуй или напиши…</div>
        <ScribbleLines lines={3} widths={['90%','70%','40%']}/>
      </SketchBox>

      <div style={{ position: 'absolute', bottom: 80, left: 14, right: 14, display: 'flex', gap: 6 }}>
        <SketchBtn fill="#fff" style={{ flex: 1 }}>🎤 голос</SketchBtn>
        <SketchBtn fill="#ffe8a3" style={{ flex: 2 }}>✦ отправить Миле</SketchBtn>
      </div>

      <Note style={{ position: 'absolute', top: 80, left: -140, maxWidth: 130 }} arrow="right">
        разнообразие инпутов: эмодзи, чипы, рисунок, голос — чтобы ребёнок хотел рассказать
      </Note>
    </div>
    <SketchBottomNav items={['🗺️','📔','🐱','🎁','⭐']} active={1}/>
  </SketchFrame>
);

const DirA_Cat = () => (
  <SketchFrame label="A · Мила-сказочница (GigaChat)">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative',
      background: 'linear-gradient(180deg, #e8e1ff 0%, #fffdf7 80%)' }}>
      {/* cat hero */}
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <MilaCat size={90}/>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>Мила, кошка-сказочница</div>
        <div style={{ fontSize: 10, opacity: 0.6 }}>✦ мурлычет истории для спокойствия</div>
      </div>

      {/* chat */}
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
          <SketchBox fill="#fff" round={16} style={{ borderBottomLeftRadius: 4 }}>
            <div style={{ fontSize: 11 }}>Мурр! О чём рассказать сказку? 🌙</div>
          </SketchBox>
        </div>
        <div style={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
          <SketchBox fill="#ffe8a3" round={16} style={{ borderBottomRightRadius: 4 }}>
            <div style={{ fontSize: 11 }}>мне страшно идти спать</div>
          </SketchBox>
        </div>
        <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
          <SketchBox fill="#fff" round={16} style={{ borderBottomLeftRadius: 4 }}>
            <div style={{ fontSize: 11 }}>Знаешь, у меня тоже была такая ночь… жил лисёнок Тимка…</div>
            <Scribble width="95%"/><Scribble width="85%"/><Scribble width="60%"/>
          </SketchBox>
        </div>
      </div>

      {/* suggestion chips */}
      <div style={{ position: 'absolute', bottom: 130, left: 14, right: 14 }}>
        <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>или выбери тему:</div>
        <div>
          <SketchChip fill="#d4e8ff">про сон</SketchChip>
          <SketchChip fill="#ffd4d4">про страх</SketchChip>
          <SketchChip fill="#d4ffd4">про дружбу</SketchChip>
          <SketchChip fill="#ffe8a3">про маму</SketchChip>
        </div>
      </div>

      {/* input */}
      <div style={{ position: 'absolute', bottom: 82, left: 14, right: 14, display: 'flex', gap: 6 }}>
        <SketchBox style={{ flex: 1, padding: '10px 12px' }} round={999}>
          <span style={{ fontSize: 11, opacity: 0.5 }}>скажи Миле…</span>
        </SketchBox>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎤</div>
      </div>

      <Note style={{ position: 'absolute', top: 4, right: -130, maxWidth: 120 }} arrow="left">
        GigaChat подключается здесь. Системный промпт: «добрая кошка-сказочница для ребёнка 6-12»
      </Note>
    </div>
    <SketchBottomNav items={['🗺️','📔','🐱','🎁','⭐']} active={2}/>
  </SketchFrame>
);

const DirA_Parcel = () => (
  <SketchFrame label="A · Посылки спокойствия">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', position: 'relative', background: '#fffdf7' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <SketchBtn fill="#ffe8a3" style={{ flex: 1 }}>📬 мне</SketchBtn>
        <SketchBtn fill="#fff" style={{ flex: 1 }}>✉️ отправить</SketchBtn>
      </div>

      {/* incoming parcels */}
      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>ТЕБЕ ПРИШЛО 3 ПОСЫЛКИ ✦</div>
      {[
        ['Тима, 8 лет','попробуй вдох-выдох на 4 счёта','#ffe8a3'],
        ['Аня, 10 лет','нарисуй свой страх — он станет смешнее','#d4e8ff'],
        ['Миша, 7 лет','я представляю одеяло-облако 🦋','#ffd4e8'],
      ].map(([from, msg, c], i) => (
        <SketchBox key={i} fill={c} style={{ marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Parcel size={42}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, opacity: 0.7 }}>от {from}</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>"{msg}"</div>
            <div style={{ fontSize: 10, marginTop: 2 }}>
              <SketchChip fill="#fff" style={{ fontSize: 10 }}>открыть</SketchChip>
              <SketchChip fill="#fff" style={{ fontSize: 10 }}>спасибо ♥</SketchChip>
            </div>
          </div>
        </SketchBox>
      ))}

      <Note style={{ marginTop: 4 }}>
        Анонимно + премодерация (через GigaChat) — дети пишут от себя, но проверяются ИИ
      </Note>
    </div>
    <SketchBottomNav items={['🗺️','📔','🐱','🎁','⭐']} active={3}/>
  </SketchFrame>
);

const DirA_SOS = () => (
  <SketchFrame label="A · SOS «Мне страшно»">
    <div style={{ padding: 14, height: 'calc(100% - 38px)', background: 'linear-gradient(180deg, #ffd4d4 0%, #fff 60%)' }}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>← назад</div>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <MilaCat size={80}/>
        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>Я с тобой.</div>
        <div style={{ fontSize: 12, marginTop: 2 }}>Дыши вместе со мной</div>
      </div>

      {/* breathing circle */}
      <div style={{ margin: '20px auto', width: 180, height: 180, borderRadius: '50%', border: '3px solid #1a1a1a', background: 'radial-gradient(circle, #fff 0%, #ffe8a3 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 #1a1a1a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>вдох</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>4 сек</div>
        </div>
      </div>

      <SketchBtn big fill="#d4e8ff" style={{ width: '100%', boxSizing: 'border-box', marginBottom: 8 }}>
        📞 8-800-2000-122 · позвонить другу
      </SketchBtn>
      <SketchBtn fill="#fff" style={{ width: '100%', boxSizing: 'border-box' }}>
        👨‍👩‍👧 позвать маму или папу
      </SketchBtn>

      <Note style={{ marginTop: 8 }}>
        Без алармов: сначала дыхание с котом, потом мягко телефон доверия
      </Note>
    </div>
  </SketchFrame>
);

const DirA_Parent = () => (
  <SketchFrame label="A · Родительский режим">
    <div style={{ padding: '8px 14px', height: 'calc(100% - 38px)', background: '#f6f3ee' }}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>🔒 вход по пин-коду родителя</div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>Соня · 8 лет</div>

      <SketchBox fill="#fff" style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>за неделю</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'flex-end', height: 60 }}>
          {[30,55,20,70,40,60,35].map((h,i) => (
            <div key={i} style={{ flex: 1, background: '#ffe8a3', border: '2px solid #1a1a1a', height: h, borderRadius: '4px 4px 0 0' }}/>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: 9, marginTop: 2, justifyContent: 'space-between' }}>
          {['пн','вт','ср','чт','пт','сб','вс'].map(d => <span key={d}>{d}</span>)}
        </div>
      </SketchBox>

      <SketchBox fill="#fff" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>облака настроений</div>
        <div style={{ marginTop: 6 }}>
          {[['😊',8],['😢',3],['😨',2],['🤗',5]].map(([e,c],i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{e}</span>
              <div style={{ flex: 1, height: 10, background: '#f0ecff', border: '1.5px solid #1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c*10}%`, background: '#1a1a1a' }}/>
              </div>
              <span style={{ fontSize: 10 }}>{c}×</span>
            </div>
          ))}
        </div>
      </SketchBox>

      <SketchBox fill="#fff3d9" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11 }}>⚠️ на этой неделе 2 раза открывал SOS — может, поговорите?</div>
      </SketchBox>

      <Note style={{ marginTop: 8 }}>
        Родитель не читает записи ребёнка — только агрегаты, чтобы сохранить доверие
      </Note>
    </div>
  </SketchFrame>
);

Object.assign(window, { DirA_Home, DirA_Journal, DirA_Cat, DirA_Parcel, DirA_SOS, DirA_Parent });
