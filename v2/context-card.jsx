/* Shared: story intro, context card */

const ContextCard = () => (
  <div style={{
    width: 720, padding: 30, background: '#fffdf7',
    border: '2.5px solid #1a1a1a', borderRadius: 24, boxShadow: '6px 6px 0 #1a1a1a',
    fontFamily: 'var(--sketch-hand)', color: '#1a1a1a', lineHeight: 1.45,
  }}>
    <div style={{ fontSize: 28, fontWeight: 800 }}>Детская версия · «Мир спокойствия»</div>
    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>вайрфреймы · 3 направления · april 2026</div>

    <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>🎯 Задача</div>
        <div style={{ fontSize: 14 }}>Переделать взрослое приложение-антистресс под детей 6-12 лет: мягче визуально, проще в использовании, mobile-first, с ИИ-котом «Милой» (GigaChat)</div>
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>📖 Легенда</div>
        <div style={{ fontSize: 14 }}>Дети отправляют друг другу «посылки спокойствия» — советы, которые помогли им самим. Дети помогают детям</div>
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>🐱 Мила</div>
        <div style={{ fontSize: 14 }}>Волшебный кот со звёздочкой на лбу. Роль: сказочница. На GigaChat — генерирует сказки по запросу, модерирует детские посылки</div>
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>🧭 Что отличает направления</div>
        <div style={{ fontSize: 14 }}>A — геймификация (карта мира). B — интимный дневник (всё вокруг записей). C — социальная терапия (почта между детьми)</div>
      </div>
    </div>

    <div style={{ marginTop: 18, padding: 14, background: '#fff3d9', border: '2px dashed #b7a04f', borderRadius: 12, fontSize: 13 }}>
      <b>💡 Как смотреть:</b> пролистывай три ряда и сравнивай. Каждый экран — 360×640 (мобилка).
      Когда выберешь направление — соберу его в hi-fi с реальным визуалом и подключённым GigaChat.
    </div>

    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13 }}>
      <SketchChip fill="#ffe8a3">смешанная ауд. 6-12</SketchChip>
      <SketchChip fill="#d4e8ff">mobile-first</SketchChip>
      <SketchChip fill="#ffd4e8">пастель + фэнтези</SketchChip>
      <SketchChip fill="#d4ffd4">ИИ-кот «Мила»</SketchChip>
      <SketchChip fill="#e0d4ff">родительский режим</SketchChip>
    </div>
  </div>
);

Object.assign(window, { ContextCard });
