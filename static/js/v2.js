// Мир Спокойствия V2 — hamburger + breathing + charts
(function(){
  'use strict';

  function setupHamburger(){
    var nav = document.querySelector('nav .nav-container');
    var links = document.querySelector('.nav-links');
    if(!nav || !links) return;
    var btn = document.querySelector('.mobile-menu-toggle');
    if(!btn){
      btn = document.createElement('button');
      btn.className = 'mobile-menu-toggle';
      btn.setAttribute('aria-label', 'Меню');
      btn.innerHTML = '<i class="fas fa-bars"></i>';
      nav.appendChild(btn);
    }
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = links.classList.toggle('open');
      btn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    document.addEventListener('click', function(e){
      if(!links.classList.contains('open')) return;
      if(!links.contains(e.target) && !btn.contains(e.target)){
        links.classList.remove('open');
        btn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){
        links.classList.remove('open');
        btn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // === Улучшенная дыхательная анимация ===
  window.startBreathingOrb = function(technique){
    // technique: '4-7-8' | 'square' | 'diaphragm'
    var orb = document.querySelector('.breathing-orb');
    if(!orb) return;
    var phases = {
      '4-7-8': [
        {text: '🫁 Вдох', cls: 'inhale', duration: 4000},
        {text: '⏸ Задержка', cls: 'hold', duration: 7000},
        {text: '🌬 Выдох', cls: 'exhale', duration: 8000}
      ],
      'square': [
        {text: '🫁 Вдох', cls: 'inhale', duration: 4000},
        {text: '⏸ Задержка', cls: 'hold', duration: 4000},
        {text: '🌬 Выдох', cls: 'exhale', duration: 4000},
        {text: '⏸ Пауза', cls: '', duration: 4000}
      ],
      'diaphragm': [
        {text: '🫁 Глубокий вдох', cls: 'inhale', duration: 5000},
        {text: '🌬 Медленный выдох', cls: 'exhale', duration: 6000}
      ]
    };
    var seq = phases[technique] || phases['4-7-8'];
    orb.dataset.active = '1';
    var i = 0;
    function step(){
      if(orb.dataset.active !== '1') return;
      var p = seq[i % seq.length];
      orb.className = 'breathing-orb ' + p.cls;
      orb.textContent = p.text;
      i++;
      setTimeout(step, p.duration);
    }
    step();
  };
  window.stopBreathingOrb = function(){
    var orb = document.querySelector('.breathing-orb');
    if(!orb) return;
    orb.dataset.active = '0';
    orb.className = 'breathing-orb';
    orb.textContent = '💙 Готов';
  };

  // === Выделение выбранной кнопки стресса ===
  function setupStressButtons(){
    var btns = document.querySelectorAll('.stress-btn');
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.classList.remove('selected'); });
        b.classList.add('selected');
      });
    });
  }

  // === Chart.js графики на странице статистики ===
  function loadChartJs(cb){
    if(window.Chart){ cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function initCharts(){
    if(!document.getElementById('stress-chart-v2') &&
       !document.querySelector('[data-stats-v2]')) return;
    loadChartJs(function(){
      fetch('/tranquility/api/stats')
        .then(function(r){ return r.json(); })
        .then(function(resp){
          if(!resp || resp.status !== 'success') return;
          var d = resp.data;
          renderStressChart(d.stress_logs_data || []);
          renderMoodChart(d.mood_distribution || {});
          renderTechniquesChart(d.techniques_stats || {});
          updateKPIs(d);
        }).catch(function(err){ console.warn('stats fetch', err); });
    });
  }

  function renderStressChart(logs){
    var canvas = document.getElementById('stress-chart-v2');
    if(!canvas || !logs.length) return;
    var labels = logs.map(function(l){
      var d = new Date(l.timestamp);
      return d.getDate() + '.' + (d.getMonth()+1);
    });
    var data = logs.map(function(l){ return l.level; });
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Уровень стресса',
          data: data,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: function(ctx){
            var v = ctx.parsed && ctx.parsed.y;
            return v >= 7 ? '#ef4444' : v >= 4 ? '#f59e0b' : '#10b981';
          },
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e2e8f0', font: { family: 'Montserrat', weight: '600' } } },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            borderColor: '#60a5fa', borderWidth: 1,
            padding: 12, cornerRadius: 12
          }
        },
        scales: {
          y: {
            min: 0, max: 10,
            ticks: { color: '#94a3b8', stepSize: 2 },
            grid: { color: 'rgba(255,255,255,0.08)' }
          },
          x: {
            ticks: { color: '#94a3b8', maxRotation: 45 },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderMoodChart(moodDist){
    var canvas = document.getElementById('mood-chart-v2');
    if(!canvas) return;
    var labels = Object.keys(moodDist);
    if(!labels.length) return;
    var values = labels.map(function(k){ return moodDist[k]; });
    var colors = ['#10b981','#60a5fa','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: 'rgba(15,23,42,0.6)',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e2e8f0', font: { family: 'Montserrat' }, padding: 12 } },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            padding: 12, cornerRadius: 12
          }
        }
      }
    });
  }

  function renderTechniquesChart(t){
    var canvas = document.getElementById('techniques-chart-v2');
    if(!canvas) return;
    var labels = Object.keys(t);
    if(!labels.length) return;
    var values = labels.map(function(k){ return t[k]; });
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Использований',
          data: values,
          backgroundColor: 'rgba(139,92,246,0.6)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#e2e8f0' }, grid: { display: false } }
        }
      }
    });
  }

  function updateKPIs(d){
    function set(id, val){
      var el = document.getElementById(id);
      if(el) el.textContent = val;
    }
    set('kpi-journal', d.journal_entries_count || 0);
    set('kpi-stress', d.stress_logs_count || 0);
    set('kpi-forms', d.questionnaires_count || 0);
    set('kpi-reduction', (d.avg_stress_reduction || 0) + ' / 10');
  }

  function init(){
    setupHamburger();
    setupStressButtons();
    initCharts();
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
