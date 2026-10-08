'use strict';

(() => {
  const gateButtons = [...document.querySelectorAll('.gate-switch')];
  const gateNames = {
    data: '可用数据与任务',
    skills: '人的专业技能',
    workflow: '工作流程重构',
    trust: '可靠性与责任',
    energy: '算力与能源效率'
  };

  function renderGates() {
    const enabled = gateButtons.filter((button) => button.classList.contains('active'));
    const missing = gateButtons.find((button) => !button.classList.contains('active'));
    const count = enabled.length;
    document.querySelector('#gate-count').textContent = `${count} / 5`;
    document.querySelector('#reactor-ring').style.setProperty('--gate-progress', `${count * 20}%`);
    const title = document.querySelector('#gate-status');
    const explanation = document.querySelector('#gate-explanation');
    const next = document.querySelector('#gate-next');
    if (count === 5) {
      title.innerHTML = '条件链已闭合，<br>可以开始实测';
      explanation.textContent = '五项条件同时存在，才具备检验可持续增量的基础。接下来仍要用任务质量、单位资源产出和对照数据验证真实效果。';
      next.textContent = '下一步：设计可核验的结果指标';
    } else if (count >= 3) {
      title.innerHTML = '能力已接入，<br>转化尚未完成';
      explanation.textContent = `已连接 ${count} 项条件；当前缺少“${gateNames[missing.dataset.gate]}”。技术可以提供局部速度收益，但效果是否可靠、可持续仍需验证。`;
      next.textContent = `下一道门：${gateNames[missing.dataset.gate]}`;
    } else if (count > 0) {
      title.innerHTML = '生产链还有<br>关键断点';
      explanation.textContent = `目前只有 ${count} 项条件就位。先补齐“${gateNames[missing.dataset.gate]}”，再观察模型能力能否进入真实任务和流程。`;
      next.textContent = `下一道门：${gateNames[missing.dataset.gate]}`;
    } else {
      title.innerHTML = '技术潜能尚未<br>连接生产现场';
      explanation.textContent = '单独的模型能力无法说明企业或个人已经获得生产力增量。先明确任务、数据与人的角色，才能开始评估。';
      next.textContent = '第一道门：可用数据与任务';
    }
  }
  gateButtons.forEach((button) => button.addEventListener('click', () => {
    const active = !button.classList.contains('active');
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    renderGates();
  }));
  renderGates();

  const caseStudies = {
    support: {
      gain: 14,
      unit: '每小时解决问题数',
      context: '一项覆盖 5,179 名客服人员的现场研究。平均增幅为 14%；新手和低技能员工约为 34%，资深员工影响较小。',
      boundary: '这是单一客服工作场景的平均结果。不能推断所有企业或所有任务都会提高 14%。',
      source: 'https://www.nber.org/papers/w31161',
      steps: [
        ['问题进入服务流程', '客户提出的问题需要理解情境、检索知识，再生成可执行的答复。'],
        ['AI 提供知识与话术建议', '助手帮助检索相似问题并生成回复建议，缩短部分搜寻与起草时间。'],
        ['客服人员核对情境与准确性', '人需要识别异常、纠正建议，并对最终答复负责；复核成本不能忽略。'],
        ['以实际解决量衡量结果', '研究测量每小时解决的问题数。效率增益对经验较少的员工更明显。']
      ]
    },
    dev: {
      gain: 26,
      unit: '软件开发任务的报告增益',
      context: 'Stanford《2026 AI Index》汇总的软件开发相关研究报告约 26% 的生产率增益。此处展示报告摘要，具体任务与量尺依原研究而异。',
      boundary: '软件开发的代码量、任务完成速度和长期可维护性不是同一个指标；26% 不能与客服的 14% 直接排名。',
      source: 'https://hai.stanford.edu/ai-index/2026-ai-index-report/economy',
      steps: [
        ['需求与约束先确定', '开发者先明确用户目标、接口约束和验收标准，避免把模糊需求直接交给模型。'],
        ['AI 加速候选方案', '模型可辅助生成代码草稿、测试建议和解释，扩大解决方案搜索空间。'],
        ['开发者运行、审查与集成', '正确性、安全性和维护成本仍需人工验证；复杂推理任务的收益可能较小。'],
        ['在具体任务中测量增益', '报告汇总相关研究约 26% 增益，不能直接推断整个软件行业的全要素生产率。']
      ]
    },
    market: {
      gain: 50,
      unit: '营销内容产出',
      context: 'Stanford《2026 AI Index》汇总研究中，营销任务报告约 50% 的产出增益。这里的“产出”不是销量或利润。',
      boundary: '内容数量增加不等于转化率、品牌质量或长期客户价值同步提升；不同研究的样本不可直接合并。',
      source: 'https://hai.stanford.edu/ai-index/2026-ai-index-report/economy',
      steps: [
        ['明确受众与品牌目标', '人的策略判断决定内容为何存在、面向谁以及怎样衡量效果。'],
        ['AI 批量生成候选版本', '模型帮助起草文案与变体，降低初稿制作成本。'],
        ['人工筛选并验证事实', '品牌一致性、事实准确性和合规风险需要复核。'],
        ['区分“内容产出”和“业务结果”', '报告中的约 50% 是任务产出增益，不能直接写成销售收入增长。']
      ]
    }
  };
  const caseTabs = [...document.querySelectorAll('.case-tab')];
  const steps = [...document.querySelectorAll('.workflow-step')];
  let activeCase = 'support';

  function selectStep(index) {
    const data = caseStudies[activeCase].steps[index];
    if (!data) return;
    steps.forEach((button) => {
      const active = Number(button.dataset.step) === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#workflow-title').textContent = data[0];
    document.querySelector('#workflow-copy').textContent = data[1];
  }
  function selectCase(key, focus = false) {
    const study = caseStudies[key];
    if (!study) return;
    activeCase = key;
    caseTabs.forEach((button) => {
      const active = button.dataset.case === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    document.querySelector('#case-panel').setAttribute('aria-labelledby', `case-tab-${key}`);
    document.querySelector('#case-value').textContent = `+${study.gain}%`;
    document.querySelector('#case-unit').textContent = study.unit;
    document.querySelector('#case-context').textContent = study.context;
    document.querySelector('#case-index').textContent = String(100 + study.gain);
    document.querySelector('#case-bar').style.width = `${(100 + study.gain) / 150 * 100}%`;
    document.querySelector('#case-boundary-copy').textContent = study.boundary;
    document.querySelector('#case-source').href = study.source;
    document.querySelector('.indexed-chart').setAttribute('aria-label', `${study.unit}：原流程指数 100，AI 辅助指数 ${100 + study.gain}；仅在本案例内部归一化`);
    selectStep(0);
  }
  caseTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectCase(button.dataset.case));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? caseTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : caseTabs.length - 1)) % caseTabs.length;
      selectCase(caseTabs[target].dataset.case, true);
    });
  });
  steps.forEach((button) => button.addEventListener('click', () => selectStep(Number(button.dataset.step))));
  selectCase(activeCase);

  const frontierSignals = {
    publications: {
      kind: '扩散程度 / PUBLICATION VOLUME',
      title: '更多研究使用 AI，<br>但数量不是发现质量。',
      copy: '自然科学中的 AI 相关论文约 80,150 篇，较 2024 年增长 26%。它说明工具与方法正在扩散，不能单独证明科学发现的质量或原创性同步提高。',
      boundary: '论文数量是采用和研究活动指标，不等同于可复现的创新成果。'
    },
    weather: {
      kind: '工作流程 / FORECAST PIPELINE',
      title: '预测流程变快，<br>打开更大的探索空间。',
      copy: 'Stanford《2026 AI Index》指出，FourCastNet 3 可在不到 4 分钟内生成 60 天全球预测，速度比先前方法快 8–60 倍。这是特定天气预测系统的表现，不是所有科研任务的统一提速。',
      boundary: '速度指标需与预测质量、计算条件和实际部署流程一起评价。'
    },
    research: {
      kind: '结果检验 / RESEARCH ACCURACY',
      title: '从答题到完成研究，<br>验证仍是关键门槛。',
      copy: 'PaperArena 的端到端科研任务中，最好的 AI Agent 准确率为 38.8%，博士研究者基线为 83.5%。这说明模型能力与可靠的科研产出之间仍有距离。',
      boundary: '这是一个基准任务的准确率对照，不代表全部科研领域的真实世界表现。'
    }
  };
  const frontierTabs = [...document.querySelectorAll('.frontier-tab')];
  function selectFrontier(key, focus = false) {
    const signal = frontierSignals[key];
    if (!signal) return;
    frontierTabs.forEach((button) => {
      const active = button.dataset.frontier === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    const panel = document.querySelector('#frontier-panel');
    panel.dataset.mode = key;
    panel.setAttribute('aria-labelledby', `frontier-tab-${key}`);
    panel.querySelectorAll('[data-view]').forEach((view) => { view.hidden = view.dataset.view !== key; });
    document.querySelector('#frontier-kind').textContent = signal.kind;
    document.querySelector('#frontier-reading-title').innerHTML = signal.title;
    document.querySelector('#frontier-reading-copy').textContent = signal.copy;
    document.querySelector('#frontier-boundary-copy').textContent = signal.boundary;
  }
  frontierTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectFrontier(button.dataset.frontier));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? frontierTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : frontierTabs.length - 1)) % frontierTabs.length;
      selectFrontier(frontierTabs[target].dataset.frontier, true);
    });
  });
  selectFrontier('publications');

  const laborViews = {
    observed: {
      number: '~−20<span>%</span><small>EARLY-CAREER SIGNAL</small>',
      heading: '特定职业的年轻群体承受变化。',
      explanation: 'Stanford 2026 AI Index 报告称，美国 22–25 岁软件开发者就业人数较 2024 年下降近 20%。这是值得观察的就业趋势，不能单独证明变化由 AI 导致。',
      boundary: '同一报告也指出，总体就业数据尚未出现大规模岗位流失。'
    },
    expected: {
      number: '≈1/3<small>EMPLOYER EXPECTATION</small>',
      heading: '雇主对下一年的预期存在分化。',
      explanation: 'Stanford 2026 AI Index 汇总的组织调查中，约三分之一预计下一年缩减员工；近半数预计人力规模几乎不变或没有变化。',
      boundary: '企业预期不是已经发生的裁员，更不能直接转写成全社会失业率。'
    }
  };
  document.querySelectorAll('.labor-mode').forEach((button) => button.addEventListener('click', () => {
    const view = laborViews[button.dataset.labor];
    if (!view) return;
    document.querySelectorAll('.labor-mode').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#labor-number').innerHTML = view.number;
    document.querySelector('#labor-heading').textContent = view.heading;
    document.querySelector('#labor-explainer').textContent = view.explanation;
    document.querySelector('#labor-boundary').textContent = view.boundary;
  }));

  const sourceLinks = [...document.querySelectorAll('.source-list > a[data-kind]')];
  document.querySelectorAll('.source-filter-button').forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.source-filter-button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    sourceLinks.forEach((link) => {
      const visible = filter === 'all' || link.dataset.kind.split(' ').includes(filter);
      link.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector('#source-count').textContent = `${count} 项来源`;
  }));
})();
