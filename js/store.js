/* 拾词 · 本地数据、复习调度与统计
   数据只保存在 localStorage。 */
(function () {
  "use strict";

  var WB = window.WB;
  var KEY = "shici.state.v1";
  var VERSION = 1;
  var state = null;
  var lastError = null;

  function defaultSettings() {
    return {
      dailyGoal: 10,
      level: "CET4",
      autoSpeak: false,
      online: true,
      reduceMotion: false,
      ocrKey: "",
      ai: {
        enabled: false,
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        apiKey: ""
      }
    };
  }

  function blankState() {
    return {
      version: VERSION,
      createdAt: Date.now(),
      words: [],
      settings: defaultSettings(),
      stats: { days: {}, log: [] },
      meta: { seededAt: 0 }
    };
  }

  function uid() {
    return "w_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function todayKey(date) {
    var d = date ? new Date(date) : new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function startOfDay(date) {
    var d = new Date(date || Date.now());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function cleanTerm(value) {
    return String(value == null ? "" : value)
      .replace(/[’‘]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanPos(value) {
    var p = String(value || "").trim().toLowerCase();
    if (!p) return "";
    var map = {
      n: "n.", noun: "n.", v: "v.", verb: "v.", adj: "adj.", adjective: "adj.",
      adv: "adv.", adverb: "adv.", prep: "prep.", preposition: "prep.",
      conj: "conj.", conjunction: "conj.", pron: "pron.", pronoun: "pron."
    };
    if (map[p]) return map[p];
    return p.length <= 6 ? p.replace(/\.?$/, ".") : p;
  }

  function splitZh(value) {
    if (Array.isArray(value)) {
      return value.map(function (s) { return String(s || "").trim(); }).filter(Boolean);
    }
    return String(value == null ? "" : value)
      .split(/[；;\n]+/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function normalizePhrases(value) {
    if (!value) return [];
    var arr = Array.isArray(value) ? value : [];
    var out = [];
    arr.forEach(function (p) {
      var en = "";
      var zh = "";
      if (Array.isArray(p)) {
        en = p[0]; zh = p[1];
      } else if (p && typeof p === "object") {
        en = p.en || p.phrase || p.text || "";
        zh = p.zh || p.cn || p.translation || "";
      } else if (typeof p === "string") {
        var bits = p.split(/\s*[|｜]\s*/);
        en = bits[0]; zh = bits.slice(1).join(" ");
      }
      en = String(en || "").trim();
      zh = String(zh || "").trim();
      if (en) out.push({ en: en, zh: zh });
    });
    return out;
  }

  function normalizeDefs(value) {
    if (!value) return [];
    var arr = Array.isArray(value) ? value : [];
    var out = [];
    arr.forEach(function (d) {
      if (!d) return;
      if (typeof d === "string") {
        out.push({ pos: "", en: d });
      } else if (d.en) {
        out.push({ pos: cleanPos(d.pos), en: String(d.en) });
      }
    });
    return out;
  }

  function normalizeExample(raw) {
    var en = "";
    var zh = "";
    if (raw && typeof raw.example === "object" && raw.example) {
      en = raw.example.en || raw.example.text || "";
      zh = raw.example.zh || raw.example.cn || "";
    } else if (typeof raw.example === "string") {
      en = raw.example;
      zh = raw.exampleZh || raw.cn || "";
    }
    if (!en && raw && raw.en) en = raw.en;
    if (!zh && raw && raw.cn) zh = raw.cn;
    en = String(en || "").trim();
    zh = String(zh || "").trim();
    return en ? { en: en, zh: zh } : { en: "", zh: "" };
  }

  function normalizeMeanings(raw) {
    var out = [];
    if (Array.isArray(raw.meanings)) {
      raw.meanings.forEach(function (m) {
        if (!m) return;
        var pos = cleanPos(m.pos || raw.pos);
        var zh = splitZh(m.zh);
        if (zh.length) out.push({ pos: pos, zh: zh });
      });
    }
    if (!out.length && raw.zh) {
      var z = splitZh(raw.zh);
      if (z.length) out.push({ pos: cleanPos(raw.pos), zh: z });
    }
    return out;
  }

  function normalizeWord(raw, source) {
    raw = raw || {};
    var meanings = normalizeMeanings(raw);
    var level = String(raw.level || "EXTRA").toUpperCase();
    if (!WB.LEVELS[level]) level = "EXTRA";
    var stage = Number(raw.stage);
    if (!isFinite(stage) || stage < 0) stage = 0;
    stage = Math.min(Math.floor(stage), WB.INTERVALS.length - 1);
    var reps = Number(raw.reps);
    if (!isFinite(reps) || reps < 0) reps = 0;
    var lapses = Number(raw.lapses);
    if (!isFinite(lapses) || lapses < 0) lapses = 0;
    var now = Date.now();
    var createdAt = Number(raw.createdAt);
    if (!isFinite(createdAt) || createdAt <= 0) createdAt = now;
    var due = Number(raw.due);
    if (!isFinite(due) || due <= 0) due = now;
    var term = cleanTerm(raw.term);
    return {
      id: raw.id || uid(),
      term: term,
      phonetic: String(raw.phonetic || "").trim(),
      audio: String(raw.audio || "").trim(),
      level: level,
      pos: cleanPos(raw.pos || (meanings[0] && meanings[0].pos) || ""),
      meanings: meanings,
      defs: normalizeDefs(raw.defs),
      example: normalizeExample(raw),
      phrases: normalizePhrases(raw.phrases),
      tags: Array.isArray(raw.tags) ? raw.tags.map(String).filter(Boolean) : [],
      source: source || raw.source || "manual",
      needsMeaning: meanings.length === 0,
      stage: stage,
      reps: reps,
      lapses: lapses,
      due: due,
      lastReviewed: Number(raw.lastReviewed) || 0,
      lastResult: raw.lastResult === "again" ? "again" : (raw.lastResult === "good" ? "good" : ""),
      history: Array.isArray(raw.history) ? raw.history.slice(-50) : [],
      createdAt: createdAt,
      updatedAt: Number(raw.updatedAt) || now
    };
  }

  function hydrate(saved) {
    var base = blankState();
    if (!saved || typeof saved !== "object") return base;
    base.createdAt = Number(saved.createdAt) || base.createdAt;
    base.meta = Object.assign({}, base.meta, saved.meta || {});
    var settings = Object.assign({}, base.settings, saved.settings || {});
    settings.ai = Object.assign({}, base.settings.ai, (saved.settings && saved.settings.ai) || {});
    settings.dailyGoal = WB.DAILY_GOALS.indexOf(Number(settings.dailyGoal)) >= 0
      ? Number(settings.dailyGoal) : 10;
    if (!WB.LEVELS[settings.level]) settings.level = "CET4";
    base.settings = settings;
    base.stats = {
      days: saved.stats && saved.stats.days && typeof saved.stats.days === "object" ? saved.stats.days : {},
      log: saved.stats && Array.isArray(saved.stats.log) ? saved.stats.log.slice(-1000) : []
    };
    var seen = {};
    base.words = (Array.isArray(saved.words) ? saved.words : []).map(function (w) {
      var n = normalizeWord(w, "import");
      var key = n.term.toLowerCase();
      if (!n.term || seen[key]) return null;
      seen[key] = true;
      return n;
    }).filter(Boolean);
    return base;
  }

  function seedWordList() {
    var dueTerms = { norm: 1, conform: 1, criterion: 1, perceive: 1, assess: 1, compromise: 1 };
    var now = Date.now();
    return (WB.SEED_WORDS || []).map(function (raw, index) {
      var w = normalizeWord(raw, "seed");
      w.id = raw.id || ("seed-" + w.term.toLowerCase());
      w.source = "seed";
      w.createdAt = now - (WB.SEED_WORDS.length - index + 2) * 36e5;
      w.updatedAt = w.createdAt;
      w.due = now;
      if (dueTerms[w.term]) {
        w.stage = 2;
        w.reps = 2;
        w.lastReviewed = now - 12 * 36e5;
        w.lastResult = "good";
        w.createdAt = now - 3 * 864e5;
        w.due = now - 20 * 60e3;
      }
      return w;
    });
  }

  function save() {
    lastError = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      lastError = err;
      console.warn("拾词：本地保存失败", err);
      return false;
    }
  }

  function init() {
    var saved = null;
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (err) {
      console.warn("拾词：读取本地数据失败，将使用示例词库。", err);
    }
    if (saved) {
      state = hydrate(saved);
      if (!state.words.length && !state.meta.seededAt) {
        state.words = seedWordList();
        state.meta.seededAt = Date.now();
      }
    } else {
      state = blankState();
      state.words = seedWordList();
      state.meta.seededAt = Date.now();
    }
    save();
    return state;
  }

  function ensure() {
    if (!state) init();
    return state;
  }

  function getState() { return ensure(); }
  function getSettings() { return ensure().settings; }
  function getWords() { return ensure().words; }

  function findByTerm(term) {
    var t = cleanTerm(term).toLowerCase();
    if (!t) return null;
    return ensure().words.find(function (w) { return w.term.toLowerCase() === t; }) || null;
  }

  function getById(id) {
    return ensure().words.find(function (w) { return w.id === id; }) || null;
  }

  function primaryMeaning(word) {
    if (!word || !word.meanings || !word.meanings.length) return "释义待补充";
    var zh = word.meanings[0].zh || [];
    var first = zh.find(function (z) { return z && z.trim(); });
    return first ? first.replace(/^[a-z]+\.\s*/i, "").trim() : "释义待补充";
  }

  function fullMeaning(word) {
    if (!word || !word.meanings || !word.meanings.length) return "释义待补充";
    return word.meanings.map(function (m) {
      return (m.zh || []).join("；");
    }).filter(Boolean).join("  /  ");
  }

  function addWord(raw, source) {
    ensure();
    var term = cleanTerm(raw && raw.term);
    if (!term) return { ok: false, error: "单词不能为空" };
    var existing = findByTerm(term);
    if (existing) {
      mergeWord(existing, raw, source);
      save();
      return { ok: true, word: existing, added: false };
    }
    var w = normalizeWord(Object.assign({}, raw, { term: term }), source || "manual");
    w.id = raw.id || uid();
    w.createdAt = Date.now();
    w.updatedAt = Date.now();
    w.due = Date.now();
    w.stage = 0;
    w.reps = 0;
    state.words.unshift(w);
    save();
    return { ok: true, word: w, added: true };
  }

  function mergeWord(target, raw, source) {
    var incoming = normalizeWord(Object.assign({}, raw, { term: target.term }), source || target.source);
    if (incoming.meanings.length && (!target.meanings.length || target.needsMeaning)) {
      target.meanings = incoming.meanings;
      target.needsMeaning = false;
    }
    if (!target.phonetic && incoming.phonetic) target.phonetic = incoming.phonetic;
    if (!target.audio && incoming.audio) target.audio = incoming.audio;
    if (target.level === "EXTRA" && incoming.level !== "EXTRA") target.level = incoming.level;
    if (!target.pos && incoming.pos) target.pos = incoming.pos;
    if ((!target.example || !target.example.en) && incoming.example && incoming.example.en) {
      target.example = incoming.example;
    }
    if (!target.defs.length && incoming.defs.length) target.defs = incoming.defs;
    if (incoming.phrases.length) {
      var seen = {};
      target.phrases.forEach(function (p) { seen[p.en.toLowerCase()] = true; });
      incoming.phrases.forEach(function (p) {
        if (!seen[p.en.toLowerCase()]) target.phrases.push(p);
      });
    }
    if (Array.isArray(raw && raw.tags)) {
      raw.tags.forEach(function (t) {
        if (target.tags.indexOf(t) < 0) target.tags.push(t);
      });
    }
    target.updatedAt = Date.now();
  }

  function updateWord(id, fields) {
    ensure();
    var w = getById(id);
    if (!w) return { ok: false, error: "词条不存在" };
    var term = cleanTerm(fields && fields.term);
    if (!term) return { ok: false, error: "单词不能为空" };
    var dup = findByTerm(term);
    if (dup && dup.id !== id) return { ok: false, error: "词库里已经有这个单词了" };
    w.term = term;
    w.phonetic = String(fields.phonetic || "").trim();
    if (fields.level && WB.LEVELS[String(fields.level).toUpperCase()]) {
      w.level = String(fields.level).toUpperCase();
    }
    w.pos = cleanPos(fields.pos || "");
    var groups = normalizeMeanings({
      meanings: fields.meanings,
      pos: fields.pos || w.pos,
      zh: fields.zh
    });
    w.meanings = groups;
    w.needsMeaning = !groups.length;
    w.example = {
      en: String(fields.exampleEn || "").trim(),
      zh: String(fields.exampleZh || "").trim()
    };
    w.phrases = normalizePhrases(fields.phrases || []);
    w.updatedAt = Date.now();
    if (!w.meanings.length) w.level = "EXTRA";
    save();
    return { ok: true, word: w };
  }

  function deleteWord(id) {
    ensure();
    var before = state.words.length;
    state.words = state.words.filter(function (w) { return w.id !== id; });
    if (state.words.length !== before) {
      save();
      return true;
    }
    return false;
  }

  function recordAnswer(id, correct, type) {
    ensure();
    var w = getById(id);
    if (!w) return null;
    var now = Date.now();
    var wasNew = w.reps === 0;
    var stageBefore = w.stage;
    var interval;
    if (correct) {
      interval = WB.INTERVALS[Math.min(w.stage, WB.INTERVALS.length - 1)];
      w.stage = Math.min(w.stage + 1, WB.INTERVALS.length - 1);
      w.reps += 1;
    } else {
      w.stage = Math.max(0, w.stage - 2);
      interval = WB.INTERVALS[w.stage];
      w.lapses += 1;
      w.reps += 1;
    }
    var jitter = 0.94 + Math.random() * 0.12;
    w.due = now + Math.round(interval.ms * jitter);
    w.lastReviewed = now;
    w.lastResult = correct ? "good" : "again";
    w.updatedAt = now;
    w.history = (w.history || []).concat([{
      at: now, correct: !!correct, type: type || "meaning", stageBefore: stageBefore
    }]).slice(-50);

    var today = todayKey(now);
    var days = state.stats.days;
    if (!days[today]) days[today] = { new: 0, review: 0, correct: 0, total: 0 };
    if (wasNew) days[today].new += 1;
    else days[today].review += 1;
    days[today].total += 1;
    if (correct) days[today].correct += 1;

    state.stats.log.push({ t: now, wordId: w.id, correct: !!correct, type: type || "meaning" });
    if (state.stats.log.length > 1000) state.stats.log = state.stats.log.slice(-1000);
    save();
    return {
      word: w,
      wasNew: wasNew,
      interval: interval,
      nextDue: w.due,
      correct: !!correct
    };
  }

  function computeStreak(days) {
    var d = startOfDay();
    var key = todayKey(d);
    if (!days[key] || !days[key].total) {
      d.setDate(d.getDate() - 1);
    }
    var streak = 0;
    for (var i = 0; i < 3660; i++) {
      var k = todayKey(d);
      if (days[k] && days[k].total > 0) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function statsSummary() {
    ensure();
    var now = Date.now();
    var words = state.words;
    var days = state.stats.days;
    var today = days[todayKey(now)] || { new: 0, review: 0, correct: 0, total: 0 };
    var due = 0, fresh = 0, mastered = 0, learning = 0;
    words.forEach(function (w) {
      if (w.needsMeaning) return;
      if (w.reps === 0) fresh += 1;
      else if (w.due <= now) due += 1;
      if (w.reps > 0 && w.stage >= 7) mastered += 1;
      else if (w.reps > 0) learning += 1;
    });

    var correct7 = 0, total7 = 0;
    var week = [];
    var weekLabels = ["日", "一", "二", "三", "四", "五", "六"];
    for (var i = 6; i >= 0; i--) {
      var d = startOfDay();
      d.setDate(d.getDate() - i);
      var k = todayKey(d);
      var row = days[k] || { new: 0, review: 0, correct: 0, total: 0 };
      correct7 += row.correct || 0;
      total7 += row.total || 0;
      week.push({
        key: k,
        label: weekLabels[d.getDay()],
        total: row.total || 0,
        correct: row.correct || 0,
        isToday: i === 0
      });
    }

    var nextDue = words.filter(function (w) {
      return w.reps > 0 && !w.needsMeaning && w.due > now;
    }).sort(function (a, b) { return a.due - b.due; })[0] || null;

    return {
      today: today,
      todayTotal: today.total || 0,
      due: due,
      fresh: fresh,
      totalWords: words.length,
      mastered: mastered,
      learning: learning,
      accuracy7: total7 ? Math.round(correct7 / total7 * 100) : 0,
      hasAccuracy: total7 > 0,
      streak: computeStreak(days),
      nextDue: nextDue,
      week: week,
      goal: state.settings.dailyGoal
    };
  }

  function sessionWords(limit) {
    ensure();
    var now = Date.now();
    var size = limit || Math.max(5, Math.min(10, state.settings.dailyGoal));
    var pool = state.words.filter(function (w) {
      return !w.needsMeaning && w.meanings && w.meanings.length;
    });
    var due = pool.filter(function (w) { return w.reps > 0 && w.due <= now; })
      .sort(function (a, b) { return a.due - b.due; });
    var fresh = pool.filter(function (w) { return w.reps === 0; })
      .sort(function (a, b) {
        var lvl = state.settings.level;
        var al = a.level === lvl ? 0 : 1;
        var bl = b.level === lvl ? 0 : 1;
        if (al !== bl) return al - bl;
        return a.createdAt - b.createdAt;
      });
    var out = due.slice(0, size);
    if (out.length < size) out = out.concat(fresh.slice(0, size - out.length));
    if (!out.length) {
      out = pool.slice().sort(function (a, b) {
        return (a.lastReviewed || a.createdAt) - (b.lastReviewed || b.createdAt);
      }).slice(0, size);
    }
    return out;
  }

  function statusOf(word) {
    if (!word) return "new";
    if (word.needsMeaning) return "pending";
    if (word.reps === 0) return "new";
    if (word.due <= Date.now()) return "due";
    if (word.stage >= 7) return "mastered";
    return "learning";
  }

  function dueText(word) {
    if (!word) return "";
    if (word.needsMeaning) return "待补充释义";
    if (word.reps === 0) return "新词";
    var diff = word.due - Date.now();
    if (diff <= 0) return "现在复习";
    var mins = Math.round(diff / 60000);
    if (mins < 60) return mins + " 分钟后";
    var hours = Math.round(diff / 36e5);
    if (hours < 24) return hours + " 小时后";
    var days = Math.round(diff / 864e5);
    return days + " 天后";
  }

  function updateSettings(patch) {
    ensure();
    Object.assign(state.settings, patch || {});
    if (patch && patch.ai) {
      state.settings.ai = Object.assign({}, state.settings.ai, patch.ai);
    }
    if (WB.DAILY_GOALS.indexOf(Number(state.settings.dailyGoal)) < 0) state.settings.dailyGoal = 10;
    save();
    return state.settings;
  }

  function exportState() {
    ensure();
    return JSON.parse(JSON.stringify(state));
  }

  function importState(data) {
    if (!data || !Array.isArray(data.words)) {
      return { ok: false, error: "文件格式不正确：缺少 words 列表" };
    }
    var next = hydrate(data);
    if (!next.words.length) return { ok: false, error: "文件里没有可导入的单词" };
    state = next;
    save();
    return { ok: true, count: state.words.length };
  }

  function reset(keepSettings) {
    ensure();
    var settings = keepSettings ? JSON.parse(JSON.stringify(state.settings)) : defaultSettings();
    state = blankState();
    state.settings = settings;
    state.words = seedWordList();
    state.meta.seededAt = Date.now();
    save();
    return state;
  }

  function clearWords() {
    ensure();
    state.words = [];
    state.stats = { days: {}, log: [] };
    save();
  }

  function recentWords(limit) {
    return ensure().words.slice().sort(function (a, b) {
      return b.createdAt - a.createdAt;
    }).slice(0, limit || 4);
  }

  WB.store = {
    KEY: KEY,
    init: init,
    state: getState,
    getWords: getWords,
    getSettings: getSettings,
    findByTerm: findByTerm,
    getById: getById,
    addWord: addWord,
    updateWord: updateWord,
    deleteWord: deleteWord,
    recordAnswer: recordAnswer,
    stats: statsSummary,
    sessionWords: sessionWords,
    statusOf: statusOf,
    dueText: dueText,
    primaryMeaning: primaryMeaning,
    fullMeaning: fullMeaning,
    updateSettings: updateSettings,
    exportState: exportState,
    importState: importState,
    reset: reset,
    clearWords: clearWords,
    recentWords: recentWords,
    todayKey: todayKey,
    save: save,
    lastError: function () { return lastError; }
  };
})();
