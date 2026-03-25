/* ============================================
   SOCIAL MEDIA TRACKER — APP LOGIC
   ============================================ */

let appData = { platforms: [], snapshots: [] };
let followerChart = null;
let engagementChart = null;
let activeFilter = 'all';

// ─── INIT ────────────────────────────────────────────────────────────────────

async function init() {
  await loadData();
  renderAll();
  bindEvents();
  setTodayDate();
}

async function loadData() {
  const res = await fetch('/api/data');
  appData = await res.json();
}

function renderAll() {
  renderHeroStats();
  renderFollowerChart();
  renderEngagementChart();
  renderGoals();
  renderHistory();
  updateHeaderDate();
}

// ─── HEADER DATE ─────────────────────────────────────────────────────────────

function updateHeaderDate() {
  const el = document.getElementById('headerDate');
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  }).toUpperCase();
}

function setTodayDate() {
  const d = new Date();
  const local = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  document.getElementById('inputDate').value = local;
}

// ─── HERO STATS ──────────────────────────────────────────────────────────────

function renderHeroStats() {
  const snaps = appData.snapshots;
  if (!snaps.length) return;

  const latest = snaps[snaps.length - 1];
  const prev   = snaps.length > 1 ? snaps[snaps.length - 2] : null;
  const platforms = appData.platforms;

  // Total audience
  const total = platforms.reduce((sum, p) => sum + (latest.followers[p.id] || 0), 0);
  document.getElementById('statTotal').textContent = formatNum(total);

  if (prev) {
    const prevTotal = platforms.reduce((sum, p) => sum + (prev.followers[p.id] || 0), 0);
    const diff = total - prevTotal;
    const deltaEl = document.getElementById('statTotalDelta');
    deltaEl.textContent = (diff >= 0 ? '+' : '') + formatNum(diff) + ' since last snapshot';
    deltaEl.className = 'stat-delta ' + (diff >= 0 ? 'positive' : 'negative');
  }

  // Avg engagement
  const engValues = platforms
    .map(p => latest.engagement?.[p.id])
    .filter(v => v !== null && v !== undefined && v !== '');
  if (engValues.length) {
    const avg = engValues.reduce((a, b) => a + Number(b), 0) / engValues.length;
    document.getElementById('statEngagement').textContent = avg.toFixed(1) + '%';
  } else {
    document.getElementById('statEngagement').textContent = '—';
  }

  // Top platform
  let top = platforms[0];
  platforms.forEach(p => {
    if ((latest.followers[p.id] || 0) > (latest.followers[top.id] || 0)) top = p;
  });
  document.getElementById('statTopPlatform').textContent = top.name.toUpperCase();
  document.getElementById('statTopCount').textContent = formatNum(latest.followers[top.id] || 0) + ' followers';

  // Fastest growing (by absolute change)
  if (prev) {
    let fastest = platforms[0];
    let maxGrowth = -Infinity;
    platforms.forEach(p => {
      const growth = (latest.followers[p.id] || 0) - (prev.followers[p.id] || 0);
      if (growth > maxGrowth) { maxGrowth = growth; fastest = p; }
    });
    document.getElementById('statFastest').textContent = fastest.name.toUpperCase();
    document.getElementById('statFastestRate').textContent =
      (maxGrowth >= 0 ? '+' : '') + formatNum(maxGrowth) + ' since last snapshot';
  } else {
    document.getElementById('statFastest').textContent = '—';
    document.getElementById('statFastestRate').textContent = 'needs 2+ snapshots';
  }
}

// ─── FOLLOWER CHART ───────────────────────────────────────────────────────────

function getPlatformsForFilter(filter) {
  const platforms = appData.platforms;
  const latest = appData.snapshots[appData.snapshots.length - 1];
  if (!latest) return platforms;

  if (filter === 'all') return platforms;

  const sorted = [...platforms].sort((a, b) =>
    (latest.followers[b.id] || 0) - (latest.followers[a.id] || 0)
  );

  if (filter === 'top3') return sorted.slice(0, 3);
  if (filter === 'small') return sorted.slice(3);
  return platforms;
}

