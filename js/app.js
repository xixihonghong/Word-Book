/* 拾词 · 界面与交互
   无构建、无框架，所有页面由同一个 app.js 渲染。 */
(function () {
  "use strict";

  var WB = window.WB;
  var store = WB.store;
  var api = WB.api;
  var appEl = document.getElementById("app");
  var overlayEl = document.getElementById("overlay-root");
  var toastEl = document.getElementById("toast-root");

  var S = {
    route: "home",
    session: null,
    modal: null,
    library: { q: "", filter: "all", sort: "recent" },
    photo: blankPhoto()
  };

  var TYPE_LABEL = {
    meaning: "看词选义",
    cloze: "例句填空",
    context: "语境辨义"
  };

  var STATUS_LABEL = {
    new: "新词",
    due: "待复习",
    learning: "学习中",
    mastered: "已掌握",
    pending: "待补充"
  };

  /* ---------------- 图标 ---------------- */

  var ICONS = {
    leaf: '<path d="M20 4C11 4 4 9 4 16c0 2.6 2 4 4 4 7 0 12-7 12-16Z"/><path d="M4 21c2-6 6-10 13-14"/>',
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
    library: '<path d="M4 3h12a4 4 0 0 1 4 4v14H6a2 2 0 0 1-2-2V3Z"/><path d="M8 3v18"/><path d="M4 17h16"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="14" r="3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-6-4-8 0 3-2 4-3 5-1-2-1-4-1-6-2 2-6 6-6 10 0 3 3 6 7 6Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V7"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m10 7-5 5 5 5"/>',
    play: '<path d="m9 6 9 6-9 6V6Z" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    close: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6a8 8 0 0 1 0 12"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    refresh: '<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 9a7 7 0 0 1 11.4-2L20 10"/><path d="M4 14l2.5 3a7 7 0 0 0 11.4-2"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m6 7 1 14h10l1-14"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    download: '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
    settings: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9"/><path d="m17 4 3 3"/><path d="m14 7 3 3"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    eyeOff: '<path d="m3 3 18 18"/><path d="M10.5 6.3A11 11 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.8"/><path d="M6.2 6.2C3.6 8 2 12 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.3-.6"/><path d="M10 10a2.5 2.5 0 0 0 3.5 3.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 10h18"/>',
    chevronRight: '<path d="m9 5 7 7-7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    wifi: '<path d="M3 9a15 15 0 0 1 18 0"/><path d="M6 12a10 10 0 0 1 12 0"/><path d="M9 15a5 5 0 0 1 6 0"/><path d="M12 19h.01"/>',
    alert: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    bookOpen: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H11v18H5.5A2.5 2.5 0 0 0 3 23V5.5Z"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H13v18h5.5A2.5 2.5 0 0 1 21 23V5.5Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || ICONS.leaf;
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  function brandMark() {
    return '<span class="brand-mark">' + icon("leaf") + "</span>";
  }

  /* ---------------- 基础工具 ---------------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function blankPhoto() {
    return {
      file: null,
      preview: "",
      status: "idle",
      progress: 0,
      progressLabel: "",
      candidates: [],
      text: "",
      confidence: 0,
      error: "",
      adding: null,
      manualText: "",
      cloud: false,
      aiMap: {},
      aiReviewing: false,
      job: 0
    };
  }

  function resetPhoto(keepManual) {
    var manual = keepManual ? S.photo.manualText : "";
    if (S.photo.preview) {
      try { URL.revokeObjectURL(S.photo.preview); } catch (err) {}
    }
    S.photo = blankPhoto();
    S.photo.manualText = manual;
  }

  function dateLabel(date) {
    var d = date ? new Date(date) : new Date();
    var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    return d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." +
      String(d.getDate()).padStart(2, "0") + " · 星期" + weekdays[d.getDay()];
  }

  function greeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 11) return "早上好";
    if (h >= 11 && h < 13) return "中午好";
    if (h >= 13 && h < 18) return "下午好";
    return "晚上好";
  }

  function timeAgo(ts) {
    if (!ts) return "还没有复习过";
    var diff = Date.now() - Number(ts);
    if (diff < 60e3) return "刚刚";
    if (diff < 36e5) return Math.round(diff / 60e3) + " 分钟前";
    if (diff < 864e5) return Math.round(diff / 36e5) + " 小时前";
    if (diff < 7 * 864e5) return Math.round(diff / 864e5) + " 天前";
    var d = new Date(ts);
    return (d.getMonth() + 1) + " 月 " + d.getDate() + " 日";
  }

  function levelTag(word) {
    var level = word && word.level ? word.level : "EXTRA";
    return '<span class="level-tag level-' + level.toLowerCase() + '">' +
      esc(WB.LEVELS[level] || "拓展") + "</span>";
  }

  function statusPill(word) {
    var status = store.statusOf(word);
    return '<span class="status-pill status-' + status + '"><i></i>' +
      esc(store.dueText(word)) + "</span>";
  }

  function primary(word) {
    return store.primaryMeaning(word);
  }

  function hasStudyWords() {
    return store.getWords().some(function (w) { return !w.needsMeaning && w.meanings.length; });
  }

  function sessionSize() {
    return Math.max(5, Math.min(10, store.getSettings().dailyGoal));
  }

  function aiReady() {
    var ai = store.getSettings().ai;
    return !!(ai && ai.enabled && ai.apiKey);
  }

  function progressRing(percent, centerMain, centerSub, size) {
    var p = Math.max(0, Math.min(1, percent || 0));
    var r = 52;
    var circumference = 2 * Math.PI * r;
    var offset = circumference * (1 - p);
    return '<div class="progress-ring" style="width:' + (size || 156) + 'px;height:' + (size || 156) + 'px">' +
      '<svg viewBox="0 0 128 128" aria-hidden="true">' +
      '<circle class="ring-track" cx="64" cy="64" r="' + r + '"/>' +
      '<circle class="ring-value" cx="64" cy="64" r="' + r + '" style="stroke-dasharray:' +
      circumference.toFixed(2) + ";stroke-dashoffset:" + offset.toFixed(2) + '"/>' +
      "</svg>" +
      '<div class="ring-label"><strong>' + esc(centerMain) + "</strong>" +
      (centerSub ? "<span>" + esc(centerSub) + "</span>" : "") + "</div></div>";
  }

  /* ---------------- 启动与路由 ---------------- */

  function seedMyWords() {
    var flag = "shici.mywords.v1";
    try {
      if (localStorage.getItem(flag) === "1") return;
    } catch (err) {
      return;
    }
    if (!window.WB || !Array.isArray(WB.MY_WORDS)) return;
    var added = 0;
    WB.MY_WORDS.forEach(function (w) {
      var res = store.addWord(w, "handwriting");
      if (res && res.ok && res.added) added += 1;
    });
    try { localStorage.setItem(flag, "1"); } catch (err) {}
    if (added) console.info("拾词：已加入 " + added + " 个手写词库单词");
  }

  function init() {
    store.init();
    seedMyWords();
    bindEvents();
    var initial = parseHash();
    if (initial === "quiz" && !S.session) initial = "home";
    S.route = initial;
    render();
  }

  function parseHash() {
    var h = String(location.hash || "").replace(/^#\/?/, "").split("?")[0];
    return ["home", "library", "photo", "settings", "quiz"].indexOf(h) >= 0 ? h : "home";
  }

  function navigate(route) {
    if (S.route === "quiz" && route !== "quiz" && S.session && !S.session.finished) {
      if (!window.confirm("离开这次练习吗？已经作答的记录会保留。")) return;
    }
    closeModal();
    if (route !== "quiz") S.session = null;
    if (S.route === route) {
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    S.route = route;
    if (location.hash === "#/" + route) {
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      location.hash = "#/" + route;
    }
  }

  function syncRoute() {
    var route = parseHash();
    if (S.route === "quiz" && route !== "quiz" && S.session && !S.session.finished) {
      if (!window.confirm("离开这次练习吗？已经作答的记录会保留。")) {
        location.hash = "#/quiz";
        return;
      }
    }
    if (route === "quiz" && !S.session) {
      S.route = "home";
      if (location.hash !== "#/home") {
        location.hash = "#/home";
      } else {
        render();
      }
      return;
    }
    if (route !== "quiz") S.session = null;
    S.route = route;
    closeModal();
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function render() {
    if (S.route === "quiz" && !S.session) S.route = "home";
    document.body.classList.toggle("quiz-mode", S.route === "quiz");
    document.body.classList.toggle("modal-open", !!S.modal);
    document.body.classList.toggle("reduce-motion", !!store.getSettings().reduceMotion);
    document.title = S.route === "quiz" ? "练习 · 拾词" : "拾词 · 四六级单词本";
    if (S.route === "quiz") {
      appEl.innerHTML = renderQuizScreen();
    } else {
      appEl.innerHTML = renderShell(S.route);
    }
    renderOverlay();
  }

  function renderShell(route) {
    var stats = store.stats();
    var content;
    if (route === "library") content = renderLibrary();
    else if (route === "photo") content = renderPhoto();
    else if (route === "settings") content = renderSettings();
    else content = renderHome(stats);
    return '<div class="app-shell">' +
      renderSidebar(route, stats) +
      '<main class="main">' + renderMobileHeader(stats) +
      '<div class="view view-' + route + '">' + content + "</div></main>" +
      renderBottomNav(route, stats) + "</div>";
  }

  function navItems() {
    return [
      { route: "home", label: "今日", icon: "home" },
      { route: "library", label: "词库", icon: "library" },
      { route: "photo", label: "拍照", icon: "camera" },
      { route: "settings", label: "我的", icon: "user" }
    ];
  }

  function renderSidebar(route, stats) {
    var goal = stats.goal;
    var done = stats.todayTotal;
    var pct = Math.min(100, Math.round(done / Math.max(1, goal) * 100));
    var items = navItems().map(function (item) {
      var active = route === item.route ? " active" : "";
      var badge = item.route === "home" && stats.due ? '<span class="nav-badge">' + stats.due + "</span>" : "";
      return '<a class="nav-item' + active + '" href="#/' + item.route + '" data-nav="' + item.route + '">' +
        icon(item.icon) + "<span>" + item.label + "</span>" + badge + "</a>";
    }).join("");
    return '<aside class="sidebar">' +
      '<a class="brand" href="#/home" data-nav="home">' + brandMark() +
      '<span class="brand-text"><strong>拾词</strong><small>CET WORDBOOK</small></span></a>' +
      '<nav class="side-nav" aria-label="主要导航">' + items + "</nav>" +
      '<div class="sidebar-spacer"></div>' +
      '<div class="sidebar-focus">' +
      '<div class="focus-top"><span>今日目标</span><strong>' + done + "<small>/" + goal + "</small></strong></div>" +
      '<div class="mini-bar"><i style="width:' + pct + '%"></i></div>' +
      '<p>' + (stats.due ? stats.due + " 个词到了复习时间" : "今天还没有到期复习") + "</p>" +
      '<a href="#/home" data-nav="home">去学习 ' + icon("arrowRight") + "</a></div>" +
      '<div class="sidebar-foot"><span class="dot-live"></span> EBBINGHAUS · 本地优先</div>' +
      "</aside>";
  }

  function renderMobileHeader(stats) {
    return '<header class="mobile-head"><a class="brand mini" href="#/home" data-nav="home">' +
      brandMark() + '<span class="brand-text"><strong>拾词</strong><small>CET WORDBOOK</small></span></a>' +
      '<span class="streak-chip">' + icon("flame") + stats.streak + " 天</span></header>";
  }

  function renderBottomNav(route, stats) {
    var items = navItems().map(function (item) {
      var active = route === item.route ? " active" : "";
      var camera = item.route === "photo" ? " tab-camera" : "";
      var badge = item.route === "home" && stats.due ? '<i class="tab-dot"></i>' : "";
      return '<a class="tab' + active + camera + '" href="#/' + item.route + '" data-nav="' + item.route + '">' +
        '<span class="tab-icon">' + icon(item.icon) + badge + "</span><span>" + item.label + "</span></a>";
    }).join("");
    return '<nav class="bottom-nav" aria-label="底部导航">' + items + "</nav>";
  }

  /* ---------------- 首页 ---------------- */

  function renderHome(stats) {
    var goal = stats.goal;
    var done = stats.todayTotal;
    var due = stats.due;
    var fresh = stats.fresh;
    var progress = Math.min(1, done / Math.max(1, goal));
    var canStudy = hasStudyWords();
    var cta;
    var ctaAction = "start-session";
    if (!canStudy) {
      cta = stats.totalWords ? "补充词条释义" : "添加第一组词";
      ctaAction = stats.totalWords ? "go-library" : "go-photo";
    } else if (due > 0) {
      cta = "开始今日复习";
    } else if (fresh > 0) {
      cta = "认识今天的新词";
    } else {
      cta = "再练一组";
    }
    var nextText = stats.nextDue ? store.dueText(stats.nextDue) : "完成本轮后生成";
    return '<section class="hero">' +
      '<div class="hero-copy">' +
      '<div class="kicker"><span class="kicker-dot"></span>' + dateLabel() +
      '<span class="kicker-sep">/</span>' + greeting() + "</div>" +
      '<h1>把遇见的词，<br><em>留下来。</em></h1>' +
      '<p class="hero-lede">今天有 <strong>' + due + "</strong> 个词到了复习时间" +
      (fresh ? "，还有 <strong>" + fresh + "</strong> 个新词等你认识" : "") +
      "。按自己的节奏来，记住比记住多少更重要。</p>" +
      '<div class="hero-actions">' +
      '<button class="btn btn-primary btn-lg" data-action="' + ctaAction + '">' +
      icon(ctaAction === "start-session" ? "play" : (ctaAction === "go-photo" ? "camera" : "edit")) +
      cta + '<span class="btn-arrow">' + icon("arrowRight") + "</span></button>" +
      '<button class="btn btn-ghost" data-action="go-photo">' + icon("camera") + "拍照识词</button>" +
      "</div>" +
      '<div class="hero-meta"><span>' + icon("clock") + "每轮约 " + sessionSize() + " 个词</span>" +
      '<span>' + icon("sparkles") + "三题型混合</span><span>" + icon("wifi") + "可离线复习</span></div>" +
      "</div>" +
      '<div class="hero-side">' +
      '<div class="hero-ring-wrap">' + progressRing(progress, done + "/" + goal, "今日进度") +
      '<div class="ring-note">' +
      '<span class="ring-note-dot"></span><div><small>下一次复习</small><strong>' + esc(nextText) + "</strong></div></div>" +
      "</div>" +
      '<div class="hero-quote"><span>“</span><p>记忆不是一次完成的，<br>它需要被温柔地打扰几次。</p></div>' +
      "</div></section>" +

      '<section class="stat-strip">' +
      statCard("flame", stats.streak, "连续学习", stats.streak ? "保持这个节奏" : "今天开始第一天", "green") +
      statCard("target", done + " / " + goal, "今日进度", progress >= 1 ? "今天的目标完成了" : "还差 " + Math.max(0, goal - done) + " 个", "amber") +
      statCard("chart", stats.hasAccuracy ? stats.accuracy7 + "%" : "—", "近 7 日正确率", stats.hasAccuracy ? "根据你的作答计算" : "答题后生成", "blue") +
      statCard("leaf", stats.mastered, "已掌握", "复习间隔 ≥ 7 天", "rose") +
      "</section>" +

      '<div class="dashboard-grid">' +
      renderPlanCard(stats, canStudy, cta, ctaAction) +
      renderCurveCard(stats) +
      renderRecentCard() +
      renderMethodCard() +
      "</div>";
  }

  function statCard(iconName, value, label, sub, tone) {
    return '<div class="stat-card tone-' + tone + '">' +
      '<div class="stat-icon">' + icon(iconName) + "</div>" +
      '<div class="stat-body"><strong>' + esc(value) + "</strong><span>" + esc(label) + "</span></div>" +
      '<small>' + esc(sub) + "</small></div>";
  }

  function renderPlanCard(stats, canStudy, cta, ctaAction) {
    var goal = stats.goal;
    var done = stats.todayTotal;
    var pct = Math.min(100, Math.round(done / Math.max(1, goal) * 100));
    return '<section class="card plan-card">' +
      '<div class="card-head"><div><span class="eyebrow">TODAY&#39;S PLAN</span>' +
      "<h2>今日任务</h2></div><span class=\"date-stamp\">" + dateLabel().split(" · ")[0] + "</span></div>" +
      '<div class="plan-progress"><div class="plan-progress-bar"><i style="width:' + pct + '%"></i></div>' +
      "<span>" + done + " / " + goal + "</span></div>" +
      '<div class="plan-list">' +
      planRow("clock", "到期复习", stats.due, stats.due ? "先复习，再认识新词" : "暂时没有到期的词", "green") +
      planRow("sparkles", "新词", stats.fresh, stats.fresh ? "按" + (WB.LEVELS[store.getSettings().level] || "四六级") + "优先" : "新词已经学完了", "amber") +
      planRow("check", "今日已完成", done, "目标 " + goal + " 个", "blue") +
      "</div>" +
      '<div class="plan-foot"><div><strong>' + sessionSize() + " 个词</strong><span>约 3–5 分钟</span></div>" +
      '<button class="btn btn-primary" data-action="' + ctaAction + '">' + esc(cta) + icon("arrowRight") + "</button></div>" +
      "</section>";
  }

  function planRow(iconName, title, count, desc, tone) {
    return '<div class="plan-row">' +
      '<span class="plan-icon tone-' + tone + '">' + icon(iconName) + "</span>" +
      '<div class="plan-copy"><strong>' + esc(title) + "</strong><span>" + esc(desc) + "</span></div>" +
      '<strong class="plan-count">' + esc(count) + "</strong></div>";
  }

  function renderCurveCard(stats) {
    var nextText = stats.nextDue ? store.dueText(stats.nextDue) : "完成本轮后生成";
    return '<section class="card curve-card">' +
      '<div class="card-head"><div><span class="eyebrow">EBBINGHAUS</span><h2>记忆节奏</h2></div>' +
      '<span class="soft-badge">9 个间隔</span></div>' +
      '<div class="curve-canvas"><svg viewBox="0 0 440 138" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="curve-grid" d="M12 110H428"/>' +
      '<path class="curve-line" d="M12 26 C44 26 50 100 82 110 L82 26 C114 26 120 94 152 106 L152 26 ' +
      'C184 26 190 88 222 101 L222 26 C254 26 260 80 292 94 L292 26 C324 26 330 70 362 84 L362 26 C394 26 400 55 426 66"/>' +
      '<g class="curve-dots"><circle cx="12" cy="26" r="4"/><circle cx="82" cy="26" r="4"/><circle cx="152" cy="26" r="4"/>' +
      '<circle cx="222" cy="26" r="4"/><circle cx="292" cy="26" r="4"/><circle cx="362" cy="26" r="4"/>' +
      '<circle cx="426" cy="66" r="4"/></g></svg></div>' +
      '<div class="curve-labels"><span>5m</span><span>30m</span><span>12h</span><span>1d</span><span>4d</span><span>7d</span><span>30d</span></div>' +
      '<p class="curve-copy">答对前进一格，答错退回两格。间隔会随着记忆变稳逐渐拉长。</p>' +
      '<div class="curve-next"><span class="pulse-dot"></span><div><small>下一次</small><strong>' + esc(nextText) + "</strong></div>" +
      '<span class="curve-next-tag">自动安排</span></div></section>';
  }

  function renderRecentCard() {
    var words = store.recentWords(4);
    var rows = words.map(function (w) {
      return '<div class="mini-word" data-action="open-word" data-id="' + esc(w.id) + '" role="button" tabindex="0">' +
        '<div class="mini-word-main"><strong>' + esc(w.term) + "</strong>" + levelTag(w) + "</div>" +
        '<span class="mini-word-def">' + esc(primary(w)) + "</span>" +
        '<span class="mini-word-due">' + esc(store.dueText(w)) + "</span>" +
        '<button class="icon-btn tiny" data-action="speak-word" data-id="' + esc(w.id) + '" aria-label="朗读 ' + esc(w.term) + '">' +
        icon("volume") + "</button></div>";
    }).join("");
    return '<section class="card recent-card">' +
      '<div class="card-head"><div><span class="eyebrow">RECENTLY ADDED</span><h2>最近收录</h2></div>' +
      '<a class="text-link" href="#/library" data-nav="library">全部词库 ' + icon("arrowRight") + "</a></div>" +
      '<div class="mini-list">' + (rows || '<p class="muted">还没有词，拍一张照片或手动添加吧。</p>') + "</div>" +
      '<button class="add-row" data-action="open-add">' + icon("plus") + "添加一个词</button></section>";
  }

  function renderMethodCard() {
    return '<section class="card method-card">' +
      '<div class="card-head"><div><span class="eyebrow">HOW IT ASKS</span><h2>三种问法</h2></div>' +
      '<span class="method-mark">' + icon("layers") + "</span></div>" +
      '<div class="method-list">' +
      methodItem("01", "看词选义", "从四个中文释义里认出它") +
      methodItem("02", "例句填空", "把词放回四六级难度的句子里") +
      methodItem("03", "语境辨义", "读句子，判断它此刻的意思") +
      "</div>" +
      '<div class="method-foot"><span>' + icon("sparkles") + "每轮混合出题</span>" +
      '<button class="text-link" data-action="start-session">开始一组 ' + icon("arrowRight") + "</button></div></section>";
  }

  function methodItem(num, title, desc) {
    return '<div class="method-item"><span class="method-num">' + num + "</span>" +
      '<div><strong>' + esc(title) + "</strong><span>" + esc(desc) + "</span></div></div>";
  }

  /* ---------------- 词库 ---------------- */

  function pageHead(eyebrow, title, desc, actions) {
    return '<header class="page-head"><div class="page-head-copy">' +
      '<span class="eyebrow">' + eyebrow + "</span><h1>" + title + "</h1><p>" + desc + "</p></div>" +
      '<div class="page-actions">' + (actions || "") + "</div></header>";
  }

  function countWords(words) {
    var now = Date.now();
    var c = { all: words.length, new: 0, due: 0, learning: 0, mastered: 0, pending: 0 };
    words.forEach(function (w) {
      if (w.needsMeaning) { c.pending += 1; return; }
      if (w.reps === 0) c.new += 1;
      else if (w.stage >= 7) c.mastered += 1;
      else c.learning += 1;
      if (w.reps > 0 && w.due <= now) c.due += 1;
    });
    return c;
  }

  function renderLibrary() {
    var all = store.getWords();
    var counts = countWords(all);
    var settings = store.getSettings();
    var actions = '<button class="btn btn-primary" data-action="open-add">' + icon("plus") + "添加单词</button>" +
      '<button class="btn btn-ghost" data-action="go-photo">' + icon("camera") + "拍照导入</button>";
    var chips = [
      ["all", "全部", counts.all],
      ["new", "新词", counts.new],
      ["due", "待复习", counts.due],
      ["learning", "学习中", counts.learning],
      ["mastered", "已掌握", counts.mastered],
      ["pending", "待补充", counts.pending]
    ].map(function (row) {
      return '<button class="filter-chip' + (S.library.filter === row[0] ? " active" : "") +
        '" data-action="filter-library" data-filter="' + row[0] + '">' + row[1] +
        '<span>' + row[2] + "</span></button>";
    }).join("");
    var sortOptions = [
      ["recent", "最近添加"],
      ["alpha", "字母顺序"],
      ["due", "复习时间"]
    ].map(function (row) {
      return '<option value="' + row[0] + '"' + (S.library.sort === row[0] ? " selected" : "") + ">" + row[1] + "</option>";
    }).join("");
    return pageHead("YOUR WORDS", "我的词库",
      "收集你在阅读、听力和照片里遇到的词。" +
      (counts.pending ? " 有 " + counts.pending + " 个词还等着补充释义。" : " 所有词都排好了复习时间。"),
      actions) +
      '<section class="library-stats">' +
      '<div><strong>' + counts.all + '</strong><span>词库总量</span></div>' +
      '<div><strong>' + counts.learning + '</strong><span>正在学习</span></div>' +
      '<div><strong>' + counts.mastered + '</strong><span>已经掌握</span></div>' +
      '<div><strong>' + settings.dailyGoal + '</strong><span>每日目标</span></div>' +
      "</section>" +
      '<section class="card full-quiz-card">' +
      '<div class="full-quiz-copy"><span class="eyebrow">FULL RUN</span><h2>全库闯关</h2>' +
      "<p>词库里 " + (counts.all - counts.pending) + " 个有释义的词随机出现；第一次答对就直接过，第一次答错则要再连续答对 3 次，同一个词不会连着出现。</p></div>" +
      '<button class="btn btn-primary" data-action="start-full-quiz">' + icon("play") + "开始全库闯关</button></section>" +
      '<section class="library-toolbar">' +
      '<div class="search-field">' + icon("search") +
      '<input id="library-search" type="search" autocomplete="off" placeholder="搜单词、释义或例句" value="' + esc(S.library.q) + '">' +
      '<button class="search-clear" data-action="clear-search" aria-label="清空搜索">' + icon("close") + "</button></div>" +
      '<div class="filter-chips">' + chips + "</div>" +
      '<div class="sort-field"><span>排序</span><select id="library-sort" aria-label="排序">' + sortOptions + "</select></div>" +
      "</section>" +
      '<section class="card library-card"><div class="library-list" id="library-list">' +
      renderLibraryList() + "</div></section>" +
      '<p class="foot-note">' + icon("shield") + "词库与复习记录只保存在这个浏览器里；清除浏览器数据前记得先导出备份。</p>";
  }

  function filterWords() {
    var words = store.getWords().slice();
    var q = S.library.q.trim().toLowerCase();
    var now = Date.now();
    if (q) {
      words = words.filter(function (w) {
        var hay = [w.term, store.fullMeaning(w), w.example && w.example.en, w.example && w.example.zh]
          .concat((w.phrases || []).map(function (p) { return p.en + " " + p.zh; }))
          .join(" ").toLowerCase();
        return hay.indexOf(q) >= 0;
      });
    }
    if (S.library.filter === "new") words = words.filter(function (w) { return !w.needsMeaning && w.reps === 0; });
    else if (S.library.filter === "due") words = words.filter(function (w) { return !w.needsMeaning && w.reps > 0 && w.due <= now; });
    else if (S.library.filter === "learning") words = words.filter(function (w) { return !w.needsMeaning && w.reps > 0 && w.stage < 7; });
    else if (S.library.filter === "mastered") words = words.filter(function (w) { return !w.needsMeaning && w.reps > 0 && w.stage >= 7; });
    else if (S.library.filter === "pending") words = words.filter(function (w) { return w.needsMeaning; });

    if (S.library.sort === "alpha") {
      words.sort(function (a, b) { return a.term.localeCompare(b.term); });
    } else if (S.library.sort === "due") {
      words.sort(function (a, b) {
        var ad = a.needsMeaning ? Infinity : (a.reps === 0 ? Infinity - 1 : a.due);
        var bd = b.needsMeaning ? Infinity : (b.reps === 0 ? Infinity - 1 : b.due);
        return ad - bd;
      });
    } else {
      words.sort(function (a, b) { return b.createdAt - a.createdAt; });
    }
    return words;
  }

  function renderLibraryList() {
    var words = filterWords();
    if (!words.length) {
      return '<div class="empty-state">' + icon("bookOpen") +
        "<h3>" + (S.library.q ? "没有找到匹配的词" : "这里还没有词") + "</h3>" +
        "<p>" + (S.library.q ? "换一个关键词，或清空搜索看看全部词库。" : "拍一张单词书，或手动添加第一个词。") + "</p>" +
        '<button class="btn btn-primary" data-action="' + (S.library.q ? "clear-search" : "open-add") + '">' +
        icon(S.library.q ? "refresh" : "plus") + (S.library.q ? "清空搜索" : "添加单词") + "</button></div>";
    }
    return words.map(function (w) {
      var status = store.statusOf(w);
      return '<article class="word-row" data-action="open-word" data-id="' + esc(w.id) + '" role="button" tabindex="0" aria-label="查看 ' + esc(w.term) + '">' +
        '<div class="word-row-main"><div class="word-row-title"><strong>' + esc(w.term) + "</strong>" +
        levelTag(w) + "</div><span class=\"word-row-phon\">" + esc(w.phonetic || "音标待补充") + "</span></div>" +
        '<div class="word-row-meaning"><span class="pos-inline">' + esc(w.pos || "") + "</span>" +
        esc(primary(w)) + (w.needsMeaning ? '<span class="pending-note">待补充释义</span>' : "") + "</div>" +
        '<div class="word-row-side">' + statusPill(w) +
        '<span class="row-status-text">' + STATUS_LABEL[status] + "</span>" +
        '<button class="icon-btn tiny" data-action="speak-word" data-id="' + esc(w.id) + '" aria-label="朗读 ' + esc(w.term) + '">' +
        icon("volume") + "</button>" +
        '<span class="row-chevron">' + icon("chevronRight") + "</span></div></article>";
    }).join("");
  }

  /* ---------------- 拍照 ---------------- */

  function renderPhoto() {
    var p = S.photo;
    var scanning = p.status === "scanning";
    return pageHead("SCAN & KEEP", "拍一张，<em>收一页词</em>",
      "从单词书、试卷或截屏里识别英文单词，再联网补上四六级释义、例句和读音。",
      '<span class="privacy-chip">' + icon("shield") + (p.cloud ? "已使用云端增强" : "图片不上传 · 本地 OCR") + "</span>") +
      '<div class="photo-grid">' +
      '<section class="card upload-card">' +
      '<div class="card-head"><div><span class="eyebrow">STEP 01</span><h2>放入图片</h2></div>' +
      (p.preview ? '<span class="soft-badge">' + (scanning ? "识别中" : "已载入") + "</span>" : "") + "</div>" +
      (location.protocol === "file:" ? '<div class="inline-error soft">' + icon("info") +
        "<span>拍照识别需要通过本地服务打开：请双击文件夹里的「启动单词本.bat」，再访问 http://localhost:8080。</span></div>" : "") +
      (p.preview
        ? '<div class="preview-frame' + (scanning ? " scanning" : "") + '">' +
          '<img src="' + esc(p.preview) + '" alt="待识别的单词图片">' +
          (scanning ? '<div class="scan-overlay"><span class="scan-line"></span></div>' : "") +
          '<div class="preview-actions">' +
          (scanning ? "" : '<button class="btn btn-small btn-white" data-action="cloud-ocr">' + icon("sparkles") + "云端增强</button>") +
          '<button class="btn btn-small btn-white" data-action="pick-photo">' + icon("refresh") + "换一张</button>" +
          '<button class="btn btn-small btn-white" data-action="remove-photo">' + icon("trash") + "移除</button>" +
          "</div></div>"
        : '<div class="dropzone" data-action="pick-photo" role="button" tabindex="0">' +
          '<span class="drop-icon">' + icon("image") + "</span>" +
          "<strong>拖入、粘贴或选择一张图片</strong>" +
          "<span>支持 JPG / PNG / WebP，最大 12MB</span>" +
          '<span class="btn btn-small btn-primary">' + icon("upload") + "选择图片</span>" +
          '<small>手机端也可以直接调用相机</small></div>') +
      '<input id="photo-input" type="file" accept="image/*" hidden>' +
      (scanning ? '<div class="ocr-progress" id="ocr-progress">' +
        '<div class="ocr-progress-top"><span id="ocr-status">' + esc(p.progressLabel || "正在准备") + "</span>" +
        '<strong id="ocr-percent">' + Math.round((p.progress || 0) * 100) + "%</strong></div>" +
        '<div class="progress-bar"><i id="ocr-progress-bar" style="width:' + Math.round((p.progress || 0) * 100) + '%"></i></div>' +
        '<small>OCR 引擎已在本地，识别过程不联网</small></div>' : "") +
      (p.error ? '<div class="inline-error">' + icon("alert") + "<span>" + esc(p.error) + "</span></div>" : "") +
      '<div class="upload-foot">' + icon("info") + "深色截屏会自动反色；手写体建议用「云端增强」，会多花几秒。" + "</div>" +
      "</section>" +
      renderPhotoGuide() +
      "</div>" +
      '<div id="photo-results-slot">' + renderPhotoResults() + "</div>" +
      renderManualCard();
  }

  function renderPhotoGuide() {
    return '<aside class="card photo-guide">' +
      '<div class="card-head"><div><span class="eyebrow">STEP 02</span><h2>识别与收录</h2></div>' +
      '<span class="method-mark">' + icon("sparkles") + "</span></div>" +
      '<div class="guide-steps">' +
      guideStep("1", "拍清楚", "印刷体、水平拍摄更稳；手写体建议用云端增强。") +
      guideStep("2", "勾选词", "OCR 可能把页眉或例句里的词一起读进来，去掉不想要的。") +
      guideStep("3", "联网补全", "自动查询音标、中文释义和例句；配置 AI 后可先校对拼写和词条。") +
      "</div>" +
      '<div class="guide-note"><span>' + icon("shield") + "</span><div><strong>默认图片不上传</strong>" +
      "<p>本地 OCR 在浏览器里完成。只有你确认「云端增强」时，图片才会上传到 ocr.space。</p></div></div>" +
      '<div class="guide-ai">' + icon("wifi") + "<span>" + (store.getSettings().online ? "联网查词已开启" : "联网查词已关闭，只使用本地词库") + "</span></div>" +
      "</aside>";
  }

  function guideStep(num, title, desc) {
    return '<div class="guide-step"><span>' + num + "</span><div><strong>" + esc(title) + "</strong><p>" + esc(desc) + "</p></div></div>";
  }

  function renderPhotoResults() {
    var p = S.photo;
    if (p.status === "scanning") return "";
    if (!p.candidates.length && !p.text) return "";
    if (!p.candidates.length) {
      return '<section class="card results-card"><div class="empty-results">' + icon("search") +
        "<h3>没有提取到清晰的英文单词</h3><p>手写体可以试试云端增强；也可以直接粘贴到下面的输入框。</p>" +
        '<div class="empty-actions"><button class="btn btn-primary" data-action="cloud-ocr">' +
        icon("sparkles") + "云端再识别" + '</button><button class="btn btn-soft" data-action="focus-manual">' +
        icon("edit") + "去手动输入</button></div></div>" +
        (p.text ? '<details class="raw-text"><summary>查看 OCR 原文</summary><pre>' + esc(p.text) + "</pre></details>" : "") +
        "</section>";
    }
    var selected = p.candidates.filter(function (c) { return c.selected; }).length;
    var known = p.candidates.filter(function (c) { return c.known; }).length;
    var chips = p.candidates.map(function (c) {
      return '<button class="word-chip' + (c.selected ? " selected" : "") + (c.known ? " known" : "") +
        '" data-action="toggle-candidate" data-term="' + esc(c.term) + '">' +
        (c.selected ? icon("check") : "") + "<span>" + esc(c.term) + "</span>" +
        (c.ai ? '<small class="ai-mark">AI</small>' : "") +
        (c.known ? "<small>已收录</small>" : "") + "</button>";
    }).join("");
    var adding = p.adding;
    return '<section class="card results-card" id="photo-results">' +
      '<div class="card-head"><div><span class="eyebrow">STEP 03</span><h2>识别到 ' + p.candidates.length + " 个词</h2>" +
      '<p class="head-sub">默认勾选前 12 个未收录的词' + (known ? " · " + known + " 个已在词库" : "") +
      (aiReady() ? " · AI 可校对拼写和词条" : "") + "</p></div>" +
      '<div class="result-actions">' +
      '<button class="text-link" data-action="ai-review"' + (p.aiReviewing ? " disabled" : "") +
      ' title="' + (aiReady() ? "用 AI 纠正拼写、补全词条" : "先在「我的」配置 AI Key") + '">' +
      icon("sparkles") + (p.aiReviewing ? "AI 校对中…" : "AI 校对") + "</button>" +
      '<button class="text-link" data-action="cloud-ocr">云端增强</button>' +
      '<button class="text-link" data-action="focus-manual">手动输入</button>' +
      '<button class="text-link" data-action="select-all-candidates" data-value="1">全选</button>' +
      '<button class="text-link" data-action="select-all-candidates" data-value="0">全不选</button></div></div>' +
      '<div class="word-chips">' + chips + "</div>" +
      (adding ? '<div class="add-progress" id="photo-add-progress">' +
        '<div class="add-progress-top"><span>正在查询并收录 <strong id="add-current">' + esc(adding.current || "") + "</strong></span>" +
        '<span id="add-count">' + adding.done + " / " + adding.total + "</span></div>" +
        '<div class="progress-bar"><i id="photo-add-bar" style="width:' + Math.round(adding.done / Math.max(1, adding.total) * 100) + '%"></i></div>' +
        "</div>" : "") +
      '<div class="results-foot"><div class="results-hint">' + icon("wifi") +
      (store.getSettings().online ? "将为未收录的词联网补全释义" : "联网查词已关闭，新词会先以待补充状态加入") + "</div>" +
      '<button class="btn btn-primary" data-action="add-photo-words"' + (selected === 0 || adding ? " disabled" : "") + ">" +
      icon("plus") + (adding ? "正在收录…" : "加入词库 (" + selected + ")") + "</button></div>" +
      (p.text ? '<details class="raw-text"><summary>查看 OCR 原文</summary><pre>' + esc(p.text) + "</pre></details>" : "") +
      "</section>";
  }

  function renderManualCard() {
    return '<section class="card manual-card">' +
      '<div class="card-head"><div><span class="eyebrow">OR TYPE IT</span><h2>直接粘贴单词</h2></div>' +
      '<span class="soft-badge">不经过 OCR</span></div>' +
      '<p class="manual-copy">从文档或聊天记录里复制一段英文，拾词会把其中的单词挑出来。</p>' +
      '<textarea id="manual-words" class="manual-textarea" rows="3" placeholder="例如：norm, conform, criterion, perceive...">' +
      esc(S.photo.manualText) + "</textarea>" +
      '<div class="manual-foot"><span>' + icon("info") + "自动过滤 the / and 等常见虚词</span>" +
      '<button class="btn btn-soft" data-action="manual-extract">' + icon("sparkles") + "从文本提取</button></div>" +
      "</section>";
  }

  /* ---------------- 设置 ---------------- */

  function renderSettings() {
    var s = store.getSettings();
    var stats = store.stats();
    return pageHead("YOUR SPACE", "我的",
      "调整学习节奏、管理数据，或者看看拾词是怎么安排复习的。",
      '<span class="privacy-chip">' + icon("shield") + "数据只在本机</span>") +
      '<section class="profile-card">' +
      '<div class="avatar">' + icon("leaf") + "</div>" +
      '<div class="profile-copy"><span class="eyebrow">LOCAL LEARNER</span><h2>拾词同学</h2>' +
      "<p>已经收录 " + stats.totalWords + " 个词，连续学习 " + stats.streak + " 天。</p></div>" +
      '<div class="profile-stats"><div><strong>' + stats.totalWords + "</strong><span>词库</span></div>" +
      '<div><strong>' + stats.streak + "</strong><span>连续天数</span></div>" +
      '<div><strong>' + stats.mastered + "</strong><span>已掌握</span></div></div></section>" +

      '<div class="settings-grid">' +
      '<section class="card settings-card">' +
      '<div class="card-head"><div><span class="eyebrow">DAILY RHYTHM</span><h2>学习设置</h2></div>' +
      '<span class="method-mark">' + icon("settings") + "</span></div>" +
      '<div class="setting-block"><div class="setting-label"><strong>每日目标</strong><span>决定每天想完成的单词量</span></div>' +
      '<div class="segmented">' + WB.DAILY_GOALS.map(function (g) {
        return '<button class="' + (s.dailyGoal === g ? "active" : "") + '" data-action="set-goal" data-value="' + g + '">' + g + "</button>";
      }).join("") + "</div></div>" +
      '<div class="setting-block"><div class="setting-label"><strong>优先词库</strong><span>新词会优先从这个难度里选</span></div>' +
      '<div class="segmented">' + ["CET4", "CET6"].map(function (lv) {
        return '<button class="' + (s.level === lv ? "active" : "") + '" data-action="set-level" data-value="' + lv + '">' +
          (lv === "CET4" ? "四级" : "六级") + "</button>";
      }).join("") + "</div></div>" +
      settingRow("volume", "自动发音", "进入新题时自动朗读单词", "autoSpeak", s.autoSpeak) +
      settingRow("wifi", "联网查词", "为照片和手动添加的词补全释义、音标与例句", "online", s.online) +
      settingRow("sparkles", "减少动效", "关闭页面过渡和扫描动画", "reduceMotion", s.reduceMotion) +
      "</section>" +

      renderMethodSettings() +
      renderAISettings(s) +
      renderOcrSettings(s) +
      renderDataSettings() +
      renderAbout() +
      "</div>";
  }

  function settingRow(iconName, title, desc, key, on) {
    return '<div class="setting-row"><span class="setting-row-icon">' + icon(iconName) + "</span>" +
      '<div class="setting-label"><strong>' + esc(title) + "</strong><span>" + esc(desc) + "</span></div>" +
      '<button class="switch' + (on ? " on" : "") + '" role="switch" aria-checked="' + (on ? "true" : "false") +
      '" data-action="toggle-setting" data-key="' + key + '"><i></i></button></div>';
  }

  function renderMethodSettings() {
    var chips = WB.INTERVALS.map(function (iv) { return '<span class="interval-chip">' + iv.label + "</span>"; }).join("");
    return '<section class="card settings-card method-settings">' +
      '<div class="card-head"><div><span class="eyebrow">THE METHOD</span><h2>艾宾浩斯复习</h2></div>' +
      '<span class="soft-badge">9 个阶段</span></div>' +
      '<p class="settings-copy">答对时，下一次复习的间隔向后走一格；答错时退回两格。这样每个词都会按你的实际记忆情况重新排队。</p>' +
      '<div class="interval-list">' + chips + "</div>" +
      '<div class="method-mini"><div><span class="method-mini-dot green"></span><strong>答对</strong><small>5m → 30m → 12h → 1d …</small></div>' +
      '<div><span class="method-mini-dot rose"></span><strong>答错</strong><small>退回两格，稍后再见</small></div></div>' +
      "</section>";
  }

  function renderAISettings(s) {
    var ai = s.ai || {};
    return '<section class="card settings-card ai-card">' +
      '<div class="card-head"><div><span class="eyebrow">OPTIONAL</span><h2>AI 识词增强</h2></div>' +
      '<button class="switch' + (ai.enabled ? " on" : "") + '" role="switch" aria-checked="' + (ai.enabled ? "true" : "false") +
      '" data-action="toggle-setting" data-key="aiEnabled"><i></i></button></div>' +
      '<p class="settings-copy">用兼容 OpenAI 的接口纠正 OCR 拼写、去掉页眉噪声，并在加入词库前核对音标、词性和中文释义。不开启也能正常拍照识词和查词，只是少了这层校对。</p>' +
      '<form id="ai-form" class="ai-form">' +
      '<label class="field"><span>Base URL</span><input id="ai-base" type="url" value="' + esc(ai.baseUrl || "https://api.deepseek.com") + '" placeholder="https://api.deepseek.com"></label>' +
      '<label class="field"><span>模型</span><input id="ai-model" type="text" value="' + esc(ai.model || "deepseek-chat") + '" placeholder="deepseek-chat"></label>' +
      '<label class="field"><span>API Key</span><span class="key-field"><input id="ai-key" type="password" autocomplete="off" value="' + esc(ai.apiKey || "") + '" placeholder="sk-...">' +
      '<button type="button" class="icon-btn tiny" data-action="toggle-key" aria-label="显示或隐藏 Key">' + icon("eye") + "</button></span></label>" +
      '<div class="ai-foot"><span class="ai-note">' + icon("key") + "Key 只保存在本机 localStorage</span>" +
      '<div><button type="button" class="btn btn-small btn-ghost" data-action="test-ai">测试连接</button>' +
      '<button type="submit" class="btn btn-small btn-soft">保存设置</button></div></div>' +
      '<p id="ai-test-status" class="ai-status"></p>' +
      "</form></section>";
  }

  function renderOcrSettings(s) {
    return '<section class="card settings-card ai-card">' +
      '<div class="card-head"><div><span class="eyebrow">CLOUD OCR</span><h2>云端增强识别</h2></div>' +
      '<span class="soft-badge">可选</span></div>' +
      '<p class="settings-copy">手写单词表用本地 OCR 往往认不出来。点拍照页的「云端增强」会把图片上传到 ocr.space 识别，印刷体也可以继续用本地识别。</p>' +
      '<form id="ocr-form" class="ai-form">' +
      '<label class="field"><span>OCR.space API Key</span><span class="key-field"><input id="ocr-key" type="password" autocomplete="off" value="' +
      esc(s.ocrKey || "") + '" placeholder="留空使用试用 Key（有限流）">' +
      '<button type="button" class="icon-btn tiny" data-action="toggle-key" aria-label="显示或隐藏 Key">' + icon("eye") + "</button></span></label>" +
      '<div class="ai-foot"><span class="ai-note">' + icon("key") + "Key 只保存在本机 localStorage</span>" +
      '<button type="submit" class="btn btn-small btn-soft">保存 OCR Key</button></div>' +
      '<p class="ai-status">没有 Key 也可以先试；长期使用建议去 ocr.space 免费申请一个。</p>' +
      "</form></section>";
  }

  function renderDataSettings() {
    return '<section class="card settings-card data-card">' +
      '<div class="card-head"><div><span class="eyebrow">YOUR DATA</span><h2>数据管理</h2></div>' +
      '<span class="method-mark">' + icon("download") + "</span></div>" +
      '<div class="data-actions">' +
      '<button class="data-action" data-action="export">' + icon("download") + "<div><strong>导出备份</strong><span>下载 JSON 文件</span></div></button>" +
      '<button class="data-action" data-action="import">' + icon("upload") + "<div><strong>导入备份</strong><span>覆盖当前词库</span></div></button>" +
      '<button class="data-action" data-action="reset">' + icon("refresh") + "<div><strong>重置内置词库</strong><span>恢复内置核心词与手写词库</span></div></button>" +
      '<button class="data-action danger" data-action="clear">' + icon("trash") + "<div><strong>清空全部</strong><span>词库与统计</span></div></button>" +
      "</div>" +
      '<input id="import-input" type="file" accept="application/json,.json" hidden>' +
      '<p class="settings-copy tiny-copy">浏览器清理站点数据、无痕模式结束或换设备后，localStorage 不会自动同步。</p>' +
      "</section>";
  }

  function renderAbout() {
    return '<section class="card settings-card about-card">' +
      '<div class="about-brand">' + brandMark() + '<div><strong>拾词</strong><span>四六级单词本 · v1.0</span></div></div>' +
      '<p class="settings-copy">一个不登录、不上传词库的本地单词本。默认拍照 OCR 使用本地 Tesseract.js；你也可以手动选择云端增强，把单张图片上传到 ocr.space。英文释义来自 dictionaryapi.dev，中文释义与例句翻译来自 MyMemory。</p>' +
      '<div class="about-links">' +
      '<a href="https://tesseract.projectnaptha.com/" target="_blank" rel="noopener noreferrer">Tesseract.js ' + icon("external") + "</a>" +
      '<a href="https://dictionaryapi.dev/" target="_blank" rel="noopener noreferrer">dictionaryapi.dev ' + icon("external") + "</a>" +
      '<a href="https://mymemory.translated.net/" target="_blank" rel="noopener noreferrer">MyMemory ' + icon("external") + "</a>" +
      "</div>" +
      '<p class="about-fine">词库与统计保存在 localStorage。需要换设备时，用「导出备份」带走它们。</p></section>';
  }

  /* ---------------- 练习 ---------------- */

  function meaningLabel(word) {
    if (!word || !word.meanings || !word.meanings.length) return "释义待补充";
    var group = word.meanings[0];
    var zh = (group.zh || []).slice(0, 2).join("；").trim();
    return zh || "释义待补充";
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function uniquePush(arr, value) {
    value = String(value || "").trim();
    if (value && arr.indexOf(value) < 0) arr.push(value);
    return arr;
  }

  function buildOptions(correct, distractors, fallback) {
    var labels = [];
    uniquePush(labels, correct);
    (distractors || []).forEach(function (d) { uniquePush(labels, d); });
    (fallback || []).forEach(function (d) {
      if (labels.length < 4) uniquePush(labels, d);
    });
    while (labels.length < 4) labels.push("以上都不是 " + (labels.length + 1));
    var picked = shuffle(labels.slice(0, 4));
    if (picked.indexOf(correct) < 0) picked[0] = correct;
    return picked.map(function (label) {
      return { label: label, correct: label === correct };
    });
  }

  function findTermPosition(text, term) {
    text = String(text || "");
    term = String(term || "");
    if (!text || !term) return -1;
    if (/^[A-Za-z][A-Za-z'’-]*$/.test(term)) {
      var safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[’‘]/g, "'");
      var match = new RegExp("\\b" + safe + "\\b", "i").exec(text);
      return match ? match.index : -1;
    }
    return text.toLowerCase().indexOf(term.toLowerCase());
  }

  function sentenceWithTerm(sentence, term, mode) {
    var text = String(sentence || "");
    var pos = findTermPosition(text, term);
    if (pos < 0) {
      return esc(text) + (mode === "cloze" ? ' <span class="blank">______</span>' : "");
    }
    var before = esc(text.slice(0, pos));
    var after = esc(text.slice(pos + String(term).length));
    var middle = mode === "cloze" ? "______" : esc(text.substr(pos, String(term).length));
    return before + '<span class="' + (mode === "cloze" ? "blank" : "target-word") + '">' + middle + "</span>" + after;
  }

  function buildQuestion(word, preferredType) {
    var pool = store.getWords().filter(function (w) {
      return !w.needsMeaning && w.meanings && w.meanings.length;
    });
    var exampleText = String((word.example && word.example.en) || "");
    var hasExample = !!(exampleText && findTermPosition(exampleText, word.term) >= 0);
    var type = preferredType || "mix";
    if (type === "mix") {
      type = ["meaning", "cloze", "context"][S.session.index % 3];
    }
    if (type !== "meaning" && !hasExample) type = "meaning";

    var correct;
    var distractors = [];
    if (type === "cloze") {
      correct = word.term;
      pool.filter(function (w) { return w.id !== word.id && w.level === word.level; })
        .forEach(function (w) { distractors.push(w.term); });
      pool.filter(function (w) { return w.id !== word.id; })
        .forEach(function (w) { distractors.push(w.term); });
      distractors = distractors.concat(["maintain", "decline", "approach", "sufficient", "reveal", "strategy"]);
    } else {
      correct = meaningLabel(word);
      pool.filter(function (w) { return w.id !== word.id; })
        .forEach(function (w) { distractors.push(meaningLabel(w)); });
      distractors = distractors.concat(WB.FALLBACK_MEANINGS.map(function (m) { return m.zh; }));
    }

    var prompt;
    var hint = "";
    if (type === "cloze") {
      prompt = '<div class="quiz-sentence">' + sentenceWithTerm(word.example.en, word.term, "cloze") + "</div>";
      hint = "把最合适的词填回句子里";
    } else if (type === "context") {
      prompt = '<div class="quiz-context-tag">读句子 · 辨词义</div>' +
        '<div class="quiz-sentence">' + sentenceWithTerm(word.example.en, word.term, "context") + "</div>";
      hint = "句中的 " + word.term + " 最接近哪个意思？";
    } else {
      prompt = '<div class="quiz-word">' + esc(word.term) + "</div>" +
        '<div class="quiz-phonetic">' + esc(word.phonetic || "") + "</div>";
      hint = "选出最接近的中文释义";
    }

    return {
      wordId: word.id,
      term: word.term,
      phonetic: word.phonetic || "",
      type: type,
      prompt: prompt,
      hint: hint,
      example: word.example || { en: "", zh: "" },
      options: buildOptions(correct, distractors, type === "cloze" ? ["maintain", "decline", "approach"] : WB.FALLBACK_MEANINGS.map(function (m) { return m.zh; })),
      correctLabel: correct
    };
  }

  function ensureCurrent() {
    if (!S.session) return null;
    if (S.session.current) return S.session.current;
    var word = store.getById(S.session.queue[S.session.index]);
    if (!word) {
      S.session.index += 1;
      if (S.session.index >= S.session.queue.length) {
        finishSession();
        return null;
      }
      return ensureCurrent();
    }
    S.session.current = buildQuestion(word, S.session.mode);
    return S.session.current;
  }

  function startSession(options) {
    options = options || {};
    closeModal();
    var words;
    if (options.ids && options.ids.length) {
      words = options.ids.map(function (id) { return store.getById(id); }).filter(Boolean);
    } else if (options.all) {
      words = shuffle(store.getWords().slice());
    } else {
      words = store.sessionWords(options.limit || sessionSize());
    }
    words = words.filter(function (w) { return w && !w.needsMeaning && w.meanings && w.meanings.length; });
    if (!words.length) {
      toast("还没有可以练习的词，先添加或补充释义吧", "error");
      return;
    }
    S.session = {
      mode: options.mode || "mix",
      queue: words.map(function (w) { return w.id; }),
      index: 0,
      correct: 0,
      answers: [],
      current: null,
      feedback: null,
      startedAt: Date.now(),
      finishedAt: 0,
      finished: false,
      full: !!options.all,
      totalWords: words.length,
      passed: 0,
      progress: {},
      passedIds: [],
      fillerId: null
    };
    S.route = "quiz";
    document.body.classList.add("quiz-mode");
    if (location.hash !== "#/quiz") {
      location.hash = "#/quiz";
      setTimeout(autoSpeakCurrent, 520);
    } else {
      render();
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(autoSpeakCurrent, 420);
    }
  }

  function requestFullQuiz() {
    var words = store.getWords().filter(function (w) {
      return w && !w.needsMeaning && w.meanings && w.meanings.length;
    });
    if (!words.length) {
      toast("还没有可以练习的词，先添加或补充释义吧", "error");
      return;
    }
    openConfirm({
      title: "全库闯关？",
      message: "词库里的 " + words.length + " 个词会随机出现。第一次就答对，这个词直接过；第一次答错，就要之后再连续答对 3 次才算过。同一个词不会连着出现，全部过掉预计 1 小时以上。中途退出时，已答的词会正常记录。",
      confirmLabel: "开始全库闯关",
      action: "start-full-quiz",
      tone: "primary"
    });
  }

  function answerQuestion(optionIndex) {
    if (!S.session || S.session.finished || S.session.feedback) return;
    var q = ensureCurrent();
    if (!q) return;
    var option = q.options[Number(optionIndex)];
    if (!option) return;
    var isFiller = S.session.full && S.session.fillerId === q.wordId;
    var fullRec = null;
    if (S.session.full && !isFiller) {
      fullRec = S.session.progress[q.wordId] || { correct: 0, attempts: 0, passed: false };
      var wasPassed = fullRec.passed;
      fullRec.attempts += 1;
      if (option.correct) {
        fullRec.correct += 1;
        if (fullRec.attempts === 1 || fullRec.correct >= 3) fullRec.passed = true;
      } else {
        fullRec.correct = 0;
      }
      if (fullRec.passed && !wasPassed) {
        S.session.passed += 1;
        S.session.passedIds.push(q.wordId);
      }
      S.session.progress[q.wordId] = fullRec;
    }
    var result = isFiller ? null : store.recordAnswer(q.wordId, option.correct, q.type);
    var word = store.getById(q.wordId);
    if (!isFiller) {
      S.session.answers.push({
        wordId: q.wordId,
        term: q.term,
        type: q.type,
        correct: option.correct,
        picked: option.label,
        answer: q.correctLabel
      });
      if (option.correct) S.session.correct += 1;
    }
    S.session.feedback = {
      picked: Number(optionIndex),
      correct: option.correct,
      answer: q.correctLabel,
      result: result,
      word: word,
      filler: isFiller,
      interval: result && result.interval ? result.interval.label : "",
      nextText: isFiller
        ? "穿插复习：不计入闯关"
        : (S.session.full
          ? (fullRec && fullRec.passed
            ? (fullRec.attempts === 1 ? "第一次答对，直接过" : "连续答对 3 次，已过")
            : "连续答对 " + (fullRec ? fullRec.correct : 0) + "/3" +
              (option.correct
                ? "，还要再答对 " + (3 - fullRec.correct) + " 次"
                : "，答错已清零，需重新连续答对 3 次"))
          : (word ? store.dueText(word) : ""))
    };
    render();
    var panel = document.querySelector(".feedback-panel");
    if (panel && panel.scrollIntoView) {
      setTimeout(function () { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 90);
    }
  }

  function advanceFullQuiz() {
    var id = S.session.current.wordId;
    var rec = S.session.progress[id];
    var queue = S.session.queue;
    var pos = S.session.index;
    var wasFiller = S.session.fillerId === id;
    S.session.fillerId = null;
    queue.splice(pos, 1);
    if (wasFiller) {
      S.session.index = pos < queue.length ? pos : 0;
    } else if (!rec || !rec.passed) {
      var nextIndex = pos < queue.length ? pos : 0;
      if (!queue.length) {
        if (!wasFiller && S.session.passedIds.length) {
          var filler = S.session.passedIds[Math.floor(Math.random() * S.session.passedIds.length)];
          queue.push(filler, id);
          S.session.fillerId = filler;
        } else {
          queue.push(id);
        }
        S.session.index = 0;
      } else {
        var min = nextIndex + 1;
        var at = min > queue.length ? queue.length : min + Math.floor(Math.random() * (queue.length - min + 1));
        queue.splice(at, 0, id);
        S.session.index = nextIndex;
      }
    } else {
      S.session.index = pos < queue.length ? pos : 0;
    }
    S.session.current = null;
    S.session.feedback = null;
    if (!queue.length) {
      finishSession();
      return;
    }
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    autoSpeakCurrent();
  }

  function nextQuestion() {
    if (!S.session || !S.session.feedback) return;
    if (S.session.full) {
      advanceFullQuiz();
      return;
    }
    if (S.session.index + 1 >= S.session.queue.length) {
      finishSession();
      return;
    }
    S.session.index += 1;
    S.session.current = null;
    S.session.feedback = null;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    autoSpeakCurrent();
  }

  function finishSession() {
    if (!S.session || S.session.finished) return;
    S.session.finished = true;
    S.session.finishedAt = Date.now();
    S.session.feedback = null;
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function autoSpeakCurrent() {
    if (S.route !== "quiz" || !S.session || !S.session.current || !store.getSettings().autoSpeak) return;
    var word = store.getById(S.session.current.wordId);
    if (word) api.speak(word);
  }

  function renderQuizScreen() {
    if (!S.session) return "";
    if (S.session.finished) return renderSummary();
    var q = ensureCurrent();
    if (!q) return renderSummary();
    var total = S.session.full ? S.session.totalWords : S.session.queue.length;
    var current = Math.min(S.session.index + 1, total);
    var done = S.session.full ? S.session.passed : S.session.answers.length;
    var pct = Math.round((done / Math.max(1, total)) * 100);
    var feedback = S.session.feedback;
    var word = store.getById(q.wordId);

    var options = q.options.map(function (opt, i) {
      var state = "";
      var mark = "";
      if (feedback) {
        if (opt.correct) { state = " is-correct"; mark = icon("check"); }
        else if (i === feedback.picked) { state = " is-wrong"; mark = icon("close"); }
        else state = " is-muted";
      }
      return '<button class="answer-option' + state + '" data-action="answer" data-index="' + i + '"' +
        (feedback ? " disabled" : "") + ' aria-label="选项 ' + String.fromCharCode(65 + i) + '：' + esc(opt.label) + '">' +
        '<span class="option-letter">' + String.fromCharCode(65 + i) + "</span>" +
        '<span class="option-text">' + esc(opt.label) + "</span>" +
        '<span class="option-mark">' + mark + "</span></button>";
    }).join("");

    return '<div class="quiz-shell">' +
      '<header class="quiz-top">' +
      '<button class="quiz-exit" data-action="exit-quiz" aria-label="结束练习">' + icon("close") + "</button>" +
      '<div class="quiz-progress-wrap"><div class="quiz-progress-meta"><span>' +
      (S.session.full ? "已过 " + done + " / " + total : "QUESTION " + String(current).padStart(2, "0") + " / " + String(total).padStart(2, "0")) +
      "</span><span>" + (S.session.full ? "第 " + (S.session.answers.length + 1) + " 次作答" : done + " 已作答") + "</span></div>" +
      '<div class="quiz-progress-bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="quiz-score">' + icon("target") + "<strong>" + S.session.correct + "</strong><span>答对</span></div>" +
      "</header>" +
      '<main class="quiz-main">' +
      '<div class="quiz-card" data-word-id="' + esc(q.wordId) + '" data-term="' + esc(q.term) + '">' +
      '<div class="quiz-card-head"><span class="type-badge type-' + q.type + '">' + TYPE_LABEL[q.type] + "</span>" +
      '<span class="quiz-timer">' + icon("clock") + "约 20 秒</span></div>" +
      '<div class="quiz-prompt">' + q.prompt + "</div>" +
      '<div class="quiz-hint">' + esc(q.hint) + "</div>" +
      (q.type === "meaning" && word ? '<button class="listen-btn" data-action="speak-word" data-id="' + esc(word.id) + '">' +
        icon("volume") + "听发音</button>" : "") +
      '<div class="answer-list">' + options + "</div>" +
      (feedback ? renderFeedback(feedback, q) : '<p class="quiz-tip">' + icon("info") +
        "先凭第一感觉作答，答错也会进入下一次复习。</p>") +
      "</div>" +
      '<aside class="quiz-side"><div class="quiz-side-inner"><span class="eyebrow">EBBINGHAUS</span>' +
      "<h3>答完会自动安排<br>下一次见面。</h3><p>答对向前走一格，答错退回两格。不要怕错，错误会让复习更准确。</p>" +
      '<div class="quiz-side-intervals"><span>5m</span><i></i><span>30m</span><i></i><span>12h</span><i></i><span>1d</span></div>' +
      "</div></aside>" +
      "</main></div>";
  }

  function renderFeedback(feedback, q) {
    var word = feedback.word || store.getById(q.wordId);
    var result = feedback.result;
    var isFiller = !!feedback.filler;
    var tone = feedback.correct || isFiller ? "is-correct" : "is-wrong";
    var title = isFiller ? "穿插复习" : (feedback.correct ? "答对了，记得很稳" : "没关系，再记一次");
    var sub = isFiller
      ? "这个词已经过掉了，用它隔开最后一个词；本题不计入闯关。"
      : (feedback.correct
        ? "这个释义和句子已经连在一起了。"
        : "正确答案是「" + feedback.answer + "」，下一轮会更早见到它。");
    var nextLabel = isFiller ? "继续最后一个词" : (S.session.full ? "下一个词" : (S.session.index + 1 >= S.session.queue.length ? "查看本轮结果" : "下一个词"));
    return '<section class="feedback-panel ' + tone + '">' +
      '<div class="feedback-head"><span class="feedback-icon">' + icon(feedback.correct || isFiller ? "check" : "refresh") + "</span>" +
      '<div><strong>' + title + "</strong><p>" + esc(sub) + "</p></div>" +
      '<span class="feedback-next-time">' + icon("clock") + (isFiller ? "不计入闯关" : "下次 " + esc(feedback.nextText || "稍后")) + "</span></div>" +
      '<div class="feedback-word">' +
      '<div><strong>' + esc(q.term) + "</strong><span>" + esc(q.phonetic || "") + "</span></div>" +
      (word ? '<button class="icon-btn tiny" data-action="speak-word" data-id="' + esc(word.id) + '" aria-label="朗读">' +
        icon("volume") + "</button>" : "") +
      "</div>" +
      '<div class="feedback-meaning">' + (word ? '<span class="pos-inline">' + esc(word.pos || "") + "</span>" +
        esc(store.fullMeaning(word)) : "") + "</div>" +
      (q.example && q.example.en ? '<div class="feedback-example"><p>' +
        sentenceWithTerm(q.example.en, q.term, "context") + "</p>" +
        (q.example.zh ? "<span>" + esc(q.example.zh) + "</span>" : "") + "</div>" : "") +
      '<div class="feedback-diff"><span class="you-picked">你选了：' + esc(feedback.correct ? feedback.answer : q.options[feedback.picked].label) + "</span>" +
      '<span class="right-answer">正确：' + esc(feedback.answer) + "</span></div>" +
      '<div class="feedback-actions">' +
      (word ? '<button class="text-link" data-action="open-word" data-id="' + esc(word.id) + '">查看完整词条 ' + icon("arrowRight") + "</button>" : "<span></span>") +
      '<button class="btn btn-primary" data-action="next-question">' + esc(nextLabel) + icon("arrowRight") + "</button>" +
      "</div>" +
      (result && result.interval ? '<p class="feedback-schedule">艾宾浩斯：下次间隔 ' + esc(result.interval.label) + "（" +
        esc(result.interval.ms >= 864e5 ? Math.round(result.interval.ms / 864e5) + " 天后" : result.interval.label) + "）</p>" : "") +
      "</section>";
  }

  function durationText(ms) {
    var total = Math.max(1, Math.round(ms / 1000));
    var min = Math.floor(total / 60);
    var sec = total % 60;
    return min ? min + " 分 " + sec + " 秒" : sec + " 秒";
  }

  function renderSummary() {
    var s = S.session;
    var total = s.answers.length || s.queue.length;
    var correct = s.correct;
    var accuracy = total ? correct / total : 0;
    var wrong = s.answers.filter(function (a) { return !a.correct; });
    var title = s.full
      ? "全库，过完了。"
      : (accuracy >= 0.8 ? "这一轮，记得很稳。" : (accuracy >= 0.5 ? "正在变熟，继续保持。" : "多见几次，就会记住。"));
    var sub = s.full
      ? s.totalWords + " 个词都过了：第一次答对直接过，否则要连续答对 3 次。"
      : (accuracy >= 0.8
        ? "大部分词已经进入更长的复习间隔。"
        : "答错的词已经退回更短的间隔，稍后会再来找你。");
    var rows = s.answers.map(function (a, i) {
      var w = store.getById(a.wordId);
      return '<div class="summary-row ' + (a.correct ? "ok" : "no") + '">' +
        '<span class="summary-index">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<div class="summary-word"><strong>' + esc(a.term) + "</strong><span>" +
        esc(w ? store.fullMeaning(w) : a.answer) + "</span></div>" +
        '<span class="summary-type">' + TYPE_LABEL[a.type] + "</span>" +
        '<span class="summary-result">' + icon(a.correct ? "check" : "close") + "</span></div>";
    }).join("");
    return '<div class="summary-shell">' +
      '<header class="summary-top"><button class="quiz-exit" data-action="summary-home" aria-label="回到首页">' + icon("close") + "</button>" +
      '<span class="brand mini">' + brandMark() + '<span class="brand-text"><strong>拾词</strong><small>SESSION REPORT</small></span></span>' +
      '<span class="summary-date">' + dateLabel().split(" · ")[0] + "</span></header>" +
      '<main class="summary-main">' +
      '<section class="summary-hero"><span class="eyebrow">' + (s.full ? "FULL RUN COMPLETE" : "SESSION COMPLETE") + "</span>" +
      "<h1>" + title + "</h1><p>" + sub + "</p>" +
      '<div class="summary-hero-grid"><div class="summary-ring">' + progressRing(accuracy, Math.round(accuracy * 100) + "%", "正确率", 190) + "</div>" +
      '<div class="summary-stats"><div><strong>' + correct + "</strong><span>答对</span></div>" +
      '<div><strong>' + (total - correct) + "</strong><span>需要再见</span></div>" +
      '<div><strong>' + durationText((s.finishedAt || Date.now()) - s.startedAt) + "</strong><span>本轮用时</span></div>" +
      '<div><strong>' + total + "</strong><span>练习题数</span></div></div></div></section>" +
      '<section class="summary-card"><div class="card-head"><div><span class="eyebrow">REVIEW</span><h2>这一轮的词</h2></div>' +
      '<span class="soft-badge">' + (wrong.length ? wrong.length + " 个需要加强" : "全部答对") + "</span></div>" +
      '<div class="summary-list">' + rows + "</div></section>" +
      '<div class="summary-actions">' +
      (wrong.length ? '<button class="btn btn-ghost" data-action="retry-wrong">' + icon("refresh") + "只练错词 (" + wrong.length + ")</button>" : "") +
      (s.full
        ? '<button class="btn btn-primary" data-action="new-full-session">' + icon("sparkles") + "再闯一轮" + icon("arrowRight") + "</button>"
        : '<button class="btn btn-primary" data-action="new-session">' + icon("sparkles") + "再来一组" + icon("arrowRight") + "</button>") +
      '<button class="btn btn-ghost" data-action="summary-home">回到今日</button>' +
      "</div></main></div>";
  }

  /* ---------------- 弹层 ---------------- */

  function setModal(modal) {
    S.modal = modal;
    document.body.classList.toggle("modal-open", !!modal);
    renderOverlay();
  }

  function closeModal() {
    if (!S.modal) return;
    S.modal = null;
    document.body.classList.remove("modal-open");
    renderOverlay();
  }

  function renderOverlay() {
    if (!S.modal) {
      overlayEl.innerHTML = "";
      return;
    }
    var body = "";
    if (S.modal.type === "word") body = renderWordModal(S.modal.id);
    else if (S.modal.type === "edit") body = renderEditModal(S.modal.id);
    else if (S.modal.type === "confirm") body = renderConfirmModal();
    if (!body) {
      S.modal = null;
      overlayEl.innerHTML = "";
      document.body.classList.remove("modal-open");
      return;
    }
    overlayEl.innerHTML = '<div class="modal-backdrop" data-action="close-modal"></div>' +
      '<div class="modal-wrap">' + body + "</div>";
  }

  function openWord(id) {
    var word = store.getById(id);
    if (!word) return;
    setModal({ type: "word", id: id });
  }

  function openEdit(id) {
    if (id && !store.getById(id)) return;
    setModal({ type: "edit", id: id || null });
  }

  function openConfirm(options) {
    setModal({
      type: "confirm",
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || "确定",
      action: options.action,
      data: options.data || null,
      tone: options.tone || "danger"
    });
  }

  function renderWordModal(id) {
    var w = store.getById(id);
    if (!w) return "";
    var status = store.statusOf(w);
    var canPractice = !w.needsMeaning && w.meanings && w.meanings.length > 0;
    var history = (w.history || []).slice(-5).reverse().map(function (h) {
      return '<div class="history-row"><span class="history-dot ' + (h.correct ? "ok" : "no") + '"></span>' +
        "<span>" + (h.correct ? "答对" : "答错") + " · " + TYPE_LABEL[h.type] + "</span>" +
        '<time>' + timeAgo(h.at) + "</time></div>";
    }).join("");
    var meaningRows = (w.meanings || []).map(function (m) {
      return '<div class="meaning-row"><span class="pos-inline">' + esc(m.pos || w.pos || "") + "</span>" +
        "<p>" + esc((m.zh || []).join("；")) + "</p></div>";
    }).join("");
    return '<section class="modal word-modal" role="dialog" aria-modal="true" aria-label="' + esc(w.term) + ' 词条">' +
      '<header class="modal-head"><span class="eyebrow">WORD DETAIL</span>' +
      '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon("close") + "</button></header>" +
      '<div class="modal-scroll">' +
      '<div class="detail-hero"><div><h2>' + esc(w.term) + "</h2>" +
      '<div class="detail-meta"><span class="detail-phonetic">' + esc(w.phonetic || "音标待补充") + "</span>" +
      levelTag(w) + '<span class="status-pill status-' + status + '"><i></i>' + esc(store.dueText(w)) + "</span></div></div>" +
      '<button class="detail-speak" data-action="speak-word" data-id="' + esc(w.id) + '" aria-label="朗读">' + icon("volume") + "</button></div>" +
      (w.needsMeaning ? '<div class="inline-error soft">' + icon("alert") + "<span>这个词还没有中文释义，可以联网补全或手动编辑。</span>" +
        '<button class="text-link" data-action="lookup-word" data-id="' + esc(w.id) + '">联网补全</button></div>' : "") +
      '<div class="detail-section"><span class="eyebrow">MEANING</span>' +
      (meaningRows || '<p class="muted">还没有释义。</p>') + "</div>" +
      (w.example && w.example.en ? '<div class="detail-section"><span class="eyebrow">IN A SENTENCE</span>' +
        '<blockquote class="detail-example">' + sentenceWithTerm(w.example.en, w.term, "context") +
        (w.example.zh ? "<span>" + esc(w.example.zh) + "</span>" : "") + "</blockquote></div>" : "") +
      ((w.phrases || []).length ? '<div class="detail-section"><span class="eyebrow">PHRASES</span><div class="detail-phrases">' +
        w.phrases.map(function (p) {
          return '<div><strong>' + esc(p.en) + "</strong><span>" + esc(p.zh) + "</span></div>";
        }).join("") + "</div></div>" : "") +
      ((w.defs || []).length ? '<div class="detail-section"><span class="eyebrow">ENGLISH DEFINITION</span><div class="detail-defs">' +
        w.defs.slice(0, 3).map(function (d) {
          return '<p><span class="pos-inline">' + esc(d.pos || "") + "</span>" + esc(d.en) + "</p>";
        }).join("") + "</div></div>" : "") +
      '<div class="detail-section"><span class="eyebrow">MEMORY</span><div class="memory-grid">' +
      '<div><strong>' + (w.reps || 0) + '</strong><span>复习次数</span></div>' +
      '<div><strong>' + (w.lapses || 0) + '</strong><span>遗忘次数</span></div>' +
      '<div><strong>' + (w.stage + 1) + ' / ' + WB.INTERVALS.length + '</strong><span>当前阶段</span></div>' +
      '<div><strong>' + timeAgo(w.lastReviewed) + '</strong><span>上次复习</span></div></div>' +
      (history ? '<div class="history-list">' + history + "</div>" : "") + "</div>" +
      "</div>" +
      '<footer class="modal-foot"><div class="foot-left">' +
      '<button class="text-link" data-action="open-edit" data-id="' + esc(w.id) + '">' + icon("edit") + "编辑</button>" +
      '<button class="text-link danger" data-action="delete-word" data-id="' + esc(w.id) + '">' + icon("trash") + "删除</button></div>" +
      (canPractice
        ? '<button class="btn btn-primary" data-action="quiz-word" data-id="' + esc(w.id) + '">' + icon("play") + "练这个" + "</button>"
        : '<button class="btn btn-ghost" disabled title="先补充中文释义">' + icon("edit") + "先补释义" + "</button>") +
      "</footer></section>";
  }

  function wordToMeaningText(w) {
    if (!w || !w.meanings || !w.meanings.length) return "";
    return w.meanings.map(function (m) {
      return (m.pos || w.pos || "") + " " + (m.zh || []).join("；");
    }).join("\n");
  }

  function wordToPhraseText(w) {
    return (w && w.phrases ? w.phrases : []).map(function (p) {
      return p.en + " | " + (p.zh || "");
    }).join("\n");
  }

  function renderEditModal(id) {
    var w = id ? store.getById(id) : null;
    if (id && !w) return "";
    var title = w ? "编辑词条" : "添加单词";
    var level = w ? w.level : "CET4";
    return '<section class="modal edit-modal" role="dialog" aria-modal="true" aria-label="' + title + '">' +
      '<header class="modal-head"><div><span class="eyebrow">' + (w ? "EDIT WORD" : "NEW WORD") + '</span><h2>' + title + "</h2></div>" +
      '<button class="icon-btn" data-action="close-modal" aria-label="关闭">' + icon("close") + "</button></header>" +
      '<form id="word-form" class="word-form" data-id="' + esc(w ? w.id : "") + '" novalidate>' +
      '<div class="form-grid">' +
      '<label class="field"><span>单词</span><input id="word-term" name="term" type="text" autocomplete="off" required value="' + esc(w ? w.term : "") + '" placeholder="例如 norm"></label>' +
      '<label class="field"><span>音标</span><input id="word-phonetic" type="text" value="' + esc(w ? w.phonetic : "") + '" placeholder="/nɔːrm/"></label>' +
      '<label class="field"><span>词性</span><input id="word-pos" type="text" value="' + esc(w ? w.pos : "") + '" placeholder="n. / v. / adj."></label>' +
      '<label class="field"><span>词库</span><select id="word-level">' +
      ["CET4", "CET6", "EXTRA"].map(function (lv) {
        return '<option value="' + lv + '"' + (level === lv ? " selected" : "") + ">" + WB.LEVELS[lv] + "</option>";
      }).join("") + "</select></label>" +
      "</div>" +
      '<label class="field"><span>中文释义 <small>每行一组，用分号分隔多个义项</small></span>' +
      '<textarea id="word-meanings" rows="3" placeholder="n. 常态；规范，准则">' + esc(wordToMeaningText(w)) + "</textarea></label>" +
      '<div class="form-grid">' +
      '<label class="field"><span>例句（英文）</span><textarea id="word-example-en" rows="2" placeholder="Public transportation isn&#39;t that great, so it&#39;s the norm to drive.">' + esc(w && w.example ? w.example.en : "") + "</textarea></label>" +
      '<label class="field"><span>例句翻译</span><textarea id="word-example-zh" rows="2" placeholder="公共交通不是那么好，所以开车是常态。">' + esc(w && w.example ? w.example.zh : "") + "</textarea></label>" +
      "</div>" +
      '<label class="field"><span>词组搭配 <small>每行一条，格式：英文 | 中文</small></span>' +
      '<textarea id="word-phrases" rows="3" placeholder="become the norm | 成为常态">' + esc(wordToPhraseText(w)) + "</textarea></label>" +
      '<div class="edit-tools"><button type="button" class="btn btn-small btn-soft" data-action="lookup-edit">' +
      icon("wifi") + "联网补全</button><span id='edit-status' class='edit-status'>" +
      (w ? "保存后会重排这个词的复习时间吗？不会，只更新词条内容。" : "新词会从 5 分钟后开始第一次复习。") + "</span></div>" +
      '<footer class="modal-foot form-foot"><button type="button" class="btn btn-ghost" data-action="close-modal">取消</button>' +
      '<button type="submit" class="btn btn-primary">' + icon("check") + (w ? "保存修改" : "加入词库") + "</button></footer>" +
      "</form></section>";
  }

  function renderConfirmModal() {
    var m = S.modal;
    return '<section class="modal confirm-modal" role="alertdialog" aria-modal="true" aria-label="' + esc(m.title) + '">' +
      '<div class="confirm-icon ' + (m.tone === "danger" ? "danger" : "") + '">' + icon(m.tone === "danger" ? "alert" : "info") + "</div>" +
      "<h2>" + esc(m.title) + "</h2><p>" + esc(m.message) + "</p>" +
      '<div class="confirm-actions"><button class="btn btn-ghost" data-action="close-modal">取消</button>' +
      '<button class="btn ' + (m.tone === "danger" ? "btn-danger" : "btn-primary") + '" data-action="confirm-yes">' +
      esc(m.confirmLabel) + "</button></div></section>";
  }

  /* ---------------- 表单与数据 ---------------- */

  function parseMeaningLines(text) {
    var groups = [];
    String(text || "").split(/\n+/).forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var m = line.match(/^([a-zA-Z]{1,6}\.?)\s+(.+)$/);
      var pos = m ? m[1] : "";
      var body = m ? m[2] : line;
      var zh = body.split(/[；;]/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (zh.length) groups.push({ pos: pos, zh: zh });
    });
    return groups;
  }

  function parsePhraseLines(text) {
    return String(text || "").split(/\n+/).map(function (line) {
      line = line.trim();
      if (!line) return null;
      var bits = line.split(/\s*[|｜]\s*/);
      if (!bits[0]) return null;
      return { en: bits[0], zh: bits.slice(1).join(" ") };
    }).filter(Boolean);
  }

  function saveWordForm() {
    var form = document.getElementById("word-form");
    if (!form) return;
    var id = form.getAttribute("data-id");
    var term = document.getElementById("word-term").value.trim();
    var phonetic = document.getElementById("word-phonetic").value.trim();
    var pos = document.getElementById("word-pos").value.trim();
    var level = document.getElementById("word-level").value;
    var groups = parseMeaningLines(document.getElementById("word-meanings").value);
    var zh = [];
    groups.forEach(function (g) { zh = zh.concat(g.zh); });
    var exampleEn = document.getElementById("word-example-en").value.trim();
    var exampleZh = document.getElementById("word-example-zh").value.trim();
    var phrases = parsePhraseLines(document.getElementById("word-phrases").value);
    if (!term) {
      toast("先填一个单词", "error");
      document.getElementById("word-term").focus();
      return;
    }
    var result;
    if (id) {
      result = store.updateWord(id, {
        term: term,
        phonetic: phonetic,
        pos: pos,
        level: level,
        zh: zh,
        meanings: groups,
        exampleEn: exampleEn,
        exampleZh: exampleZh,
        phrases: phrases
      });
    } else {
      result = store.addWord({
        term: term,
        phonetic: phonetic,
        pos: pos || (groups[0] && groups[0].pos) || "",
        level: level,
        meanings: groups,
        example: { en: exampleEn, zh: exampleZh },
        phrases: phrases
      }, "manual");
    }
    if (!result || !result.ok) {
      toast((result && result.error) || "保存失败，请检查内容", "error");
      return;
    }
    closeModal();
    render();
    toast(result.added === false ? "已经更新这个词条" : "已经加入词库", "ok");
  }

  function saveAISettings() {
    var baseUrl = document.getElementById("ai-base").value.trim();
    var model = document.getElementById("ai-model").value.trim();
    var apiKey = document.getElementById("ai-key").value.trim();
    store.updateSettings({ ai: { baseUrl: baseUrl || "https://api.deepseek.com", model: model || "deepseek-chat", apiKey: apiKey } });
    toast("AI 设置已保存在本机", "ok");
  }

  function saveOCRSettings() {
    var key = document.getElementById("ocr-key").value.trim();
    store.updateSettings({ ocrKey: key });
    toast(key ? "OCR.space Key 已保存" : "已改为使用试用 Key", "ok");
  }

  function testAIConnection() {
    var status = document.getElementById("ai-test-status");
    var ai = {
      baseUrl: document.getElementById("ai-base").value.trim() || "https://api.deepseek.com",
      model: document.getElementById("ai-model").value.trim() || "deepseek-chat",
      apiKey: document.getElementById("ai-key").value.trim()
    };
    if (!ai.apiKey) {
      if (status) status.textContent = "请先填写 API Key。";
      return;
    }
    if (status) status.textContent = "正在连接…";
    api.testAI(ai).then(function () {
      if (status) status.textContent = "连接成功，可以使用 AI 识词增强了。";
    }).catch(function (err) {
      if (status) status.textContent = (err && err.message) || "连接失败，请检查地址、模型和 Key。";
    });
  }

  function exportData() {
    var data = store.exportState();
    if (data.settings) {
      if (data.settings.ai) data.settings.ai.apiKey = "";
      data.settings.ocrKey = "";
    }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var d = new Date();
    a.href = url;
    a.download = "shici-backup-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast("备份文件已开始下载", "ok");
  }

  function handleImportFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try {
        data = JSON.parse(String(reader.result || ""));
      } catch (err) {
        toast("这个文件不是有效的 JSON 备份", "error");
        return;
      }
      if (!data || !Array.isArray(data.words)) {
        toast("备份里没有找到单词列表", "error");
        return;
      }
      openConfirm({
        title: "导入备份？",
        message: "当前词库和复习记录会被备份文件覆盖，共 " + data.words.length + " 个词。",
        confirmLabel: "覆盖导入",
        action: "import-state",
        data: data
      });
    };
    reader.onerror = function () { toast("读取文件失败", "error"); };
    reader.readAsText(file);
  }

  function doConfirmedAction() {
    var m = S.modal;
    if (!m || m.type !== "confirm") return;
    if (m.action === "start-full-quiz") {
      closeModal();
      startSession({ all: true, mode: "mix" });
    } else if (m.action === "cloud-ocr-confirm") {
      closeModal();
      runCloudOcr();
    } else if (m.action === "ai-review-confirm") {
      closeModal();
      runAiReviewConfirmed();
    } else if (m.action === "delete-word") {
      store.deleteWord(m.data.id);
      closeModal();
      render();
      toast("词条已删除", "ok");
    } else if (m.action === "reset-state") {
      store.reset(true);
      closeModal();
      render();
      toast("已恢复到示例词库", "ok");
    } else if (m.action === "clear-state") {
      store.clearWords();
      closeModal();
      render();
      toast("词库已清空", "ok");
    } else if (m.action === "import-state") {
      var res = store.importState(m.data);
      if (!res.ok) {
        toast(res.error || "导入失败", "error");
        return;
      }
      closeModal();
      render();
      toast("已导入 " + res.count + " 个词", "ok");
    }
  }

  /* ---------------- 拍照处理 ---------------- */

  function makeCandidates(terms) {
    var selected = 0;
    var seen = {};
    return (terms || []).map(function (term) {
      term = api.normalizeToken(term);
      if (!term || !api.isValidToken(term) || seen[term]) return null;
      seen[term] = true;
      var known = !!store.findByTerm(term);
      var pick = !known && selected < 12;
      if (pick) selected += 1;
      return { term: term, known: known, selected: pick };
    }).filter(Boolean);
  }

  function mergeCandidates(terms) {
    var existing = {};
    S.photo.candidates.forEach(function (c) { existing[c.term] = c; });
    var selected = S.photo.candidates.filter(function (c) { return c.selected; }).length;
    var next = makeCandidates(terms);
    next.forEach(function (c) {
      if (existing[c.term]) return;
      if (!c.known && selected < 12) { c.selected = true; selected += 1; }
      else c.selected = false;
      S.photo.candidates.push(c);
    });
  }

  function applyAiReview(results) {
    var byTerm = {};
    var fixed = 0;
    var removed = 0;
    (results || []).forEach(function (r) {
      if (r && r.original) byTerm[r.original] = r;
    });
    var next = [];
    var seen = {};
    S.photo.candidates.forEach(function (c) {
      var r = byTerm[c.term];
      if (r) {
        if (r.valid === false) { removed += 1; return; }
        var checked = r.checked !== false;
        if (r.term && r.term !== c.term) {
          c.term = r.term;
          fixed += 1;
        }
        if (checked) {
          c.ai = r;
          S.photo.aiMap[c.term] = r;
        } else {
          c.ai = null;
        }
        c.known = !!store.findByTerm(c.term);
        if (c.known) c.selected = false;
      }
      if (seen[c.term]) return;
      seen[c.term] = true;
      next.push(c);
    });
    S.photo.candidates = next;
    return { fixed: fixed, removed: removed };
  }

  function reviewCandidatesWithAI() {
    if (!aiReady()) {
      toast("先在「我的 → AI 识词增强」里开启并填写 Key", "error");
      navigate("settings");
      return;
    }
    if (!S.photo.candidates.length || S.photo.aiReviewing) return;
    openConfirm({
      title: "用 AI 校对这 " + S.photo.candidates.length + " 个候选词？",
      message: "会把你配置的 AI 接口用于纠正拼写、去掉页眉噪声，并补全缺失的音标和中文释义。只发送候选词，不发送图片。",
      confirmLabel: "开始校对",
      action: "ai-review-confirm",
      tone: "primary"
    });
  }

  function runAiReviewConfirmed() {
    if (!aiReady() || !S.photo.candidates.length) return;
    var job = S.photo.job;
    var terms = S.photo.candidates.map(function (c) { return c.term; });
    S.photo.aiReviewing = true;
    render();
    api.aiReviewWords(terms, store.getSettings().ai).then(function (results) {
      if (job !== S.photo.job) return;
      S.photo.aiReviewing = false;
      if (!results) {
        render();
        toast("AI 校对失败，候选词保持不变；可以检查 Key 或稍后再试", "error");
        return;
      }
      var stats = applyAiReview(results);
      render();
      toast("AI 校对完成：修正 " + stats.fixed + " 个，移除 " + stats.removed + " 个", "ok");
    }).catch(function () {
      if (job !== S.photo.job) return;
      S.photo.aiReviewing = false;
      render();
      toast("AI 校对失败，候选词保持不变", "error");
    });
  }

  function finishOcr(text, words, confidence) {
    var ordered = [];
    var seen = {};
    (words || []).concat(api.extractFromText(text)).forEach(function (w) {
      var t = api.normalizeToken(w);
      if (t && !seen[t]) { seen[t] = true; ordered.push(t); }
    });
    S.photo.text = text || "";
    S.photo.confidence = confidence || 0;
    S.photo.candidates = makeCandidates(ordered.slice(0, 30));
    S.photo.status = "results";
    S.photo.progress = 1;
    S.photo.progressLabel = "识别完成";
    S.photo.aiMap = {};
    S.photo.aiReviewing = false;
    if (!S.photo.candidates.length && !text) {
      S.photo.error = "没有读到文字。试试更清晰的图片，或把单词直接粘贴到下方。";
    }
    render();
  }

  function handlePhotoFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || "")) {
      toast("请选择 JPG、PNG 或 WebP 图片", "error");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast("图片有点大，请控制在 12MB 以内", "error");
      return;
    }
    var manual = S.photo.manualText;
    if (S.photo.preview) {
      try { URL.revokeObjectURL(S.photo.preview); } catch (err) {}
    }
    var job = S.photo.job + 1;
    S.photo = blankPhoto();
    S.photo.manualText = manual;
    S.photo.file = file;
    S.photo.preview = URL.createObjectURL(file);
    S.photo.status = "scanning";
    S.photo.progress = 0.03;
    S.photo.progressLabel = "正在优化图片";
    S.photo.job = job;
    if (S.route !== "photo") {
      navigate("photo");
    } else {
      render();
    }
    api.recognizeImage(file, function (p) {
      if (job !== S.photo.job) return;
      S.photo.progress = p.progress || 0;
      S.photo.progressLabel = p.label || "正在识别";
      updateOcrProgress(p);
    }).then(function (res) {
      if (job !== S.photo.job) return { skipped: true };
      var text = res.text || "";
      var words = res.words || [];
      return { text: text, words: words, confidence: res.confidence };
    }).then(function (out) {
      if (!out || out.skipped || job !== S.photo.job) return;
      finishOcr(out.text, out.words, out.confidence);
      if (aiReady()) runAiReviewConfirmed();
    }).catch(function (err) {
      if (job !== S.photo.job) return;
      S.photo.status = "error";
      S.photo.error = (err && err.message) || "识别失败，请重试或手动粘贴单词";
      render();
    });
  }

  function runCloudOcr() {
    if (!S.photo.file) {
      toast("请先选择一张图片", "error");
      return;
    }
    var job = S.photo.job;
    var key = store.getSettings().ocrKey || "";
    S.photo.status = "scanning";
    S.photo.progress = 0.06;
    S.photo.progressLabel = "正在上传到云端 OCR";
    S.photo.error = "";
    S.photo.cloud = true;
    render();
    api.recognizeImageCloud(S.photo.file, { key: key }).then(function (res) {
      if (job !== S.photo.job) return;
      finishOcr(res.text, res.words, res.confidence);
      toast("云端识别完成", "ok");
      if (aiReady()) runAiReviewConfirmed();
    }).catch(function (err) {
      if (job !== S.photo.job) return;
      S.photo.status = S.photo.candidates.length ? "results" : "error";
      S.photo.error = (err && err.message) || "云端识别失败，请稍后重试";
      render();
    });
  }

  function updateOcrProgress(p) {
    var status = document.getElementById("ocr-status");
    var percent = document.getElementById("ocr-percent");
    var bar = document.getElementById("ocr-progress-bar");
    if (!status || !percent || !bar) return;
    var value = Math.max(0, Math.min(1, p.progress || 0));
    status.textContent = p.label || "正在识别";
    percent.textContent = Math.round(value * 100) + "%";
    bar.style.width = Math.round(value * 100) + "%";
  }

  function refreshPhotoResults() {
    var slot = document.getElementById("photo-results-slot");
    if (slot) slot.innerHTML = renderPhotoResults();
  }

  function updateAddProgress() {
    var a = S.photo.adding;
    if (!a) return;
    var current = document.getElementById("add-current");
    var count = document.getElementById("add-count");
    var bar = document.getElementById("photo-add-bar");
    if (current) current.textContent = a.current || "";
    if (count) count.textContent = a.done + " / " + a.total;
    if (bar) bar.style.width = Math.round(a.done / Math.max(1, a.total) * 100) + "%";
  }

  function toggleCandidate(term) {
    var c = S.photo.candidates.find(function (x) { return x.term === term; });
    if (!c) return;
    if (c.known) {
      var word = store.findByTerm(term);
      if (word) openWord(word.id);
      return;
    }
    c.selected = !c.selected;
    refreshPhotoResults();
  }

  function selectAllCandidates(value) {
    var on = String(value) === "1";
    S.photo.candidates.forEach(function (c) {
      if (!c.known) c.selected = on;
    });
    refreshPhotoResults();
  }

  function manualExtract() {
    var ta = document.getElementById("manual-words");
    if (ta) S.photo.manualText = ta.value;
    var terms = api.extractFromText(S.photo.manualText);
    if (!terms.length) {
      toast("没有从文本里找到可识别的英文单词", "error");
      return;
    }
    S.photo.error = "";
    S.photo.status = "results";
    mergeCandidates(terms);
    render();
    toast("已提取 " + terms.length + " 个候选词", "ok");
  }

  function addPhotoWords() {
    if (S.photo.adding) return;
    var initial = S.photo.candidates.filter(function (c) { return c.selected && !c.known; });
    if (!initial.length) {
      toast("先勾选要收录的词", "error");
      return;
    }
    var settings = store.getSettings();
    var online = settings.online;
    var level = settings.level;
    var ai = settings.ai;
    var useAi = aiReady();
    var job = S.photo.job;
    S.photo.adding = {
      done: 0,
      total: initial.length,
      current: useAi ? "先用 AI 核对词条" : ""
    };
    refreshPhotoResults();

    var prep = useAi
      ? api.aiReviewWords(initial.map(function (c) { return c.term; }), ai)
      : Promise.resolve(null);

    prep.then(function (review) {
      if (!S.photo.adding || job !== S.photo.job) return;
      if (review) applyAiReview(review);
      var list = S.photo.candidates.filter(function (c) { return c.selected && !c.known; });
      if (!list.length) {
        S.photo.adding = null;
        render();
        toast("AI 校对后没有需要新收录的词", "ok");
        return;
      }
      S.photo.adding = { done: 0, total: list.length, current: "" };
      refreshPhotoResults();
      var i = 0;
      var added = 0;

      function step() {
        if (!S.photo.adding) return;
        if (i >= list.length) {
          S.photo.adding = null;
          S.photo.candidates.forEach(function (c) { c.selected = false; });
          render();
          toast(added + " 个词已加入词库", "ok");
          return;
        }
        var c = list[i];
        var aiData = c.ai || S.photo.aiMap[c.term] || null;
        S.photo.adding.current = c.term;
        updateAddProgress();
        var task = online
          ? api.lookup(c.term).catch(function () { return null; })
          : Promise.resolve(null);
        task.then(function (data) {
          if (!S.photo.adding) return;
          var hasData = data && (
            (data.meanings && data.meanings.length) ||
            (data.defs && data.defs.length) ||
            data.phonetic ||
            (data.example && data.example.en) ||
            (data.phrases && data.phrases.length)
          );
          var payload = hasData ? Object.assign({}, data, {
            level: data.level && data.level !== "EXTRA" ? data.level : level
          }) : {
            term: c.term,
            level: level,
            meanings: [],
            example: { en: "", zh: "" },
            phrases: [],
            needsMeaning: true
          };
          if (aiData) {
            if ((!payload.meanings || !payload.meanings.length) && aiData.zh) {
              payload.meanings = [{ pos: aiData.pos || "n.", zh: aiData.zh }];
              payload.needsMeaning = false;
            }
            if (!payload.phonetic && aiData.phonetic) payload.phonetic = aiData.phonetic;
            if (!payload.pos && aiData.pos) payload.pos = aiData.pos;
            if ((!payload.example || !payload.example.en) && aiData.exampleEn) {
              payload.example = { en: aiData.exampleEn, zh: aiData.exampleZh || "" };
            }
          }
          var res = store.addWord(payload, "ocr");
          if (res && res.ok) {
            added += 1;
            c.known = true;
            c.selected = false;
          }
          S.photo.adding.done += 1;
          i += 1;
          updateAddProgress();
          setTimeout(step, 160);
        });
      }
      step();
    }).catch(function () {
      if (!S.photo.adding || job !== S.photo.job) return;
      S.photo.adding = null;
      render();
      toast("AI 校对或收录失败，请稍后重试", "error");
    });
  }

  /* ---------------- 事件绑定 ---------------- */

  function toast(message, tone) {
    var node = document.createElement("div");
    node.className = "toast" + (tone === "error" ? " is-error" : "");
    node.innerHTML = icon(tone === "error" ? "alert" : "check") + "<span>" + esc(message) + "</span>";
    toastEl.appendChild(node);
    setTimeout(function () { node.classList.add("show"); }, 20);
    setTimeout(function () {
      node.classList.remove("show");
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 260);
    }, 3200);
  }

  var libraryTimer = 0;

  function refreshLibraryList() {
    var list = document.getElementById("library-list");
    if (!list) return;
    list.innerHTML = renderLibraryList();
  }

  function focusLibrarySearch() {
    var input = document.getElementById("library-search");
    if (input) {
      input.focus();
      input.select();
    }
  }

  function handleAction(action, el) {
    var id = el.getAttribute("data-id");
    var value = el.getAttribute("data-value");
    switch (action) {
      case "start-session":
        startSession();
        break;
      case "start-full-quiz":
        requestFullQuiz();
        break;
      case "go-photo":
        navigate("photo");
        break;
      case "go-library":
        navigate("library");
        break;
      case "exit-quiz":
        navigate("home");
        break;
      case "summary-home":
        navigate("home");
        break;
      case "new-session":
        startSession();
        break;
      case "new-full-session":
        requestFullQuiz();
        break;
      case "retry-wrong":
        var ids = [];
        if (S.session) {
          S.session.answers.filter(function (a) { return !a.correct; }).forEach(function (a) {
            if (ids.indexOf(a.wordId) < 0) ids.push(a.wordId);
          });
        }
        startSession({ ids: ids });
        break;
      case "answer":
        answerQuestion(el.getAttribute("data-index"));
        break;
      case "next-question":
        nextQuestion();
        break;
      case "open-add":
        openEdit(null);
        break;
      case "open-word":
        openWord(id);
        break;
      case "open-edit":
        openEdit(id);
        break;
      case "close-modal":
        closeModal();
        break;
      case "delete-word":
        var dw = store.getById(id);
        openConfirm({
          title: "删除「" + (dw ? dw.term : "这个词") + "」？",
          message: "词条和它的复习记录会一起删除，这个操作不能撤销。",
          confirmLabel: "删除",
          action: "delete-word",
          data: { id: id }
        });
        break;
      case "confirm-yes":
        doConfirmedAction();
        break;
      case "quiz-word":
        startSession({ ids: [id] });
        break;
      case "speak-word":
        var sw = store.getById(id);
        if (sw) api.speak(sw);
        break;
      case "lookup-word":
        lookupWord(id);
        break;
      case "lookup-edit":
        lookupEditForm();
        break;
      case "filter-library":
        S.library.filter = el.getAttribute("data-filter") || "all";
        render();
        break;
      case "clear-search":
        S.library.q = "";
        render();
        window.scrollTo({ top: 0, behavior: "auto" });
        break;
      case "set-goal":
        store.updateSettings({ dailyGoal: Number(value) });
        render();
        break;
      case "set-level":
        store.updateSettings({ level: value });
        render();
        break;
      case "toggle-setting":
        toggleSetting(el.getAttribute("data-key"));
        break;
      case "pick-photo":
        var fileInput = document.getElementById("photo-input");
        if (fileInput) fileInput.click();
        break;
      case "remove-photo":
        S.photo.job += 1;
        if (S.photo.preview) {
          try { URL.revokeObjectURL(S.photo.preview); } catch (err) {}
        }
        resetPhoto(true);
        render();
        break;
      case "toggle-candidate":
        toggleCandidate(el.getAttribute("data-term"));
        break;
      case "select-all-candidates":
        selectAllCandidates(value);
        break;
      case "add-photo-words":
        addPhotoWords();
        break;
      case "ai-review":
        reviewCandidatesWithAI();
        break;
      case "manual-extract":
        manualExtract();
        break;
      case "focus-manual":
        var manual = document.getElementById("manual-words");
        if (manual) {
          manual.scrollIntoView({ behavior: "smooth", block: "center" });
          manual.focus();
        }
        break;
      case "cloud-ocr":
        openConfirm({
          title: "云端增强识别？",
          message: "这张图片会上传到 ocr.space 做识别，用来改善手写体效果。识别完不会保存在拾词里；如果介意上传，请继续用本地 OCR 或手动输入。",
          confirmLabel: "上传并识别",
          action: "cloud-ocr-confirm",
          tone: "primary"
        });
        break;
      case "toggle-key":
        var field = el.closest && el.closest(".key-field");
        var keyInput = field ? field.querySelector("input") : document.getElementById("ai-key");
        if (keyInput) keyInput.type = keyInput.type === "password" ? "text" : "password";
        break;
      case "test-ai":
        testAIConnection();
        break;
      case "export":
        exportData();
        break;
      case "import":
        var importInput = document.getElementById("import-input");
        if (importInput) importInput.click();
        break;
      case "reset":
        openConfirm({
          title: "恢复示例词库？",
          message: "当前词库会被内置词库替换，已保存的复习记录也会重置。建议先导出备份。",
          confirmLabel: "恢复示例",
          action: "reset-state"
        });
        break;
      case "clear":
        openConfirm({
          title: "清空全部单词？",
          message: "所有词条、复习进度和统计都会从本机删除。这个操作不能撤销。",
          confirmLabel: "全部清空",
          action: "clear-state"
        });
        break;
      default:
        break;
    }
  }

  function toggleSetting(key) {
    if (!key) return;
    var settings = store.getSettings();
    if (key === "aiEnabled") {
      store.updateSettings({ ai: { enabled: !(settings.ai && settings.ai.enabled) } });
      render();
      return;
    }
    var patch = {};
    patch[key] = !settings[key];
    store.updateSettings(patch);
    render();
  }

  function lookupWord(id) {
    var word = store.getById(id);
    if (!word) return;
    toast("正在联网补全 " + word.term + "…");
    api.lookup(word.term).then(function (data) {
      if (!data) throw new Error("没有查到结果");
      var res = store.addWord(data, "online");
      if (!res.ok) throw new Error(res.error || "写入失败");
      if (S.modal && S.modal.type === "word") renderOverlay();
      render();
      var hasZh = res.word && res.word.meanings && res.word.meanings.length;
      toast(hasZh ? "词条已补全" : "已补充音标或例句，中文释义仍需手动补充", hasZh ? "ok" : "error");
    }).catch(function (err) {
      toast((err && err.message) || "联网查询失败，请稍后重试", "error");
    });
  }

  function lookupEditForm() {
    var termInput = document.getElementById("word-term");
    var status = document.getElementById("edit-status");
    if (!termInput) return;
    var term = termInput.value.trim();
    if (!term) {
      toast("先填一个单词", "error");
      termInput.focus();
      return;
    }
    if (status) status.textContent = "正在联网查询 " + term + "…";
    api.lookup(term).then(function (data) {
      if (!data) throw new Error("没有查到结果");
      var phonetic = document.getElementById("word-phonetic");
      var pos = document.getElementById("word-pos");
      var meanings = document.getElementById("word-meanings");
      var exampleEn = document.getElementById("word-example-en");
      var exampleZh = document.getElementById("word-example-zh");
      var phrases = document.getElementById("word-phrases");
      if (phonetic && !phonetic.value.trim()) phonetic.value = data.phonetic || "";
      if (pos && !pos.value.trim()) pos.value = data.pos || "";
      if (meanings && !meanings.value.trim()) {
        meanings.value = (data.meanings || []).map(function (m) {
          return (m.pos || data.pos || "") + " " + (m.zh || []).join("；");
        }).filter(Boolean).join("\n");
      }
      if (exampleEn && !exampleEn.value.trim() && data.example) exampleEn.value = data.example.en || "";
      if (exampleZh && !exampleZh.value.trim() && data.example) exampleZh.value = data.example.zh || "";
      if (phrases && !phrases.value.trim() && data.phrases) {
        phrases.value = data.phrases.map(function (p) { return p.en + " | " + p.zh; }).join("\n");
      }
      if (status) {
        status.textContent = data.meanings && data.meanings.length
          ? "已补全，检查后保存。"
          : "已填入音标或例句，中文释义没查到，请手动补充。";
      }
      toast(data.meanings && data.meanings.length ? "已填入联网结果" : "已填入音标或例句，释义需手动补充", data.meanings && data.meanings.length ? "ok" : "error");
    }).catch(function (err) {
      if (status) status.textContent = "";
      toast((err && err.message) || "联网查询失败", "error");
    });
  }

  function onClick(event) {
    var target = event.target;
    var actionEl = target.closest ? target.closest("[data-action]") : null;
    if (!actionEl) return;
    if (actionEl.tagName === "A") return;
    if (actionEl.disabled) return;
    event.preventDefault();
    handleAction(actionEl.getAttribute("data-action"), actionEl);
  }

  function onInput(event) {
    var target = event.target;
    if (target.id === "library-search") {
      S.library.q = target.value;
      clearTimeout(libraryTimer);
      libraryTimer = setTimeout(refreshLibraryList, 120);
    } else if (target.id === "manual-words") {
      S.photo.manualText = target.value;
    }
  }

  function onChange(event) {
    var target = event.target;
    if (target.id === "photo-input") {
      var file = target.files && target.files[0];
      target.value = "";
      if (file) handlePhotoFile(file);
    } else if (target.id === "library-sort") {
      S.library.sort = target.value;
      refreshLibraryList();
    } else if (target.id === "import-input") {
      var backup = target.files && target.files[0];
      target.value = "";
      if (backup) handleImportFile(backup);
    }
  }

  function onSubmit(event) {
    if (event.target.id === "ai-form") {
      event.preventDefault();
      saveAISettings();
    } else if (event.target.id === "ocr-form") {
      event.preventDefault();
      saveOCRSettings();
    } else if (event.target.id === "word-form") {
      event.preventDefault();
      saveWordForm();
    }
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      if (S.modal) {
        closeModal();
        return;
      }
      if (S.route === "quiz" && S.session && !S.session.finished) {
        navigate("home");
        return;
      }
    }
    var tag = (event.target && event.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || tag === "select";
    if (typing) return;
    if (event.key === "/" && S.route === "library") {
      event.preventDefault();
      focusLibrarySearch();
      return;
    }
    var nativeControl = event.target.closest && event.target.closest("button, a, input, textarea, select");
    var actionable = event.target.closest && event.target.closest('[data-action][role="button"]');
    if (!nativeControl && actionable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleAction(actionable.getAttribute("data-action"), actionable);
      return;
    }
    if (S.route !== "quiz" || !S.session || S.session.finished || S.modal) return;
    if (/^[1-4]$/.test(event.key) && !S.session.feedback) {
      event.preventDefault();
      answerQuestion(Number(event.key) - 1);
    } else if ((event.key === "Enter" || event.key === " ") && S.session.feedback) {
      event.preventDefault();
      nextQuestion();
    }
  }

  function bindEvents() {
    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    document.addEventListener("submit", onSubmit);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("dragover", function (event) {
      if (S.route === "photo") {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      }
    });
    document.addEventListener("drop", function (event) {
      if (S.route !== "photo") return;
      event.preventDefault();
      var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) handlePhotoFile(file);
    });
    document.addEventListener("paste", function (event) {
      if (S.route !== "photo" || S.modal) return;
      var tag = (event.target && event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      var items = event.clipboardData && event.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type && items[i].type.indexOf("image") === 0) {
            var file = items[i].getAsFile();
            if (file) {
              event.preventDefault();
              handlePhotoFile(file);
              return;
            }
          }
        }
      }
      var text = event.clipboardData && event.clipboardData.getData("text");
      if (text) {
        S.photo.manualText = text;
        var ta = document.getElementById("manual-words");
        if (ta) ta.value = text;
        toast("已粘贴到下方输入框，点「从文本提取」", "ok");
      }
    });
    window.addEventListener("hashchange", syncRoute);
  }

  init();
})();


