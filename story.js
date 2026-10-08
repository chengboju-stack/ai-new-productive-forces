'use strict';

(() => {
  const routes = [
    { id: 'overview', number: '00', label: '总览', group: 'NEXUS / START' },
    { id: 'engine', number: '01', label: '生产力引擎', group: 'ACT 01 / 机制' },
    { id: 'transmission', number: '02', label: '转化条件', group: 'ACT 01 / 机制' },
    { id: 'scales', number: '03', label: '影响尺度', group: 'ACT 01 / 机制' },
    { id: 'cases', number: '04', label: '任务实证', group: 'ACT 02 / 证据' },
    { id: 'frontier', number: '05', label: '科研前沿', group: 'ACT 02 / 证据' },
    { id: 'evidence', number: '06', label: '扩散与劳动', group: 'ACT 02 / 证据' },
    { id: 'industry', number: '07', label: '实体产业', group: 'ACT 03 / 产业' },
    { id: 'energy', number: '08', label: '能源账本', group: 'ACT 03 / 产业' },
    { id: 'lab', number: '09', label: '情景实验', group: 'ACT 04 / 实验' },
    { id: 'conclusion', number: '→', label: '结论', group: 'CONCLUSION' },
    { id: 'sources', number: '↗', label: '数据来源', group: 'SOURCE ARCHIVE' }
  ];
  const routeById = new Map(routes.map((route) => [route.id, route]));
  const pageIds = routes.filter((route) => route.id !== 'overview').map((route) => route.id);
  const map = document.querySelector('#chapter-map');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentId = 'overview';

  // 浏览器对 hash 锚点的原生滚动发生在布局稳定之前（scroll-padding-top:78px 与章节
  // offsetTop 相减会落在约 12px 处），因此切换后需要再断言几次顶部位置。
  function lockTop() {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
    }, 90);
  }
  let transitionId = 0;

  history.scrollRestoration = 'manual';
  document.documentElement.classList.add('route-mode');
  document.body.classList.add('route-mode');
  document.querySelectorAll('.act-divider').forEach((divider) => { divider.hidden = true; });

  function addRouteChrome(route) {
    const section = document.getElementById(route.id);
    if (!section || section.querySelector('.route-chrome')) return;
    section.dataset.chapter = route.number;
    section.setAttribute('tabindex', '-1');
    const chrome = document.createElement('div');
    chrome.className = 'route-chrome';
    chrome.innerHTML = `<span class="route-code">${route.number === '→' || route.number === '↗' ? route.number : `CHAPTER ${route.number} / 09`}</span><span class="route-group">${route.group}</span><span class="route-page-title">${route.label}</span>`;
    section.prepend(chrome);
    const index = routes.findIndex((item) => item.id === route.id);
    const previous = routes[index - 1];
    const next = routes[index + 1];
    const footer = document.createElement('nav');
    footer.className = 'route-end-nav';
    footer.setAttribute('aria-label', `${route.label} 页面导航`);
    footer.innerHTML = `${previous ? `<a class="route-prev" href="#${previous.id}"><small>PREVIOUS</small><b>← ${previous.label}</b></a>` : '<span></span>'}<a class="route-map-link" href="#chapter-map">章节地图</a>${next ? `<a class="route-next" href="#${next.id}"><small>NEXT / ${next.group}</small><b>${next.label} →</b></a>` : '<a class="route-next" href="#overview"><small>RESTART</small><b>返回总览 ↗</b></a>'}`;
    section.append(footer);
  }
  routes.filter((route) => route.id !== 'overview').forEach(addRouteChrome);

  function setRoute(id, options = {}) {
    const route = routeById.get(id);
    if (!route) return false;
    currentId = id;
    const nextTransition = ++transitionId;
    pageIds.forEach((pageId) => {
      const page = document.getElementById(pageId);
      const active = pageId === id;
      page.hidden = !active;
      page.setAttribute('aria-hidden', String(!active));
      page.classList.toggle('route-active', active);
      page.classList.remove('route-entering');
      if (active && !motionQuery.matches) {
        requestAnimationFrame(() => {
          if (nextTransition !== transitionId) return;
          page.classList.add('route-entering');
          page.addEventListener('animationend', () => page.classList.remove('route-entering'), { once: true });
        });
      }
    });
    document.getElementById('overview').hidden = id !== 'overview';
    document.getElementById('overview').setAttribute('aria-hidden', String(id !== 'overview'));
    document.body.dataset.currentRoute = id;
    document.title = id === 'overview' ? 'NEXUS｜AI新质生产力观测站' : `${route.number} · ${route.label}｜NEXUS`;
    let activeLink = null;
    document.querySelectorAll('.main-nav [data-route]').forEach((link) => {
      const active = link.dataset.route === id;
      link.classList.toggle('active', active);
      if (active) { link.setAttribute('aria-current', 'page'); activeLink = link; }
      else link.removeAttribute('aria-current');
    });
    // 顶部“当前章节”芯片：即使滚到章节深处，也始终知道自己处在哪一章
    const nowChip = document.querySelector('#route-now');
    if (nowChip) {
      const numEl = nowChip.querySelector('b');
      const labelEl = nowChip.querySelector('i');
      if (numEl) numEl.textContent = route.number;
      if (labelEl) labelEl.textContent = route.label;
      nowChip.classList.toggle('on', id !== 'overview');
    }
    // 窄屏下主导航是横向滚动条，把当前项带进视野（仅在确实溢出时）
    const navEl = document.querySelector('.main-nav');
    if (activeLink && navEl && navEl.scrollWidth > navEl.clientWidth + 4) {
      try {
        activeLink.scrollIntoView({
          block: 'nearest', inline: 'center',
          behavior: motionQuery.matches ? 'auto' : 'smooth',
        });
      } catch (_) { /* 忽略个别浏览器不支持对象参数 */ }
    }
    const fill = document.querySelector('#reading-progress-fill');
    fill.style.width = `${Math.round(routes.indexOf(route) / (routes.length - 1) * 100)}%`;
    if (map.open) map.close();
    if (options.push !== false) history.pushState({ route: id }, '', `#${id}`);
    lockTop();
    return true;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.hash.slice(1);
    if (routeById.has(target)) {
      event.preventDefault();
      setRoute(target);
    } else if (target === 'chapter-map') {
      event.preventDefault();
      map.showModal();
    }
  });

  document.querySelector('#chapter-map-trigger').addEventListener('click', () => map.showModal());
  document.querySelector('#chapter-map-close').addEventListener('click', () => map.close());
  map.addEventListener('click', (event) => { if (event.target === map) map.close(); });
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    setRoute(routeById.has(id) ? id : 'overview', { push: false });
  });
  motionQuery.addEventListener('change', () => {
    document.querySelectorAll('.route-entering').forEach((page) => page.classList.remove('route-entering'));
  });

  const requested = location.hash.slice(1);
  setRoute(routeById.has(requested) ? requested : 'overview', { push: false });
})();
