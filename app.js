'use strict';

const nodeNotes = {
  human: {
    title: '人 / 技能',
    copy: '劳动者提供目标设定、专业判断、关系协调与责任承担。AI 可以扩展信息处理能力，却不能替代所有情境理解。技能结构变化，决定人能否把节省的时间转为更高价值工作。',
    tag: '劳动者与专业能力'
  },
  data: {
    title: '数据 / 知识',
    copy: '生产数据、业务记录和领域知识让模型接近真实任务。数据的覆盖、质量、授权和代表性，会影响输出可靠性；没有合适的数据，智能能力难以稳定进入流程。',
    tag: '生产对象与经验沉淀'
  },
  compute: {
    title: '算力 / 模型',
    copy: '模型提供识别、预测、生成和规划能力，计算设施提供运行基础。能力进步扩大可处理任务的范围，也带来成本、能耗和可靠性约束。',
    tag: '智能工具与基础设施'
  },
  process: {
    title: '流程重组',
    copy: 'AI 的关键作用是把预测、生成、识别与优化能力嵌入工作流程。只有任务分工、工具接口和人的复核方式随之调整，技术能力才可能转化为有效产出。',
    tag: '生产力转化的中介环节'
  },
  quality: {
    title: '质量 / 创新',
    copy: 'AI 能扩展方案搜索、异常识别和实验迭代的空间。生产力提升还要看结果是否准确、安全、可复现，创新是否进入实际应用，而非只看生成速度。',
    tag: '质量提升与知识创造'
  },
  efficiency: {
    title: '效率 / 产出',
    copy: '效率可以表现为单位时间的产出、交付周期、设备利用率或错误返工变化。指标要结合任务口径和基线，才能判断释放的时间是否真的创造了增量。',
    tag: '时间、成本与吞吐变化'
  },
  green: {
    title: '绿色 / 普惠',
    copy: '生产力的意义还包含资源效率、成果可及性和劳动者适应能力。计算能耗、岗位变化和收益分配是系统结果的一部分，需要与效率收益一起观察。',
    tag: '资源效率与成果分配'
  }
};

const scaleNotes = {
  person: {
    eyebrow: 'MICRO · WORK UNIT',
    title: 'AI 先改变<br><em>一个具体任务</em>',
    desc: '在写作、分析、检索、编程等知识任务中，AI 能压缩起草与搜索时间，也可能增加核验成本。个人层面的关键不是“用了 AI”，而是把时间释放到判断、沟通与创造上。',
    metric: '14<span>%</span>',
    metricCopy: '一项客服现场研究中，<br>每小时解决问题数平均提升',
    tab: 'scale-tab-person',
    panelLabel: 'scale-tab-person',
    art: 'person',
    tag: 'TASK / 001',
    scale: 'SCALE 1:1'
  },
  org: {
    eyebrow: 'MESO · WORKFLOW',
    title: '从个人工具<br><em>变成组织流程</em>',
    desc: '企业采用 AI 的比例增长很快，生成式 AI 已进入不少业务职能。Agent 部署仍早，说明“给员工一个工具”与“重新设计整条流程”之间还存在组织、接口和信任成本。',
    metric: '88<span>%</span>',
    metricCopy: '2025 年受访组织表示<br>其组织使用 AI',
    tab: 'scale-tab-org',
    panelLabel: 'scale-tab-org',
    art: 'org',
    tag: 'WORKFLOW / 002',
    scale: 'SCALE 1:TEAM'
  },
  industry: {
    eyebrow: 'MACRO · PHYSICAL SYSTEM',
    title: '智能进入<br><em>实体生产现场</em>',
    desc: '机器人把感知、控制与执行连接起来。工厂自动化不仅是设备增加，也要求工艺改造、人员训练、维护体系和供应链协同。中国已成为工业机器人部署的重要增长中心。',
    metric: '354<span>K</span>',
    metricCopy: '中国 2025 年工业机器人<br>安装量（约 35.4 万台）',
    tab: 'scale-tab-industry',
    panelLabel: 'scale-tab-industry',
    art: 'industry',
    tag: 'FACTORY / 003',
    scale: 'SCALE 1:PLANT'
  },
  system: {
    eyebrow: 'SYSTEM · RESOURCE BOUNDARY',
    title: '把收益放进<br><em>资源与社会系统</em>',
    desc: '当 AI 扩大生产规模，数据中心、电网、技能结构与公共治理也会受到影响。高质量生产力要追问单位资源创造多少价值、哪些群体获得收益，以及系统能否持续运行。',
    metric: '950<span>TWh</span>',
    metricCopy: 'IEA 对 2030 年数据中心<br>用电量的更新展望',
    tab: 'scale-tab-system',
    panelLabel: 'scale-tab-system',
    art: 'system',
    tag: 'RESOURCE / 004',
    scale: 'SCALE 1:SYSTEM'
  }
};

