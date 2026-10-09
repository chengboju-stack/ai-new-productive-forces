'use strict';
/* ==========================================================================
   charts.js · 小图表渲染器 + 数据规格
   ── 只使用 data/metrics.csv 中已有的数值，不引入任何新数据。
   ── 每个数据点都带：数值、年份、来源、解释边界（与站点既有口径一致）。
   ── 图形几何严格按数值缩放；宽度/高度由渲染器计算，便于校验。
   ========================================================================== */
(() => {
  const HAI26E = 'Stanford HAI《2026 AI Index》Economy';
  const HAI25E = 'Stanford HAI《2025 AI Index》Economy';
  const IFR = 'IFR《World Robotics 2026》';
  const IEA = 'IEA《Key Questions on Energy and AI》';
  const NBER = 'NBER / QJE《Generative AI at Work》';
  const HAI26S = 'Stanford HAI《2026 AI Index》Science';

  // type: hbars | columns | range | rows
  const SPECS = {
    /* ── 03 影响尺度：四个尺度各一张图 ── */
    'scale-person': {
      type: 'hbars', unit: '%', max: 40, ticks: [0, 10, 20, 30, 40],
      title: '同一项现场研究里的两个分组',
      bars: [
        { label: '新手与低技能人员', sub: '每小时解决问题数变化', value: 34, year: '研究期间', src: NBER, limit: '单一客服场景的分组结果，不可推广为所有行业' },
        { label: '全体人员平均', sub: '每小时解决问题数变化', value: 14, year: '研究期间', src: NBER, limit: '样本 5,179 名客服人员，属特定工作现场' },
      ],
      note: '<b>同一项研究</b>内的两个分组，可以直接比较：经验较少的人获益更明显。资深人员受影响较小，报告未给出具体数值。',
      srcLine: NBER + ' · 5,179 名客服人员',
    },
    'scale-org': {
      type: 'hbars', unit: '%', max: 100, ticks: [0, 25, 50, 75, 100],
      title: '组织层面的三个采用率',
      bars: [
        { label: '使用 AI 的组织', sub: '2025 年受访组织', value: 88, year: '2025', src: HAI26E, limit: '调查采用率，不等于已实现的生产率提升' },
        { label: '至少一个职能使用生成式 AI', sub: '2025 年受访组织', value: 70, year: '2025', src: HAI26E, limit: '采用不等于流程重组' },
        { label: '广泛部署 AI Agent 的职能', sub: '2025 年，定性范围', value: 5, display: '个位数', year: '2025', src: HAI26E, limit: '报告为「几乎所有业务职能处于个位数」的定性范围，非精确值' },
      ],
      note: '三项来自<b>同一份调查</b>，口径一致，但不构成严格漏斗。「接入工具」与「重新设计流程」之间的距离，正是这张图要说明的。',
      srcLine: HAI26E + ' · 2025 年调查',
    },
    'scale-industry': {
      type: 'rows', title: '实体产业的四个部署指标',
      rows: [
        { name: '全球在役工业机器人', value: '5.0', unit: 'million 台', badge: '+9%', year: '2025', src: IFR, limit: '存量是部署指标，不代表 AI 的因果效果' },
        { name: '全球新安装工业机器人', value: '>600,000', unit: '台', badge: '+11%', year: '2025', src: IFR, limit: '安装流量，与存量口径不同' },
        { name: '中国新安装工业机器人', value: '354,000', unit: '台', badge: '+20%', year: '2025', src: IFR, limit: '部署量；不区分其中 AI 的份额' },
        { name: '中国占全球新安装量', value: '59', unit: '%', badge: '', year: '2025', src: IFR, limit: '占安装量比例，不是工业增加值比例' },
        { name: '专业服务机器人出货', value: '≈250,000', unit: '台', badge: '+24%', year: '2025', src: IFR + ' Service Robots', limit: '出货量不等于生产力或质量影响' },
      ],
      note: '全部为<b>部署类指标</b>：说明自动化正在推进，但不能直接当作 AI 带来的产出提升。',
      srcLine: IFR,
    },
    'scale-system': {
      type: 'columns', unit: 'TWh', max: 1000, ticks: [0, 250, 500, 750, 1000],
      title: '数据中心用电：估计与展望',
      cols: [
        { label: '2025', sub: '估计', value: 485, kind: 'ref', year: '2025', src: IEA, limit: '包含 AI 与其他数字服务' },
        { label: '2030', sub: '展望 · 预测', value: 950, kind: 'main', year: '2030', src: IEA, limit: '2030 为情景预测，非已发生数据；包含 AI 以外需求，不全部归因于 AI' },
      ],
      delta: '≈ 2×',
      note: '实线柱为<b>最新年度估计</b>，虚线柱为<b>未来预测</b>；两者性质不同，不能当作同一条既成趋势。',
      srcLine: IEA,
    },

    /* ── 05 科研前沿：补齐两个缺图的信号 ── */
    'frontier-publications': {
      type: 'columns', unit: '指数（2024=100）', max: 130, ticks: [0, 50, 100, 130],
      title: '自然科学 AI 相关论文量的变化',
      cols: [
        { label: '2024', sub: '基线', value: 100, kind: 'ref', year: '2024', src: HAI26S, limit: '指数基线；2024 绝对值未在报告中给出' },
        { label: '2025', sub: '约 80,150 篇', value: 126, kind: 'main', year: '2025', src: HAI26S, limit: '论文数量是研究活动指标，不等于发现质量' },
      ],
      delta: '+26%',
      note: '报告给出 2025 年约 <b>80,150 篇</b>、同比增长 26%。2024 年绝对值未列出，因此用<b>指数</b>（2024 记为 100）呈现增长，而不是编造篇数。',
      srcLine: HAI26S,
    },
    'frontier-weather': {
      type: 'range', unit: '相对用时（FourCastNet 3 = 1×）', max: 60, ticks: [1, 10, 20, 30, 40, 50, 60],
      title: '生成 60 天全球预测的相对用时',
      rows: [
        { label: 'FourCastNet 3', sub: '不到 4 分钟', point: 1, year: '报告版本', src: HAI26S, limit: '特定天气模型与流程' },
        { label: '先前方法', sub: '快 8–60 倍', range: [8, 60], year: '报告版本', src: HAI26S, limit: '区间取决于比较方法，不代表预测质量' },
      ],
      note: '越短越快。这是<b>特定天气预测系统</b>的速度区间，不是所有科研任务的统一提速。',
      srcLine: HAI26S,
    },
    'frontier-research': {
      type: 'hbars', unit: '%', max: 100, ticks: [0, 25, 50, 75, 100],
      title: 'PaperArena 端到端科研任务准确率',
      bars: [
        { label: '最好的 AI Agent', sub: '同一基准', value: 38.8, year: '报告版本', src: HAI26S, limit: '基准成绩，不代表真实世界的科研胜任力' },
        { label: '博士研究者基线', sub: '同一基准', value: 83.5, kind: 'ref', year: '报告版本', src: HAI26S, limit: '同一基准内的专家基线，不是跨领域平均值' },
      ],
      note: '同一基准内的对照，差距 <b>44.7 个百分点</b>。它说明模型能力与可靠科研产出之间仍有距离，而不是给所有科研领域下结论。',
      srcLine: HAI26S,
    },

    /* ── 07 实体产业：把散落的数字收成一张矩阵 ── */
    'industry-ledger': {
      type: 'rows', title: '2025 年机器人部署全景',
      rows: [
        { name: '全球在役工业机器人', value: '5.0', unit: 'million 台', badge: '+9%', year: '2025', src: IFR, limit: '部署指标，非 AI 因果效果' },
        { name: '全球新安装', value: '>600,000', unit: '台', badge: '+11%', year: '2025', src: IFR, limit: '安装流量' },
        { name: '中国新安装', value: '354,000', unit: '台', badge: '+20%', year: '2025', src: IFR, limit: '含非 AI 自动化' },
        { name: '中国占全球新安装量', value: '59', unit: '%', badge: '', year: '2025', src: IFR, limit: '占安装量比例' },
        { name: '专业服务机器人出货', value: '≈250,000', unit: '台', badge: '+24%', year: '2025', src: IFR + ' Service Robots', limit: '出货量不等于产出提升' },
      ],
      note: '<b>存量、流量、占比、出货量</b>是四种不同口径，不能相加，也不能合成一个「智能制造指数」。',
      srcLine: IFR,
    },

    /* ── 06 扩散与劳动：两种信号各一张图 ── */
    'labor-observed': {
      type: 'hbars', unit: '就业变化（%）', max: 25, ticks: [0, 5, 10, 15, 20, 25],
      title: '已观察到的就业变化',
      bars: [
        { label: '美国 22–25 岁软件开发者', sub: '较 2024 年下降', value: 20, display: '近 −20%', kind: 'violet', year: '2024 年起', src: HAI26E, limit: '观察到的趋势，不能单独证明由 AI 导致；报告指出总体就业尚未出现大规模流失' },
      ],
      note: '这是<b>特定职业的年轻群体</b>承受的变化，且属观察性趋势。把它读成「AI 已造成普遍失业」会超出证据。',
      srcLine: HAI26E,
    },
    'labor-expected': {
      type: 'hbars', unit: '受访组织占比（%）', max: 60, ticks: [0, 20, 40, 60],
      title: '企业对未来一年人力的预期',
      bars: [
        { label: '预计少变或不变', value: 45, display: '近半数', kind: 'ref', year: '2025 年调查', src: HAI26E, limit: '雇主预期，不是已实现裁员' },
        { label: '预计缩减人力', value: 33, display: '约 1/3', kind: 'violet', year: '2025 年调查', src: HAI26E, limit: '雇主预期，不是已实现裁员，也不是失业率预测' },
      ],
      note: '两项均为<b>预期</b>而非结果。报告同时指出总体就业数据尚未出现大规模岗位流失——预期与实现之间还有距离。',
      srcLine: HAI26E + ' · 2025 年调查',
    },
  };

  /* ────────── 渲染 ────────── */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pct = (v, max) => Math.max(0, Math.min(100, (v / max) * 100));
  const tip = (d) => {
    const parts = [String(d.value != null ? d.value : (d.display || ''))];
    return `${esc(d.label ? d.label + '：' : '')}<b>${esc(d.display || d.value)}</b>` +
      `<i>${esc(d.year || '')}　${esc(d.src || '')}<br>边界：${esc(d.limit || '口径见来源页')}</i>`;
  };
  const attr = (d) => `data-tip="${esc(tip(d))}" tabindex="0" role="img" aria-label="${esc((d.label || '') + ' ' + (d.display || d.value) + (d.unit || ''))}"`;

  function axisHTML(spec) {
    if (!spec.ticks) return '';
    return `<div class="chart-axis">${spec.ticks.map(t => `<span>${t}</span>`).join('')}</div>`;
  }

  function render(spec) {
    const wrap = document.createElement('div');
    wrap.className = 'chart';
    let h = `<div class="chart-head"><span class="chart-title">${esc(spec.title || '')}</span><span class="chart-unit">${esc(spec.unit || '')}</span></div>`;

    if (spec.type === 'hbars') {
      h += axisHTML(spec);
      spec.bars.forEach(b => {
        const w = pct(b.value, spec.max);
        const kind = b.kind === 'ref' ? ' ref' : b.kind === 'violet' ? ' violet' : '';
        h += `<div class="hbar">
          <div class="hbar-label">${esc(b.label)}${b.sub ? `<small>${esc(b.sub)}</small>` : ''}</div>
          <div class="hbar-track" ${attr(b)}><div class="hbar-fill${kind}" style="width:${w.toFixed(3)}%"></div></div>
          <div class="hbar-value">${esc(b.display || b.value)}${b.display ? '' : '<small>' + esc(spec.unit) + '</small>'}</div>
        </div>`;
      });
    } else if (spec.type === 'columns') {
      h += axisHTML(spec);
      h += `<div class="columns" style="--cols-h:${spec.cols.length > 2 ? 220 : 240}px">`;
      spec.cols.forEach((c, i) => {
        const hp = pct(c.value, spec.max);
        h += `<div class="col">
          <span class="col-num">${esc(c.display || c.value)}</span>
          <div class="col-area"><div class="col-bar${c.kind === 'main' ? '' : ' ref'}" style="height:${hp.toFixed(3)}%" ${attr(c)}></div></div>
          <span class="col-cap">${esc(c.label)}${c.sub ? `<small>${esc(c.sub)}</small>` : ''}</span>
        </div>`;
        if (spec.delta && i === 0) h += `<span class="col-delta">${esc(spec.delta)}</span>`;
      });
      h += '</div>';
    } else if (spec.type === 'range') {
      h += axisHTML(spec);
      spec.rows.forEach(r => {
        if (r.range) {
          const a = pct(r.range[0], spec.max), b = pct(r.range[1], spec.max);
          h += `<div class="range-row">
            <div class="hbar-label">${esc(r.label)}${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</div>
            <div class="range-track" ${attr(r)}><div class="range-span" style="left:${a.toFixed(3)}%;right:${(100 - b).toFixed(3)}%"></div></div>
            <div class="range-value">${esc(r.range[0])}–${esc(r.range[1])}×</div>
          </div>`;
        } else {
          const p = pct(r.point, spec.max);
          h += `<div class="range-row">
            <div class="hbar-label">${esc(r.label)}${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</div>
            <div class="range-track" ${attr({ ...r, value: r.point + '×' })}><div class="range-dot" style="left:${p.toFixed(3)}%"></div></div>
            <div class="range-value">${esc(r.point)}×</div>
          </div>`;
        }
      });
    } else if (spec.type === 'rows') {
      h += '<div class="rows">';
      spec.rows.forEach(r => {
        h += `<div class="row" ${attr({ label: r.name, value: r.value + ' ' + r.unit, year: r.year, src: r.src, limit: r.limit })}>
          <div class="row-main"><span class="row-name">${esc(r.name)}</span><span class="row-value">${esc(r.value)}<small> ${esc(r.unit)}</small></span></div>
          ${r.badge ? `<span class="row-badge">${esc(r.badge)}</span>` : '<span></span>'}
          <div class="row-note">${esc(r.year)} · ${esc(r.src)}</div>
        </div>`;
      });
      h += '</div>';
    }

    if (spec.note) h += `<p class="chart-note">${spec.note}</p>`;
    if (spec.srcLine) h += `<div class="chart-src">来源：${esc(spec.srcLine)}</div>`;
    wrap.innerHTML = h;
    return wrap;
  }

  /* ────────── 悬停 / 聚焦提示 ────────── */
  let tipEl = null;
  function ensureTip() {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'chart-tip'; document.body.appendChild(tipEl); }
    return tipEl;
  }
  function showTip(target) {
    const t = ensureTip();
    t.innerHTML = target.getAttribute('data-tip') || '';
    const r = target.getBoundingClientRect();
    t.style.left = Math.max(150, Math.min(window.innerWidth - 150, r.left + r.width / 2)) + 'px';
    t.style.top = r.top + 'px';
    t.classList.add('show');
  }
  const hideTip = () => { if (tipEl) tipEl.classList.remove('show'); };
  document.addEventListener('pointerover', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (t) showTip(t);
  }, { passive: true });
  document.addEventListener('pointerout', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (t) hideTip();
  }, { passive: true });
  document.addEventListener('focusin', e => {
    if (e.target.matches && e.target.matches('[data-tip]')) showTip(e.target);
  });
  document.addEventListener('focusout', hideTip);
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ────────── 与既有标签联动：尺度 / 劳动视角 ────────── */
  function syncGroups() {
    const scaleTab = document.querySelector('.scale-tab.active');
    if (scaleTab && scaleTab.dataset.scale) {
      const want = 'scale-' + scaleTab.dataset.scale;
      document.querySelectorAll('[data-chart^="scale-"]').forEach(h => {
        h.hidden = h.dataset.chart !== want;
      });
    }
    const labBtn = document.querySelector('.labor-mode.active');
    if (labBtn && labBtn.dataset.labor) {
      const want = 'labor-' + labBtn.dataset.labor;
      document.querySelectorAll('[data-chart^="labor-"]').forEach(h => {
        h.hidden = h.dataset.chart !== want;
      });
    }
    const frTab = document.querySelector('.frontier-tab.active');
    if (frTab && frTab.dataset.frontier) {
      const want = 'frontier-' + frTab.dataset.frontier;
      document.querySelectorAll('.frontier-charts > [data-chart]').forEach(h => {
        h.hidden = h.dataset.chart !== want;
      });
    }
  }

  /* ======================================================================
     实时图表：数值直接读取页面既有元素，随用户操作重绘（不是静态图）
     ====================================================================== */
  const num = el => {
    const t = el && el.textContent ? el.textContent.replace(/[^\d.\-]/g, '') : '';
    const v = parseFloat(t);
    return Number.isFinite(v) ? v : 0;
  };

  /* ── 月工时拆解瀑布：节时 − 复核 − 返工 = 净释放 ── */
  function waterfallHTML(v) {
    const saving = v.saving, review = v.review, rework = v.rework, net = v.net;
    const peak = Math.max(saving, net, 1);
    const scale = 100 / (peak * 1.12);          // 纵向百分比
    const cols = [
      { label: '节时', sub: 'AI 辅助节省', val: saving, from: 0, to: saving, kind: 'up' },
      { label: '复核', sub: '人工复核负担', val: review, from: saving, to: saving - review, kind: 'down' },
      { label: '返工', sub: '返工概率 × 半程', val: rework, from: saving - review, to: saving - review - rework, kind: 'down' },
      { label: '净释放', sub: '每月可用工时', val: net, from: 0, to: net, kind: 'net' },
    ];
    const bars = cols.map((c, i) => {
      const lo = Math.min(c.from, c.to), hi = Math.max(c.from, c.to);
      const bottom = lo * scale, height = Math.max((hi - lo) * scale, 0.6);
      const label = c.kind === 'down' ? '−' + c.val.toFixed(1) : c.val.toFixed(1);
      return `<div class="wf-col" style="--i:${i}">
        <span class="wf-val">${label}<small>h</small></span>
        <div class="wf-area"><div class="wf-bar ${c.kind}" style="bottom:${bottom.toFixed(2)}%;height:${height.toFixed(2)}%"></div>
          ${i > 0 && c.kind !== 'net' ? `<span class="wf-link" style="bottom:${(c.from * scale).toFixed(2)}%"></span>` : ''}
        </div>
        <span class="wf-cap">${c.label}<small>${c.sub}</small></span>
      </div>`;
    }).join('');
    return `<div class="chart wf">
      <div class="chart-head"><span class="chart-title">每月工时从哪里来、到哪里去</span><span class="chart-unit">小时 / 月</span></div>
      <div class="wf-grid">
        <div class="wf-axis"><span>${peak.toFixed(0)}</span><span>${(peak / 2).toFixed(0)}</span><span>0</span></div>
        <div class="wf-cols">${bars}</div>
      </div>
      <p class="chart-note">节时减去<b>复核</b>与<b>返工</b>才是净释放。返工越多，净释放掉得越快——这正是它对这个参数敏感的原因。</p>
      <div class="chart-src">按页面当前滑块参数实时计算 · 情景模拟，不是预测</div>
    </div>`;
  }
  function mountWaterfall() {
    const host = document.querySelector('[data-chart="lab-waterfall"]');
    if (!host) return;
    const read = () => ({
      saving: num(document.querySelector('#saving-hours')),
      review: num(document.querySelector('#review-hours')),
      rework: num(document.querySelector('#rework-hours')),
      net: num(document.querySelector('#hours-result')),
    });
    const draw = () => {
      const v = read();
      const key = [v.saving, v.review, v.rework, v.net].join('|');
      if (host.dataset.key === key) return;
      host.dataset.key = key;
      host.innerHTML = waterfallHTML(v);
      const chart = host.querySelector('.chart');
      void chart.offsetWidth;
      chart.classList.add('will-animate');
    };
    if (!host.dataset.bound) {
      host.dataset.bound = '1';
      document.querySelectorAll('#lab input[type=range], #reset-lab').forEach(el => {
        el.addEventListener('input', () => setTimeout(draw, 20));
        el.addEventListener('click', () => setTimeout(draw, 20));
      });
    }
    draw();
  }

  /* ── 五项转化条件的 SVG 环形仪表 ── */
  const GATE_LABELS = { data: '数据', skills: '技能', workflow: '流程', trust: '质量治理', energy: '能源效率' };
  function dialHTML(n, total) {
    const R = 92, C = 2 * Math.PI * R, seg = C / total;
    const arcs = Array.from({ length: total }, (_, i) => {
      const on = i < n;
      return `<circle class="dial-arc${on ? ' on' : ''}" cx="110" cy="110" r="${R}"
        stroke-dasharray="${(seg - 8).toFixed(2)} ${(C - seg + 8).toFixed(2)}"
        stroke-dashoffset="${(-i * seg + C / 4).toFixed(2)}" style="--i:${i}"></circle>`;
    }).join('');
    const dots = Object.entries(GATE_LABELS).map(([k, label], i) =>
      `<li data-gate="${k}" ${i < n ? 'class="on"' : ''}><i></i>${label}</li>`).join('');
    return `<div class="chart dial-chart">
      <div class="chart-head"><span class="chart-title">五项条件的就位情况</span><span class="chart-unit">解释性模型</span></div>
      <div class="dial-wrap">
        <svg viewBox="0 0 220 220" class="dial" role="img" aria-label="五项转化条件中已就位 ${n} 项">
          <circle class="dial-bg" cx="110" cy="110" r="${R}"></circle>
          ${arcs}
          <text class="dial-num" x="110" y="104" text-anchor="middle">${n}<tspan>/ ${total}</tspan></text>
          <text class="dial-cap" x="110" y="128" text-anchor="middle">条件已就位</text>
        </svg>
        <ul class="dial-legend">${dots}</ul>
      </div>
      <p class="chart-note">每段弧对应一项条件：<b>数据、技能、流程、质量治理、能源效率</b>。缺任何一项，转化都会断在那一环。</p>
      <div class="chart-src">这是解释性模型，开关数量不代表企业已获得等比例增长</div>
    </div>`;
  }
  function mountDial() {
    const host = document.querySelector('[data-chart="gate-dial"]');
    if (!host) return;
    const total = 5;
    const read = () => document.querySelectorAll('#transmission .gate-switch.active').length;
    const draw = (force) => {
      const n = read();
      if (!force && host.dataset.n === String(n)) return;
      host.dataset.n = String(n);
      host.innerHTML = dialHTML(n, total);
      const svg = host.querySelector('.dial');
      void svg.offsetWidth;
      svg.classList.add('will-animate');
    };
    // 旋转动画：让当前就位/缺失状态一眼看出变化
    if (!host.dataset.bound) {
      host.dataset.bound = '1';
      document.querySelectorAll('#transmission .gate-switch').forEach(b => {
        b.addEventListener('click', () => setTimeout(() => draw(false), 30));
      });
    }
    draw(true);
  }

  /* ── 图表进入视野时播放动画（滚动到图表也能触发，不再只在切标签时播） ── */
  let io = null;
  function initObserver() {
    if (io || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const chart = en.target.querySelector('.chart');
        if (chart) {
          chart.classList.remove('will-animate');
          void chart.offsetWidth;
          chart.classList.add('will-animate');
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('[data-chart]').forEach(h => io.observe(h));
  }

  /* ────────── 挂载 / 重播动画 ────────── */
  function mount(id) {
    const spec = SPECS[id];
    if (!spec) return;
    document.querySelectorAll(`[data-chart="${id}"]`).forEach(host => {
      if (!host.dataset.mounted) {
        host.innerHTML = '';
        host.appendChild(render(spec));
        host.dataset.mounted = '1';
      }
      const chart = host.querySelector('.chart');
      if (!chart || host.hidden) return;
      chart.classList.remove('will-animate');
      void chart.offsetWidth;              // 强制重排以重播动画
      chart.classList.add('will-animate');
    });
  }
  function mountAll() {
    syncGroups();
    Object.keys(SPECS).forEach(mount);
    mountWaterfall();
    mountDial();
    initObserver();
  }
  // 标签切换后：切换显隐并重播对应图表动画
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('.scale-tab, .frontier-tab, .case-tab, .labor-mode');
    if (!t) return;
    setTimeout(mountAll, 40);
  });
  // 键盘操作标签同样联动
  document.addEventListener('keydown', e => {
    const t = e.target;
    if (!t.matches || !t.matches('.scale-tab, .labor-mode')) return;
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    setTimeout(mountAll, 40);
  });

  window.NexusCharts = { mount, mountAll, SPECS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  else mountAll();
})();