function renderFollowerChart() {
  const snaps = appData.snapshots;
  if (!snaps.length) return;

  const filtered = getPlatformsForFilter(activeFilter);
  const labels = snaps.map(s => s.date);

  const datasets = filtered.map(p => ({
    label: p.name,
    data: snaps.map(s => ({ x: s.date, y: s.followers[p.id] || 0 })),
    borderColor: p.color,
    backgroundColor: p.color + '18',
    borderWidth: 2,
    pointRadius: snaps.length <= 10 ? 4 : 2,
    pointHoverRadius: 6,
    tension: 0.3,
    fill: false,
  }));

  const ctx = document.getElementById('followerChart').getContext('2d');

  if (followerChart) followerChart.destroy();

  followerChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#7A7268',
            font: { family: 'DM Mono', size: 10 },
            boxWidth: 12,
            boxHeight: 2,
            padding: 16,
            usePointStyle: true,
            pointStyle: 'line',
          }
        },
        tooltip: {
          backgroundColor: '#181818',
          borderColor: '#222222',
          borderWidth: 1,
          titleColor: '#7A7268',
          bodyColor: '#F0EAE0',
          titleFont: { family: 'DM Mono', size: 10 },
          bodyFont: { family: 'DM Mono', size: 12 },
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${formatNum(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { day: 'MMM d' } },
          grid: { color: '#1A1A1A' },
          ticks: { color: '#3A3530', font: { family: 'DM Mono', size: 10 }, maxTicksLimit: 8 }
        },
        y: {
          grid: { color: '#1A1A1A' },
          ticks: {
            color: '#3A3530',
            font: { family: 'DM Mono', size: 10 },
            callback: v => formatNum(v)
          }
        }
      }
    }
  });

  // fix height after render
  const wrap = document.querySelector('.chart-block--wide .chart-wrap');
  wrap.style.height = '320px';
}

// ─── ENGAGEMENT CHART ─────────────────────────────────────────────────────────

function renderEngagementChart() {
  const snaps = appData.snapshots;
  const platforms = appData.platforms;

  const hasEngagement = snaps.some(s =>
    platforms.some(p => s.engagement?.[p.id] !== null && s.engagement?.[p.id] !== undefined && s.engagement?.[p.id] !== '')
  );

  const ctx = document.getElementById('engagementChart').getContext('2d');
  const wrap = document.getElementById('engagementChart').parentElement;
  wrap.style.height = '320px';

  if (engagementChart) engagementChart.destroy();

  if (!hasEngagement) {
    engagementChart = new Chart(ctx, {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { grid: { color: '#1A1A1A' }, ticks: { color: '#3A3530', font: { family: 'DM Mono', size: 10 } } },
          y: { grid: { color: '#1A1A1A' }, ticks: { color: '#3A3530', font: { family: 'DM Mono', size: 10 } } }
        }
      },
      plugins: [{
        id: 'emptyMsg',
        afterDraw(chart) {
          const { ctx: c, width, height } = chart;
          c.save();
          c.fillStyle = '#3A3530';
          c.font = '11px DM Mono';
          c.textAlign = 'center';
          c.fillText('Enter engagement rates when saving snapshots', width / 2, height / 2 - 8);
          c.fillText('to see trends here', width / 2, height / 2 + 12);
          c.restore();
        }
      }]
    });
    return;
  }

  const datasets = platforms
    .filter(p => snaps.some(s => s.engagement?.[p.id] !== null && s.engagement?.[p.id] !== undefined && s.engagement?.[p.id] !== ''))
    .map(p => ({
      label: p.name,
      data: snaps
        .filter(s => s.engagement?.[p.id] !== null && s.engagement?.[p.id] !== undefined && s.engagement?.[p.id] !== '')
        .map(s => ({ x: s.date, y: Number(s.engagement[p.id]) })),
      borderColor: p.color,
      backgroundColor: p.color + '18',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: false,
    }));

  engagementChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#7A7268',
            font: { family: 'DM Mono', size: 10 },
            boxWidth: 12,
            boxHeight: 2,
            padding: 14,
            usePointStyle: true,
            pointStyle: 'line',
          }
        },
        tooltip: {
          backgroundColor: '#181818',
          borderColor: '#222222',
          borderWidth: 1,
          titleColor: '#7A7268',
          bodyColor: '#F0EAE0',
          titleFont: { family: 'DM Mono', size: 10 },
          bodyFont: { family: 'DM Mono', size: 12 },
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { day: 'MMM d' } },
          grid: { color: '#1A1A1A' },
          ticks: { color: '#3A3530', font: { family: 'DM Mono', size: 10 }, maxTicksLimit: 6 }
        },
        y: {
          grid: { color: '#1A1A1A' },
          ticks: {
            color: '#3A3530',
            font: { family: 'DM Mono', size: 10 },
            callback: v => v.toFixed(1) + '%'
          }
        }
      }
    }
  });
}