function selectScale(key, focus = false) {
  const data = scaleNotes[key];
  if (!data) return;
  document.querySelectorAll('.scale-tab').forEach((tab) => {
    const active = tab.dataset.scale === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  const panel = document.querySelector('#scale-panel');
  panel.setAttribute('aria-labelledby', data.panelLabel);
  document.querySelector('#scale-eyebrow').textContent = data.eyebrow;
  document.querySelector('#scale-title').innerHTML = data.title;
  document.querySelector('#scale-desc').textContent = data.desc;
  document.querySelector('#scale-metric').innerHTML = data.metric;
  document.querySelector('#scale-metric-copy').innerHTML = data.metricCopy;
  const art = document.querySelector('#scale-art');
  art.dataset.scale = data.art;
  art.querySelector('.art-coord').textContent = data.tag;
  art.querySelector('.art-scale').textContent = data.scale;
}

document.querySelectorAll('.engine-node').forEach((button) => {
  button.addEventListener('click', () => {
    const note = nodeNotes[button.dataset.node];
    if (!note) return;
    document.querySelectorAll('.engine-node').forEach((node) => node.classList.toggle('active', node === button));
    document.querySelector('#node-title').textContent = note.title;
    document.querySelector('#node-copy').textContent = note.copy;
    document.querySelector('#node-tag').textContent = note.tag;
    document.querySelector('.detail-index').textContent = `SYSTEM NOTE / ${String(Object.keys(nodeNotes).indexOf(button.dataset.node) + 1).padStart(2, '0')}`;
  });
});

document.querySelectorAll('.scale-tab').forEach((tab, index, tabs) => {
  tab.addEventListener('click', () => selectScale(tab.dataset.scale));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    selectScale(tabs[next].dataset.scale, true);
  });
});
selectScale('person');

const motionToggle = document.querySelector('#motion-toggle');
let motionPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setMotionPaused(paused) {
  motionPaused = paused;
  document.body.classList.toggle('motion-paused', paused);
  const network = document.querySelector('.network-lines');
  if (network) paused ? network.pauseAnimations() : network.unpauseAnimations();
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? '▶' : 'Ⅱ';
  motionToggle.title = paused ? '继续背景动画' : '暂停背景动画';
}
setMotionPaused(motionPaused);
motionToggle.addEventListener('click', () => setMotionPaused(!motionPaused));

