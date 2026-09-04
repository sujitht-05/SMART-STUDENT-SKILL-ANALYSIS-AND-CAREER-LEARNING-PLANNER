/**
 * Smart Student Skill Analysis & Career Learning Planner
 * Core Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const AppState = {
    profile: {
      name: "Alex Chen",
      academicYear: "Computer Science Sophomore (Year 2)",
      weeklyHours: 15,
      targetRole: "ai_ml",
      skillProficiencies: {}
    },
    activeTab: "dashboard",
    activeSkillFilter: "all",
    completedTasks: {},
    chatHistory: []
  };

  // Initialize Default State from Preset
  function initDefaultState() {
    const defaultPreset = PRESET_PROFILES[0]; // Alex Chen AI Sophomore
    AppState.profile = JSON.parse(JSON.stringify(defaultPreset));
    loadSavedState();
  }

  // Save to LocalStorage
  function saveState() {
    try {
      localStorage.setItem('smart_skill_planner_state', JSON.stringify(AppState));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  // Load from LocalStorage
  function loadSavedState() {
    try {
      const saved = localStorage.getItem('smart_skill_planner_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.profile.targetRole) {
          Object.assign(AppState, parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load localStorage", e);
    }
  }

  // Setup DOM Elements
  const tabButtons = document.querySelectorAll('.nav-item button');
  const tabContents = document.querySelectorAll('.tab-content');
  const presetSelect = document.getElementById('presetSelect');
  const roleSelect = document.getElementById('targetRoleSelect');
  const studentNameInput = document.getElementById('studentNameInput');
  const academicYearInput = document.getElementById('academicYearInput');
  const weeklyHoursInput = document.getElementById('weeklyHoursInput');
  const exportBtn = document.getElementById('exportBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Radar Chart Canvas Context
  const canvas = document.getElementById('radarChart');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Initialize App UI
  function init() {
    initDefaultState();
    bindEvents();
    renderProfileHeader();
    renderSkillMatrix();
    renderDashboardGaps();
    renderRoadmap();
    renderMarketInsights();
    initChatBot();
    drawRadarChart();
  }

  // Event Listeners
  function bindEvents() {
    // Tab Navigation
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const content = document.getElementById(targetTab);
        if (content) content.classList.add('active');
        AppState.activeTab = targetTab;
        if (targetTab === 'dashboard') {
          setTimeout(drawRadarChart, 50);
        }
      });
    });

    // Preset Selector Change
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const presetId = e.target.value;
        if (presetId === 'custom') return;
        const selectedPreset = PRESET_PROFILES.find(p => p.id === presetId);
        if (selectedPreset) {
          AppState.profile = JSON.parse(JSON.stringify(selectedPreset));
          saveState();
          refreshAllViews();
        }
      });
    }

    // Target Role Change
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        const newRole = e.target.value;
        AppState.profile.targetRole = newRole;
        // Reset skills for new role default
        const roleData = CAREER_DATA[newRole];
        if (roleData) {
          roleData.skills.forEach(sk => {
            if (!(sk.id in AppState.profile.skillProficiencies)) {
              AppState.profile.skillProficiencies[sk.id] = 40; // baseline
            }
          });
        }
        saveState();
        refreshAllViews();
      });
    }

    // Profile Inputs Change
    if (studentNameInput) {
      studentNameInput.addEventListener('input', (e) => {
        AppState.profile.name = e.target.value;
        document.getElementById('displayName').textContent = e.target.value || "Student";
        saveState();
      });
    }

    if (academicYearInput) {
      academicYearInput.addEventListener('change', (e) => {
        AppState.profile.academicYear = e.target.value;
        saveState();
      });
    }

    if (weeklyHoursInput) {
      weeklyHoursInput.addEventListener('change', (e) => {
        AppState.profile.weeklyHours = parseInt(e.target.value, 10);
        document.getElementById('displayHours').textContent = e.target.value + " hrs/week";
        saveState();
        renderRoadmap();
      });
    }

    // Skill Filter Chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        AppState.activeSkillFilter = chip.getAttribute('data-filter');
        renderSkillMatrix();
      });
    });

    // Export PDF / Print
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Reset Data
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all custom skill scores to default preset?")) {
          localStorage.removeItem('smart_skill_planner_state');
          initDefaultState();
          refreshAllViews();
        }
      });
    }

    // Window Resize -> redraw Canvas Radar
    window.addEventListener('resize', () => {
      if (AppState.activeTab === 'dashboard') {
        drawRadarChart();
      }
    });
  }

  // Refresh all components
  function refreshAllViews() {
    renderProfileHeader();
    renderSkillMatrix();
    renderDashboardGaps();
    renderRoadmap();
    renderMarketInsights();
    drawRadarChart();
  }

  // Calculate Match Score Percentage & Gap Analysis using SkillMatchEngine
  function calculateMatchScore() {
    const roleData = CAREER_DATA[AppState.profile.targetRole];
    if (!roleData) return { matchPercent: 0, gaps: [], readinessLevel: "Foundational" };

    if (typeof SkillMatchEngine !== 'undefined') {
      return SkillMatchEngine.calculateMatchScore(AppState.profile.skillProficiencies, roleData.skills);
    }

    // Fallback if SkillMatchEngine is missing
    let totalWeight = 0;
    let weightedScore = 0;
    const gaps = [];

    roleData.skills.forEach(skill => {
      const userLevel = AppState.profile.skillProficiencies[skill.id] || 0;
      const targetLevel = skill.requiredLevel;
      const gapValue = Math.max(0, targetLevel - userLevel);

      let weightMultiplier = 1;
      if (skill.importance === "Critical") weightMultiplier = 1.5;
      else if (skill.importance === "High") weightMultiplier = 1.2;

      totalWeight += targetLevel * weightMultiplier;
      weightedScore += Math.min(userLevel, targetLevel) * weightMultiplier;

      let urgency = "medium";
      if (gapValue >= 35 && skill.importance === "Critical") urgency = "critical";
      else if (gapValue >= 25 || skill.importance === "High") urgency = "high";

      gaps.push({
        ...skill,
        userLevel,
        gapValue,
        urgency
      });
    });

    const matchPercent = Math.round((weightedScore / totalWeight) * 100);
    gaps.sort((a, b) => b.gapValue - a.gapValue);

    return { matchPercent, gaps };
  }

  // Render Profile Header & Readiness Score
  function renderProfileHeader() {
    const roleData = CAREER_DATA[AppState.profile.targetRole];
    const { matchPercent } = calculateMatchScore();

    if (studentNameInput) studentNameInput.value = AppState.profile.name;
    if (academicYearInput) academicYearInput.value = AppState.profile.academicYear;
    if (weeklyHoursInput) weeklyHoursInput.value = AppState.profile.weeklyHours;
    if (roleSelect) roleSelect.value = AppState.profile.targetRole;

    document.getElementById('displayName').textContent = AppState.profile.name;
    document.getElementById('displayRole').textContent = roleData ? roleData.title : "Target Role";
    document.getElementById('displayHours').textContent = AppState.profile.weeklyHours + " hrs/week";

    // Readiness Gauge animation
    const scoreValEl = document.getElementById('gaugeScoreText');
    const gaugeProgressEl = document.getElementById('gaugeCircleProgress');
    const readinessLabelEl = document.getElementById('readinessLevelLabel');

    if (scoreValEl) scoreValEl.textContent = matchPercent + "%";
    if (gaugeProgressEl) {
      const circumference = 220; // 2 * pi * r (approx r=35)
      const offset = circumference - (matchPercent / 100) * circumference;
      gaugeProgressEl.style.strokeDashoffset = offset;

      if (matchPercent >= 80) {
        gaugeProgressEl.style.stroke = "var(--success)";
        if (readinessLabelEl) readinessLabelEl.textContent = "Job Ready";
      } else if (matchPercent >= 55) {
        gaugeProgressEl.style.stroke = "var(--primary)";
        if (readinessLabelEl) readinessLabelEl.textContent = "Intermediate";
      } else {
        gaugeProgressEl.style.stroke = "var(--warning)";
        if (readinessLabelEl) readinessLabelEl.textContent = "Foundational";
      }
    }
  }

  // Render Skill Matrix Sliders (Tab 2)
  function renderSkillMatrix() {
    const matrixGrid = document.getElementById('skillMatrixGrid');
    if (!matrixGrid) return;

    const roleData = CAREER_DATA[AppState.profile.targetRole];
    if (!roleData) return;

    let filteredSkills = roleData.skills;
    if (AppState.activeSkillFilter !== 'all') {
      filteredSkills = roleData.skills.filter(s => s.category === AppState.activeSkillFilter);
    }

    matrixGrid.innerHTML = filteredSkills.map(skill => {
      const currentVal = AppState.profile.skillProficiencies[skill.id] !== undefined 
        ? AppState.profile.skillProficiencies[skill.id] 
        : 30;

      return `
        <div class="glass-card skill-card">
          <div class="skill-header">
            <span class="skill-title">${skill.name}</span>
            <span class="skill-cat-tag">${skill.category}</span>
          </div>
          <p class="skill-desc">${skill.description}</p>
          <div class="slider-container">
            <div class="slider-val-row">
              <span>Proficiency: <strong id="val_${skill.id}">${currentVal}%</strong></span>
              <span style="color: var(--text-muted)">Target: ${skill.requiredLevel}%</span>
            </div>
            <input type="range" 
                   id="slider_${skill.id}" 
                   min="0" 
                   max="100" 
                   value="${currentVal}" 
                   data-skill-id="${skill.id}">
          </div>
        </div>
      `;
    }).join('');

    // Attach Input Event to Sliders
    matrixGrid.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const skillId = e.target.getAttribute('data-skill-id');
        const val = parseInt(e.target.value, 10);
        AppState.profile.skillProficiencies[skillId] = val;
        
        const valDisplay = document.getElementById(`val_${skillId}`);
        if (valDisplay) valDisplay.textContent = val + "%";

        saveState();
        renderProfileHeader();
        renderDashboardGaps();
        renderRoadmap();
        drawRadarChart();
      });
    });
  }

  // Render Top Skill Gaps on Dashboard (Tab 1)
  function renderDashboardGaps() {
    const gapListEl = document.getElementById('dashboardGapList');
    if (!gapListEl) return;

    const { gaps } = calculateMatchScore();
    const topGaps = gaps.slice(0, 5); // top 5 gaps

    if (topGaps.length === 0) {
      gapListEl.innerHTML = `<p style="color: var(--text-muted);">Congratulations! You have met or exceeded all target skill levels for this role.</p>`;
      return;
    }

    gapListEl.innerHTML = topGaps.map(g => `
      <div class="gap-item">
        <div class="gap-info">
          <div class="gap-title-row">
            <span class="gap-name">${g.name}</span>
            <span class="badge-urgency urgency-${g.urgency}">${g.urgency}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${g.userLevel}%"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.775rem; color: var(--text-muted); margin-top: 0.25rem;">
            <span>Current: ${g.userLevel}%</span>
            <span>Required: ${g.requiredLevel}%</span>
          </div>
        </div>
        <div class="gap-percentage">-${g.gapValue}%</div>
      </div>
    `).join('');
  }

  // Canvas HTML5 Radar Chart Visualizer
  function drawRadarChart() {
    if (!canvas || !ctx) return;

    // Handle high DPI crisp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio || 400;
    canvas.height = rect.height * window.devicePixelRatio || 340;
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    ctx.clearRect(0, 0, width, height);

    const roleData = CAREER_DATA[AppState.profile.targetRole];
    if (!roleData || !roleData.skills.length) return;

    const skills = roleData.skills;
    const totalSkills = skills.length;
    const angleStep = (Math.PI * 2) / totalSkills;

    // 1. Draw Concentric Polygon Rings (20%, 40%, 60%, 80%, 100%)
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
    levels.forEach(level => {
      ctx.beginPath();
      for (let i = 0; i < totalSkills; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const r = radius * level;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 2. Draw Radial Axes & Skill Labels
    for (let i = 0; i < totalSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      // Label positioning
      const labelX = centerX + (radius + 24) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = Math.abs(labelX - centerX) < 5 ? "center" : (labelX > centerX ? "left" : "right");
      ctx.textBaseline = "middle";

      // Shorten label if too long
      let labelText = skills[i].name;
      if (labelText.length > 18) labelText = labelText.substring(0, 16) + '..';
      ctx.fillText(labelText, labelX, labelY);
    }

    // 3. Draw Target Benchmark Polygon (Cyan stroke)
    ctx.beginPath();
    for (let i = 0; i < totalSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * (skills[i].requiredLevel / 100);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // 4. Draw Student Current Level Polygon (Indigo Filled)
    ctx.beginPath();
    for (let i = 0; i < totalSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const userVal = AppState.profile.skillProficiencies[skills[i].id] || 0;
      const r = radius * (userVal / 100);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(99, 102, 241, 0.35)";
    ctx.fill();
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. Draw Vertices Dots for Student Points
    for (let i = 0; i < totalSkills; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const userVal = AppState.profile.skillProficiencies[skills[i].id] || 0;
      const r = radius * (userVal / 100);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Render Chronological Personalized Roadmap (Tab 3)
  function renderRoadmap() {
    const roadmapContainer = document.getElementById('roadmapPhasesContainer');
    if (!roadmapContainer) return;

    const { gaps } = calculateMatchScore();
    const targetRole = CAREER_DATA[AppState.profile.targetRole];
    const weeklyHours = AppState.profile.weeklyHours || 15;

    // Group gaps into 4 Phases based on priority
    const phase1Skills = gaps.filter(g => g.category === 'core' && g.gapValue > 25);
    const phase2Skills = gaps.filter(g => g.category === 'tools' && g.gapValue > 15);
    const phase3Skills = gaps.filter(g => g.category === 'core' && g.gapValue <= 25 && g.gapValue > 0);
    const phase4Skills = gaps.filter(g => g.category === 'soft' || g.gapValue <= 15);

    const phases = [
      {
        id: "phase1",
        title: "Phase 1: Foundational Mastery",
        time: `Months 1-2 (${Math.round(8 * 4 * (weeklyHours / 15))} Total Hours)`,
        description: "Focus heavily on foundational language mechanics, core algorithms, and mathematics.",
        skills: phase1Skills.length ? phase1Skills : gaps.slice(0, 2)
      },
      {
        id: "phase2",
        title: "Phase 2: Frameworks & Developer Tools",
        time: `Months 3-4 (${Math.round(8 * 4 * (weeklyHours / 15))} Total Hours)`,
        description: "Build proficiency in key developer tools, version control, and core frameworks.",
        skills: phase2Skills.length ? phase2Skills : gaps.slice(2, 4)
      },
      {
        id: "phase3",
        title: "Phase 3: Advanced Projects & Certifications",
        time: "Months 5-6",
        description: "Construct 2 full-stack industry portfolio projects and prepare for certifications.",
        skills: phase3Skills.length ? phase3Skills : gaps.slice(4, 6)
      },
      {
        id: "phase4",
        title: "Phase 4: Capstone & Career Readiness",
        time: "Month 7+",
        description: "Mock technical interviews, open source contributions, and resume polish.",
        skills: phase4Skills.length ? phase4Skills : gaps.slice(6)
      }
    ];

    roadmapContainer.innerHTML = phases.map((phase, pIdx) => `
      <div class="phase-card glass-card">
        <div class="phase-badge"></div>
        <div class="phase-header">
          <div class="phase-title">
            <i class="fa-solid fa-flag-checkered" style="color: var(--primary)"></i>
            ${phase.title}
          </div>
          <span class="phase-time">${phase.time}</span>
        </div>
        <div style="padding: 0.5rem 1.5rem 0 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
          ${phase.description}
        </div>
        <div class="phase-tasks">
          ${phase.skills.map((sk, tIdx) => {
            const taskId = `${phase.id}_task_${sk.id}`;
            const isChecked = AppState.completedTasks[taskId] || false;
            const resources = SKILL_RESOURCES[sk.id] || [];

            return `
              <div class="task-item">
                <input type="checkbox" 
                       class="task-checkbox" 
                       id="${taskId}" 
                       ${isChecked ? 'checked' : ''} 
                       data-task-id="${taskId}">
                <div class="task-content">
                  <div class="task-name" style="${isChecked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                    Bridge ${sk.name} (Current: ${sk.userLevel}% &rarr; Goal: ${sk.requiredLevel}%)
                  </div>
                  <div class="task-meta">
                    <span><i class="fa-solid fa-clock"></i> Est: ${Math.ceil(sk.gapValue / 5)} Days</span>
                    ${resources.length > 0 ? `
                      <a href="${resources[0].url}" target="_blank" rel="noopener" class="resource-btn">
                        <i class="fa-solid fa-book"></i> ${resources[0].title}
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Attach Checkbox Change Event
    roadmapContainer.querySelectorAll('.task-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const taskId = e.target.getAttribute('data-task-id');
        AppState.completedTasks[taskId] = e.target.checked;
        saveState();
        renderRoadmap();
      });
    });
  }

  // Render Market Insights, Salary Tiers & Matching Job Postings (Tab 4)
  async function renderMarketInsights() {
    const marketContainer = document.getElementById('marketInsightsContainer');
    if (!marketContainer) return;

    const roleData = CAREER_DATA[AppState.profile.targetRole];
    if (!roleData) return;

    const { matchPercent } = calculateMatchScore();

    // Use JobMatcherModule to load and evaluate job data
    let matchedJobs = { activeJobs: [] };
    if (typeof JobMatcherModule !== 'undefined') {
      const jobData = await JobMatcherModule.loadJobs();
      matchedJobs = JobMatcherModule.matchTrackJobs(AppState.profile.targetRole, matchPercent, jobData);
    }

    const jobCardsHTML = (typeof JobMatcherModule !== 'undefined' && matchedJobs.activeJobs.length > 0)
      ? JobMatcherModule.generateJobCardsHTML(matchedJobs.activeJobs, matchPercent)
      : '';

    marketContainer.innerHTML = `
      <div class="market-grid">
        <!-- Salary Benchmark Card -->
        <div class="glass-card card-body">
          <h3 class="card-title" style="margin-bottom: 1rem;">
            <i class="fa-solid fa-money-bill-wave"></i> Average Salary Benchmark
          </h3>
          <p style="font-size: 0.875rem; color: var(--text-muted);">
            Industry standard compensation for <strong>${roleData.title}</strong> across experience levels.
          </p>
          <div class="salary-boxes">
            <div class="salary-box">
              <div class="salary-label">Entry Level</div>
              <div class="salary-amount">${roleData.avgSalary.entry}</div>
            </div>
            <div class="salary-box">
              <div class="salary-label">Mid Level</div>
              <div class="salary-amount">${roleData.avgSalary.mid}</div>
            </div>
            <div class="salary-box">
              <div class="salary-label">Senior</div>
              <div class="salary-amount">${roleData.avgSalary.senior}</div>
            </div>
          </div>
        </div>

        <!-- Demand & Hiring Industries -->
        <div class="glass-card card-body">
          <h3 class="card-title" style="margin-bottom: 1rem;">
            <i class="fa-solid fa-chart-line"></i> Market Demand & Top Sectors
          </h3>
          <div style="margin-bottom: 1rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Demand Index:</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">${roleData.demandLevel}</div>
          </div>
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">
              Top Hiring Industries:
            </span>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${roleData.topIndustries.map(ind => `
                <span style="background: rgba(255,255,255,0.06); padding: 0.3rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">
                  <i class="fa-solid fa-building" style="color: var(--cyan-gradient); margin-right: 4px;"></i> ${ind}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Active Job Postings & Match Eligibility (Rendered via JobMatcherModule) -->
      ${jobCardsHTML ? `
        <div class="glass-card card-body" style="margin-top: 1.5rem;">
          <h3 class="card-title" style="margin-bottom: 0.5rem;">
            <i class="fa-solid fa-briefcase"></i> Real-Time Matched Job Openings & Internships
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Loaded from <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">job_data.json</code> — Evaluated using <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">job-matcher.js</code>.
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${jobCardsHTML}
          </div>
        </div>
      ` : ''}

      <!-- Essential Certifications -->
      <div class="glass-card card-body" style="margin-top: 1.5rem;">
        <h3 class="card-title" style="margin-bottom: 1rem;">
          <i class="fa-solid fa-certificate"></i> High-Value Industry Certifications
        </h3>
        <div class="cert-list">
          ${roleData.certifications.map(cert => `
            <div class="cert-card">
              <div style="font-weight: 700; font-size: 0.95rem;">${cert.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 1.5rem; margin-top: 0.25rem;">
                <span><i class="fa-solid fa-award"></i> Issued by: ${cert.provider}</span>
                <span><i class="fa-solid fa-clock"></i> Est Prep: ${cert.duration}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Initialize SkillBot AI Chatbot (Tab 5)
  function initChatBot() {
    const chatMessagesEl = document.getElementById('chatMessages');
    const chatInputEl = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const promptBtns = document.querySelectorAll('.prompt-btn');

    if (!chatMessagesEl) return;

    // Send Message Handler
    function handleSendMessage(text) {
      if (!text || !text.trim()) return;

      // Add User Message
      appendMessage(text, 'user');
      if (chatInputEl) chatInputEl.value = '';

      // Generate AI Response
      setTimeout(() => {
        const response = generateAIResponse(text.toLowerCase());
        appendMessage(response, 'bot');
      }, 500);
    }

    function appendMessage(content, sender) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`;
      msgDiv.innerHTML = content;
      chatMessagesEl.appendChild(msgDiv);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }

    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', () => {
        handleSendMessage(chatInputEl.value);
      });
    }

    if (chatInputEl) {
      chatInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage(chatInputEl.value);
      });
    }

    promptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.replace(/^[^\w]+/, '');
        handleSendMessage(text);
      });
    });
  }

  // Generate Simulated Smart AI Responses
  function generateAIResponse(input) {
    const roleData = CAREER_DATA[AppState.profile.targetRole];
    const { gaps, matchPercent } = calculateMatchScore();

    if (input.includes('weak') || input.includes('first') || input.includes('focus')) {
      const topGap = gaps[0];
      if (topGap) {
        return `Based on your profile for <strong>${roleData.title}</strong>, your largest skill gap is in <strong>${topGap.name}</strong> (you are at ${topGap.userLevel}% vs target ${topGap.requiredLevel}%). I recommend focusing 60% of your study time on this skill first!`;
      }
    }

    if (input.includes('certif')) {
      const cert = roleData.certifications[0];
      return `For <strong>${roleData.title}</strong>, the top recommended certification is <strong>${cert.name}</strong> issued by ${cert.provider}. Preparation takes roughly ${cert.duration}.`;
    }

    if (input.includes('hours') || input.includes('time')) {
      return `With your current commitment of <strong>${AppState.profile.weeklyHours} hours/week</strong>, you are on track to reach a 90%+ match score in approximately <strong>${Math.max(3, Math.round(10 - AppState.profile.weeklyHours / 3))} months</strong>.`;
    }

    if (input.includes('interview')) {
      return `To prepare for <strong>${roleData.title}</strong> interviews: <br>1. Be ready to explain your projects on GitHub.<br>2. Practice coding problem solving for ${gaps[0] ? gaps[0].name : 'core skills'}.<br>3. Prepare STAR method stories for technical decision-making.`;
    }

    return `That's a great question! For a <strong>${roleData.title}</strong> (current match score: ${matchPercent}%), continuing to complete your <strong>Phase 1 roadmap milestones</strong> will yield the highest performance gains. Let me know if you need specific course links!`;
  }

  // Kickstart App
  init();
});