// ─── GOAL PROGRESS ────────────────────────────────────────────────────────────

function renderGoals() {
  const container = document.getElementById('goalsGrid');
  const platforms = appData.platforms;
  const snaps = appData.snapshots;

  if (!snaps.length) {
    container.innerHTML = '<p style="color:var(--text-secondary);font-family:var(--font-mono);font-size:12px;">No snapshots yet.</p>';
    return;
  }

  const latest = snaps[snaps.length - 1];

  container.innerHTML = platforms.map(p => {
    const current = latest.followers[p.id] || 0;
    const goal    = p.goal || 0;
    const pct     = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    const needed  = Math.max(goal - current, 0);

    // Estimate completion from growth velocity (last available multi-point window)
    let eta = '';
    if (current >= goal) {
      eta = 'GOAL ACHIEVED';
    } else if (snaps.length >= 2) {
      const windowSize = Math.min(snaps.length, 6);
      const old = snaps[snaps.length - windowSize];
      const daysDiff = dateDiffDays(old.date, latest.date);
      const growthPerDay = daysDiff > 0
        ? ((latest.followers[p.id] || 0) - (old.followers[p.id] || 0)) / daysDiff
        : 0;

      if (growthPerDay > 0) {
        const daysLeft = needed / growthPerDay;
        const etaDate = new Date(latest.date);
        etaDate.setDate(etaDate.getDate() + Math.ceil(daysLeft));
        eta = 'est. ' + etaDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else if (growthPerDay <= 0) {
        eta = 'no recent growth';
      }
    } else {
      eta = 'needs 2+ snapshots';
    }

    const achieved = current >= goal;

    return `
      <div class="goal-card">
        <div class="goal-platform" style="color:${p.color}">${p.name.toUpperCase()}</div>
        <div class="goal-current">${formatNum(current)}</div>
        <div class="goal-target">goal: <span>${formatNum(goal)}</span></div>
        <div class="goal-bar-track">
          <div class="goal-bar-fill" style="width:${pct}%;background:${p.color}"></div>
        </div>
        <div class="goal-pct">${pct.toFixed(1)}% complete</div>
        <div class="goal-eta ${achieved ? 'achieved' : ''}">${eta}</div>
      </div>
    `;
  }).join('');
}

// ─── SNAPSHOT HISTORY ────────────────────────────────────────────────────────

function renderHistory() {
  const snaps = [...appData.snapshots].reverse();
  const platforms = appData.platforms;

  document.getElementById('snapshotCount').textContent =
    snaps.length + ' SNAPSHOT' + (snaps.length !== 1 ? 'S' : '');

  // Build header
  const head = document.getElementById('historyHead');
  head.innerHTML = `<tr>
    <th>DATE</th>
    <th>LABEL</th>
    ${platforms.map(p => `<th style="color:${p.color}">${p.name.toUpperCase()}</th>`).join('')}
    <th style="color:var(--terracotta)">TOTAL</th>
    <th></th>
  </tr>`;

  // Build rows
  const body = document.getElementById('historyBody');
  body.innerHTML = snaps.map((snap, i) => {
    // prev is the next in reversed array (i+1), which is actually the one before in time
    const prevSnap = snaps[i + 1] || null;

    const total = platforms.reduce((s, p) => s + (snap.followers[p.id] || 0), 0);
    const prevTotal = prevSnap ? platforms.reduce((s, p) => s + (prevSnap.followers[p.id] || 0), 0) : null;

    const cells = platforms.map(p => {
      const val  = snap.followers[p.id] ?? '—';
      const prev = prevSnap ? (prevSnap.followers[p.id] || 0) : null;
      const diff = prev !== null && val !== '—' ? val - prev : null;
      const deltaHtml = diff !== null
        ? `<span class="row-delta ${diff > 0 ? 'up' : diff < 0 ? 'down' : ''}">${diff > 0 ? '+' : ''}${formatNum(diff)}</span>`
        : '';
      return `<td>${val !== '—' ? formatNum(val) : '—'}${deltaHtml}</td>`;
    }).join('');

    const totalDiff = prevTotal !== null ? total - prevTotal : null;
    const totalDeltaHtml = totalDiff !== null
      ? `<span class="row-delta ${totalDiff > 0 ? 'up' : totalDiff < 0 ? 'down' : ''}">${totalDiff > 0 ? '+' : ''}${formatNum(totalDiff)}</span>`
      : '';

    return `<tr>
      <td>${formatDate(snap.date)}</td>
      <td>${snap.label || ''}</td>
      ${cells}
      <td class="td-total">${formatNum(total)}${totalDeltaHtml}</td>
      <td><button class="btn-delete" title="Delete snapshot" onclick="deleteSnapshot('${snap.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

// ─── MODAL: DATA ENTRY ────────────────────────────────────────────────────────

function openModal() {
  const overlay = document.getElementById('modalOverlay');
  const fGrid   = document.getElementById('followersGrid');
  const eGrid   = document.getElementById('engagementGrid');
  const snaps   = appData.snapshots;
  const latest  = snaps.length ? snaps[snaps.length - 1] : null;

  // Pre-fill follower inputs with latest values
  fGrid.innerHTML = appData.platforms.map(p => `
    <div class="platform-input-group">
      <label class="platform-input-label">
        <span class="platform-dot" style="background:${p.color}"></span>
        ${p.name.toUpperCase()}
      </label>
      <input type="number" class="form-input" id="f_${p.id}"
        value="${latest ? (latest.followers[p.id] || '') : ''}"
        placeholder="0" min="0"
        oninput="calcEngagementPreview('${p.id}')" />
    </div>
  `).join('');

  eGrid.innerHTML = appData.platforms.map(p => {
    const prevLikes    = latest?.likes?.[p.id]    ?? '';
    const prevComments = latest?.comments?.[p.id] ?? '';
    return `
    <div class="platform-input-group engagement-input-group">
      <div class="engagement-label-row">
        <span class="platform-input-label">
          <span class="platform-dot" style="background:${p.color}"></span>
          ${p.name.toUpperCase()}
        </span>
        <span class="engagement-rate-preview" id="er_${p.id}"></span>
      </div>
      <div class="engagement-subfields">
        <input type="number" class="form-input engagement-sub" id="likes_${p.id}"
          value="${prevLikes}" placeholder="likes" min="0"
          oninput="calcEngagementPreview('${p.id}')" />
        <input type="number" class="form-input engagement-sub" id="comments_${p.id}"
          value="${prevComments}" placeholder="comments" min="0"
          oninput="calcEngagementPreview('${p.id}')" />
      </div>
    </div>
  `;}).join('');

  // seed previews for pre-filled values
  appData.platforms.forEach(p => calcEngagementPreview(p.id));

  setTodayDate();
  overlay.classList.add('open');
}

function calcEngagementPreview(platformId) {
  const fEl = document.getElementById('f_' + platformId);
  const lEl = document.getElementById('likes_' + platformId);
  const cEl = document.getElementById('comments_' + platformId);
  const preview = document.getElementById('er_' + platformId);
  if (!preview) return;

  const followers = fEl ? Number(fEl.value) : 0;
  const likes     = lEl && lEl.value !== '' ? Number(lEl.value) : 0;
  const comments  = cEl && cEl.value !== '' ? Number(cEl.value) : 0;

  if (followers > 0 && (lEl?.value !== '' || cEl?.value !== '')) {
    const rate = ((likes + comments) / followers) * 100;
    preview.textContent = rate.toFixed(2) + '%';
    preview.style.color = 'var(--gold)';
  } else {
    preview.textContent = '';
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

async function saveSnapshot() {
  const date  = document.getElementById('inputDate').value;
  const label = document.getElementById('inputLabel').value.trim();

  if (!date) { showToast('Please select a date', 'error'); return; }

  const followers  = {};
  const engagement = {};
  const likes      = {};
  const comments   = {};

  appData.platforms.forEach(p => {
    const fVal = document.getElementById('f_' + p.id).value;
    const lVal = document.getElementById('likes_' + p.id).value;
    const cVal = document.getElementById('comments_' + p.id).value;

    const followerCount = fVal !== '' ? Number(fVal) : null;
    const likeCount     = lVal !== '' ? Number(lVal) : null;
    const commentCount  = cVal !== '' ? Number(cVal) : null;

    followers[p.id] = followerCount;
    likes[p.id]     = likeCount;
    comments[p.id]  = commentCount;

    if (followerCount && followerCount > 0 && (likeCount !== null || commentCount !== null)) {
      const totalEngagements = (likeCount || 0) + (commentCount || 0);
      engagement[p.id] = parseFloat(((totalEngagements / followerCount) * 100).toFixed(2));
    } else {
      engagement[p.id] = null;
    }
  });

  try {
    const res = await fetch('/api/snapshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, label, followers, engagement, likes, comments })
    });

    if (!res.ok) throw new Error('Save failed');

    closeModal();
    await loadData();
    renderAll();
    showToast('Snapshot saved', 'success');
  } catch (e) {
    showToast('Error saving snapshot', 'error');
  }
}

// ─── DELETE SNAPSHOT ─────────────────────────────────────────────────────────

async function deleteSnapshot(id) {
  if (!confirm('Delete this snapshot?')) return;

  try {
    const res = await fetch(`/api/snapshots/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    await loadData();
    renderAll();
    showToast('Snapshot deleted', 'success');
  } catch {
    showToast('Error deleting snapshot', 'error');
  }
}

// ─── GOALS MODAL ─────────────────────────────────────────────────────────────

function openGoalsModal() {
  const grid = document.getElementById('goalsEditGrid');
  grid.innerHTML = appData.platforms.map(p => `
    <div class="platform-input-group">
      <label class="platform-input-label">
        <span class="platform-dot" style="background:${p.color}"></span>
        ${p.name.toUpperCase()} GOAL
      </label>
      <input type="number" class="form-input" id="goal_${p.id}"
        value="${p.goal || ''}" placeholder="target followers" min="0" />
    </div>
  `).join('');

  document.getElementById('goalsModalOverlay').classList.add('open');
}

function closeGoalsModal() {
  document.getElementById('goalsModalOverlay').classList.remove('open');
}

async function saveGoals() {
  const platforms = appData.platforms.map(p => ({
    ...p,
    goal: Number(document.getElementById('goal_' + p.id).value) || p.goal
  }));

  try {
    const res = await fetch('/api/platforms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platforms })
    });
    if (!res.ok) throw new Error();
    closeGoalsModal();
    await loadData();
    renderAll();
    showToast('Goals updated', 'success');
  } catch {
    showToast('Error saving goals', 'error');
  }
}

// ─── CHART FILTER ─────────────────────────────────────────────────────────────

function bindChartFilters() {
  document.querySelectorAll('.chart-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderFollowerChart();
    });
  });
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

function bindEvents() {
  document.getElementById('openEntryBtn').addEventListener('click', openModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  document.getElementById('saveBtn').addEventListener('click', saveSnapshot);

  document.getElementById('editGoalsBtn').addEventListener('click', openGoalsModal);
  document.getElementById('goalsModalClose').addEventListener('click', closeGoalsModal);
  document.getElementById('goalsCancelBtn').addEventListener('click', closeGoalsModal);
  document.getElementById('goalsSaveBtn').addEventListener('click', saveGoals);

  // Close modals on overlay click
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('goalsModalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeGoalsModal();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeGoalsModal(); }
    if (e.key === 'Enter' && document.getElementById('modalOverlay').classList.contains('open')) {
      saveSnapshot();
    }
  });

  bindChartFilters();
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => toast.classList.add('visible'));

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function formatNum(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString('en-US');
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function dateDiffDays(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = new Date(ay, am - 1, ad);
  const db = new Date(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────

init();