const canvas = document.querySelector('#starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.round(canvasWidth * dpr);
  canvas.height = Math.round(canvasHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.min(105, Math.floor(canvasWidth / 10)) }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    r: Math.random() * 1.2 + 0.25,
    a: Math.random() * 0.56 + 0.12,
    speed: Math.random() * 0.18 + 0.035,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(time = 0) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const star of stars) {
    const flicker = reduced || motionPaused ? 1 : .72 + Math.sin(time * .0007 + star.phase) * .28;
    ctx.beginPath();
    ctx.fillStyle = `rgba(158, 226, 229, ${star.a * flicker})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    if (!reduced && !motionPaused) {
      star.y -= star.speed;
      if (star.y < -2) { star.y = canvasHeight + 2; star.x = Math.random() * canvasWidth; }
    }
  }
  if (!reduced) window.requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
window.requestAnimationFrame(drawStars);

const ranges = ['tasks', 'minutes', 'coverage', 'saved', 'review', 'rework'].map((id) => document.getElementById(id));
function updateLab() {
  const values = Object.fromEntries(ranges.map((input) => [input.id, Number(input.value)]));
  document.querySelector('#tasks-out').textContent = String(values.tasks);
  document.querySelector('#minutes-out').textContent = `${values.minutes} 分钟`;
  document.querySelector('#coverage-out').textContent = `${values.coverage}%`;
  document.querySelector('#saved-out').textContent = `${values.saved}%`;
  document.querySelector('#review-out').textContent = `${values.review}%`;
  document.querySelector('#rework-out').textContent = `${values.rework}%`;

  const monthlyTasks = values.tasks * 22;
  const baseHours = monthlyTasks * values.minutes / 60;
  const coveredTasks = monthlyTasks * values.coverage / 100;
  const coveredHours = baseHours * values.coverage / 100;
  const savingHours = coveredHours * values.saved / 100;
  const reviewHours = coveredHours * values.review / 100;
  const reworkHours = coveredHours * values.rework / 100 * .5;
  const netCapacity = savingHours - reviewHours - reworkHours;
  const displayHours = Math.abs(netCapacity) < 0.05 ? '0.0' : netCapacity.toFixed(1);
  document.querySelector('#hours-result').textContent = displayHours;
  document.querySelector('#base-hours').textContent = `${Math.round(baseHours)} h`;
  document.querySelector('#covered-tasks').textContent = `${Math.round(coveredTasks).toLocaleString('zh-CN')} 项`;
  document.querySelector('#saving-hours').textContent = `${savingHours.toFixed(1)} h`;
  document.querySelector('#review-hours').textContent = `${reviewHours.toFixed(1)} h`;
  document.querySelector('#rework-hours').textContent = `${reworkHours.toFixed(1)} h`;
  document.querySelector('#saving-segment').style.width = `${values.saved}%`;
  document.querySelector('#review-segment').style.width = `${values.review}%`;
  document.querySelector('#rework-segment').style.width = `${values.rework * .5}%`;
  document.querySelector('#result-meter').style.width = `${Math.max(0, Math.min(100, netCapacity / Math.max(1, baseHours) * 300))}%`;
  document.querySelector('#result-note').textContent = netCapacity > 0
    ? '在当前假设下，AI 辅助释放部分时间；质量仍需人工验证。'
    : '当前复核负担抵消了节时假设；先改进流程或降低复核成本。';
}
ranges.forEach((input) => input.addEventListener('input', updateLab));
document.querySelector('#reset-lab').addEventListener('click', () => {
  const defaults = { tasks: 40, minutes: 18, coverage: 55, saved: 30, review: 8, rework: 6 };
  ranges.forEach((input) => { input.value = defaults[input.id]; });
  updateLab();
});
updateLab();

const adoptionYears = {
  2023: { value: 55, note: '超过半数的受访组织表示使用 AI。' },
  2024: { value: 78, note: 'AI 使用从少数试点扩大到多数受访组织。' },
  2025: { value: 88, note: '使用已很普遍，流程与 Agent 部署仍需继续观察。' }
};
const trendStage = document.querySelector('.trend-stage');
const trendTarget = document.querySelector('#trend-target');
const trendPlay = document.querySelector('#trend-play');
let activeYear = 2023;
let trendTimer = null;
function positionTrendTarget() {
  const point = document.querySelector(`.trend-point[data-year="${activeYear}"]`);
  const visual = document.querySelector('.trend-visual');
  if (!point || !visual) return;
  const dot = point.getBoundingClientRect();
  const frame = visual.getBoundingClientRect();
  trendTarget.style.left = `${dot.left + dot.width / 2 - frame.left}px`;
  trendTarget.style.top = `${dot.top + dot.height / 2 - frame.top}px`;
}
function showYear(year) {
  const entry = adoptionYears[year];
  if (!entry) return;
  activeYear = Number(year);
  document.querySelector('#trend-value').textContent = `${entry.value}%`;
  document.querySelector('#trend-year').textContent = String(year);
  document.querySelector('#trend-note').textContent = entry.note;
  trendTarget.querySelector('b').textContent = `${entry.value}%`;
  document.querySelectorAll('.trend-year').forEach((button) => {
    const selected = Number(button.dataset.year) === activeYear;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('.trend-point').forEach((point) => point.classList.toggle('active', Number(point.dataset.year) === activeYear));
  window.requestAnimationFrame(positionTrendTarget);
}
function stopTrendPlayback() {
  if (trendTimer) window.clearInterval(trendTimer);
  trendTimer = null;
  trendPlay.setAttribute('aria-pressed', 'false');
  trendPlay.innerHTML = '▶ <span>播放</span>';
  trendPlay.title = '自动播放年份';
}
document.querySelectorAll('.trend-year, .trend-point').forEach((control) => {
  control.addEventListener('click', () => { stopTrendPlayback(); showYear(control.dataset.year); });
});
trendPlay.addEventListener('click', () => {
  if (trendTimer) { stopTrendPlayback(); return; }
  trendPlay.setAttribute('aria-pressed', 'true');
  trendPlay.innerHTML = 'Ⅱ <span>暂停</span>';
  trendPlay.title = '暂停年份播放';
  showYear(activeYear === 2025 ? 2023 : activeYear + 1);
  trendTimer = window.setInterval(() => showYear(activeYear === 2025 ? 2023 : activeYear + 1), 1700);
});
motionToggle.addEventListener('click', () => { if (motionPaused) stopTrendPlayback(); });
window.addEventListener('resize', positionTrendTarget, { passive: true });
showYear(2023);

const fieldScenes = {
  cobot: { image: 'assets/cobot-worker.jpg', alt: '工人与协作机器人在制造现场共同作业', counter: '01 / 02', caption: '协作机器人进入制造环节，人仍负责装配判断和现场协调。', credit: '图像：Jeff Green / Rethink Robotics，CC BY 4.0' },
  polish: { image: 'assets/robot-guitar-factory.jpg', alt: '机器人在吉他工厂进行表面抛光', counter: '02 / 02', caption: '机械臂承担重复的精密抛光；设备部署仍需要工艺和人员配合。', credit: '图像：Henrysz，CC BY 4.0' }
};
const fieldImage = document.querySelector('#field-image');
const fieldFrame = document.querySelector('.field-frame');
let selectedField = 'cobot';
let fieldChange = 0;
function selectField(key) {
  if (!fieldScenes[key] || key === selectedField) return;
  selectedField = key;
  const request = ++fieldChange;
  const next = fieldScenes[key];
  document.querySelectorAll('.field-button').forEach((button) => {
    const active = button.dataset.field === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  fieldFrame.classList.add('is-changing');
  const preload = new Image();
  preload.onload = () => {
    if (request !== fieldChange) return;
    fieldImage.src = next.image;
    fieldImage.alt = next.alt;
    document.querySelector('#field-counter').textContent = next.counter;
    document.querySelector('#field-caption').textContent = next.caption;
    document.querySelector('#field-credit').textContent = next.credit;
    window.requestAnimationFrame(() => fieldFrame.classList.remove('is-changing'));
  };
  preload.onerror = () => fieldFrame.classList.remove('is-changing');
  preload.src = next.image;
}
document.querySelectorAll('.field-button').forEach((button) => button.addEventListener('click', () => selectField(button.dataset.field)));

const energyDetails = {
  2025: { kind: '估计', text: '数据中心用电约 485 TWh；包含 AI 与其他数字服务。' },
  2030: { kind: '预测', text: 'IEA 更新展望约 950 TWh；这是未来情景，不是已发生的用电量。' }
};
document.querySelectorAll('[data-energy-year]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-energy-year]').forEach((bar) => {
      const active = bar === button;
      bar.classList.toggle('active', active);
      bar.setAttribute('aria-pressed', String(active));
    });
    const year = button.dataset.energyYear;
    const detail = energyDetails[year];
    const explanation = document.querySelector('#energy-explain');
    explanation.querySelector('b').textContent = `${year} · ${detail.kind}`;
    explanation.querySelector('span').textContent = detail.text;
  });
});

const progressFill = document.querySelector('#reading-progress-fill');
let progressQueued = false;
function updateProgress() {
  progressQueued = false;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressFill.style.width = `${maxScroll > 0 ? Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)) : 0}%`;
}
window.addEventListener('scroll', () => {
  if (!progressQueued) { progressQueued = true; window.requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

if ('IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        sceneObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  [trendStage, fieldFrame, document.querySelector('.infrastructure-strip')].forEach((element) => element && sceneObserver.observe(element));
} else trendStage.classList.add('is-visible');
