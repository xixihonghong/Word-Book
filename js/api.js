/* 拾词 · 联网词典、翻译、发音与 OCR
   默认链路：dictionaryapi.dev（英文释义/音标/例句）+ MyMemory（中文释义/例句翻译）
   可选：OpenAI 兼容接口（用于 OCR 结果纠错） */
(function () {
  "use strict";

  var WB = window.WB;
  var LOOKUP_KEY = "shici.lookup.v1";
  var TTL = 7 * 24 * 60 * 60 * 1000;
  var TESSERACT_LOCAL = "tess/tesseract.min.js";
  var TESSERACT_WORKER = "tess/worker.min.js";
  var TESSERACT_CORE = "tess/tesseract-core-simd-lstm.wasm.js";
  var TESSERACT_LANG = "tess/lang";
  var cache = null;

  function loadCache() {
    if (cache) return cache;
    try {
      var raw = localStorage.getItem(LOOKUP_KEY);
      cache = raw ? JSON.parse(raw) : {};
    } catch (err) {
      cache = {};
    }
    if (!cache || typeof cache !== "object") cache = {};
    return cache;
  }

  function saveCache() {
    try {
      var keys = Object.keys(cache);
      if (keys.length > 220) {
        keys.sort(function (a, b) { return (cache[a].t || 0) - (cache[b].t || 0); });
        keys.slice(0, keys.length - 220).forEach(function (k) { delete cache[k]; });
      }
      localStorage.setItem(LOOKUP_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn("拾词：查词缓存写入失败", err);
    }
  }

  function cachedLookup(term) {
    var c = loadCache()[term];
    if (c && c.t && Date.now() - c.t < TTL && c.data) return c.data;
    return null;
  }

  function setCachedLookup(term, data) {
    loadCache()[term] = { t: Date.now(), data: data };
    saveCache();
  }

  function decodeHtml(text) {
    var s = String(text == null ? "" : text);
    if (!s) return "";
    if (/&(#\d+|#x[0-9a-f]+|[a-z]+);/i.test(s)) {
      var ta = document.createElement("textarea");
      ta.innerHTML = s;
      return ta.value;
    }
    return s;
  }

  function cleanText(text) {
    return decodeHtml(String(text == null ? "" : text))
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanPos(value) {
    var p = String(value || "").toLowerCase();
    var map = {
      noun: "n.", verb: "v.", adjective: "adj.", adverb: "adv.",
      preposition: "prep.", conjunction: "conj.", pronoun: "pron.",
      n: "n.", v: "v.", adj: "adj.", adv: "adv."
    };
    return map[p] || (p ? p + "." : "");
  }

  function fetchJSON(url, options, timeout) {
    var opts = options || {};
    var ms = timeout || 9000;
    return new Promise(function (resolve, reject) {
      var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error("请求超时"));
      }, ms);
      var headers = Object.assign({ "Accept": "application/json" }, opts.headers || {});
      fetch(url, {
        method: opts.method || "GET",
        headers: headers,
        body: opts.body,
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        clearTimeout(timer);
        if (!res.ok) {
          var e = new Error("HTTP " + res.status);
          e.status = res.status;
          throw e;
        }
        return res.json();
      }).then(resolve).catch(function (err) {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  function translateText(text, timeout) {
    var clean = String(text || "").trim().slice(0, 450);
    if (!clean) return Promise.resolve("");
    var url = "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(clean) + "&langpair=en%7Czh-CN";
    return fetchJSON(url, null, timeout || 9000).then(function (data) {
      var out = data && data.responseData && data.responseData.translatedText;
      out = cleanText(out);
      if (!out) return "";
      if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID/i.test(out)) return "";
      return out;
    }).catch(function () {
      return "";
    });
  }

  function parseZhGroups(text) {
    var raw = cleanText(text);
    if (!raw) return [];
    var groups = [];
    var byPos = {};
    raw.split(/[;；]+/).forEach(function (segment) {
      segment = segment.trim();
      if (!segment) return;
      var m = segment.match(/^([a-z]+\.)\s*(.+)$/i);
      var pos = m ? m[1].toLowerCase() : "";
      var body = m ? m[2] : segment;
      var glosses = body.split(/[,，、]+/).map(function (s) {
        return s.replace(/^[a-z]+\.\s*/i, "").trim();
      }).filter(function (s) {
        return s && /[\u4e00-\u9fa5]/.test(s) && s.length <= 24;
      });
      if (!glosses.length) return;
      if (!byPos[pos]) {
        byPos[pos] = { pos: pos, zh: [] };
        groups.push(byPos[pos]);
      }
      glosses.forEach(function (g) {
        if (byPos[pos].zh.indexOf(g) < 0 && byPos[pos].zh.length < 8) byPos[pos].zh.push(g);
      });
    });
    return groups;
  }

  function parseDictionary(entries) {
    var out = { phonetic: "", audio: "", defs: [], example: "", pos: "" };
    if (!Array.isArray(entries) || !entries.length) return out;
    var entry = entries[0] || {};
    out.phonetic = entry.phonetic || "";
    (entry.phonetics || []).forEach(function (p) {
      if (!out.phonetic && p && p.text) out.phonetic = p.text;
      if (!out.audio && p && p.audio) out.audio = p.audio;
    });
    entries.forEach(function (e) {
      (e.meanings || []).forEach(function (m) {
        var pos = cleanPos(m.partOfSpeech);
        if (!out.pos && pos) out.pos = pos;
        (m.definitions || []).slice(0, 3).forEach(function (d) {
          if (d && d.definition && out.defs.length < 8) {
            out.defs.push({ pos: pos, en: cleanText(d.definition) });
          }
          if (!out.example && d && d.example) {
            var ex = cleanText(d.example);
            if (ex.length > 8) out.example = ex;
          }
        });
      });
    });
    return out;
  }

  function cacheKey(term) {
    return String(term || "").toLowerCase().trim();
  }

  function lookup(term, options) {
    var opts = options || {};
    var key = cacheKey(term);
    if (!key) return Promise.reject(new Error("单词为空"));
    if (!opts.force) {
      var hit = cachedLookup(key);
      if (hit) return Promise.resolve(hit);
    }

    var dictUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(key);
    var dictPromise = fetchJSON(dictUrl, null, 9000).catch(function () { return null; });
    var zhPromise = translateText(key, 9000);

    return Promise.all([dictPromise, zhPromise]).then(function (results) {
      var dict = parseDictionary(results[0]);
      var groups = parseZhGroups(results[1]);
      var example = dict.example;

      var examplePromise = example
        ? translateText(example, 9000).then(function (zh) {
            return { en: example, zh: zh || "" };
          })
        : Promise.resolve({ en: "", zh: "" });

      return examplePromise.then(function (exampleObj) {
        if (!groups.length) {
          // 单词直译失败时，尝试翻译第一条英文释义，至少给用户一个中文抓手。
          var firstDef = dict.defs[0] && dict.defs[0].en;
          if (!firstDef) return finish(null);
          return translateText(firstDef, 9000).then(function (defZh) {
            var defGroups = parseZhGroups(defZh);
            if (defGroups.length) {
              groups = defGroups.map(function (g) {
                return { pos: g.pos || dict.pos, zh: g.zh };
              });
            }
            return finish(null);
          });
        }
        return finish(null);

        function finish() {
          var needsMeaning = !groups.length;
          if (!groups.length && !dict.defs.length && !exampleObj.en) {
            throw new Error("没有查到这个词的词典信息，请检查拼写或手动添加");
          }
          var data = {
            term: key,
            phonetic: dict.phonetic ? (dict.phonetic.indexOf("/") === 0 ? dict.phonetic : "/" + dict.phonetic + "/") : "",
            audio: dict.audio || "",
            level: "EXTRA",
            pos: dict.pos,
            meanings: groups,
            defs: dict.defs,
            example: exampleObj,
            phrases: [],
            needsMeaning: needsMeaning,
            source: "online"
          };
          if (!needsMeaning || exampleObj.en) setCachedLookup(key, data);
          return data;
        }
      });
    }).catch(function (err) {
      if (err && err.name === "AbortError") throw new Error("联网查词超时，请稍后重试");
      throw err;
    });
  }

  function audioUrl(term) {
    return "https://dict.youdao.com/dictvoice?audio=" + encodeURIComponent(term) + "&type=2";
  }

  function tts(term) {
    if (!("speechSynthesis" in window)) return false;
    try {
      var u = new SpeechSynthesisUtterance(String(term));
      u.lang = "en-US";
      u.rate = 0.88;
      var voices = window.speechSynthesis.getVoices() || [];
      var voice = voices.find(function (v) { return /^en(-|_)US/i.test(v.lang); });
      if (voice) u.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      return true;
    } catch (err) {
      return false;
    }
  }

  function speak(word) {
    var term = typeof word === "string" ? word : (word && word.term);
    if (!term) return;
    var url = (word && typeof word === "object" && word.audio) ? word.audio : audioUrl(term);
    var audio = new Audio(url);
    audio.play().catch(function () { tts(term); });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.Tesseract) return resolve(window.Tesseract);
      var existing = Array.prototype.slice.call(document.scripts).find(function (s) {
        return s.getAttribute("src") === src;
      });
      if (existing) {
        existing.addEventListener("load", function () { resolve(window.Tesseract); });
        existing.addEventListener("error", function () { reject(new Error("OCR 引擎脚本加载失败")); });
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = function () {
        if (window.Tesseract) resolve(window.Tesseract);
        else reject(new Error("OCR 引擎脚本加载失败"));
      };
      script.onerror = function () { reject(new Error("OCR 引擎脚本没有加载成功，请确认 tess 文件夹完整")); };
      document.head.appendChild(script);
    });
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("图片读取失败")); };
      img.src = url;
    });
  }

  function preprocessImage(file, maxSide) {
    var max = maxSide || 1800;
    var objectUrl = URL.createObjectURL(file);
    return loadImage(objectUrl).then(function (img) {
      var scale = Math.min(1, max / Math.max(img.width, img.height));
      var width = Math.max(1, Math.round(img.width * scale));
      var height = Math.max(1, Math.round(img.height * scale));
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      var image = ctx.getImageData(0, 0, width, height);
      var data = image.data;
      var sum = 0;
      var count = 0;
      for (var i = 0; i < data.length; i += 40) {
        sum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        count += 1;
      }
      var dark = sum / Math.max(1, count) < 118;
      for (var j = 0; j < data.length; j += 4) {
        var r = data[j], g = data[j + 1], b = data[j + 2];
        if (dark) {
          r = 255 - r; g = 255 - g; b = 255 - b;
        }
        var gray = r * 0.299 + g * 0.587 + b * 0.114;
        gray = Math.max(0, Math.min(255, (gray - 128) * 1.28 + 128));
        data[j] = gray;
        data[j + 1] = gray;
        data[j + 2] = gray;
      }
      ctx.putImageData(image, 0, 0);
      return canvas;
    }, function (err) {
      URL.revokeObjectURL(objectUrl);
      throw err;
    });
  }

  function isValidToken(token) {
    if (!token) return false;
    var t = String(token).replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, "").replace(/[’‘]/g, "'").toLowerCase();
    if (!/^[a-z][a-z'-]{2,23}$/.test(t)) return false;
    if (t.indexOf("--") >= 0 || t.indexOf("''") >= 0) return false;
    if (WB.STOPWORDS.has(t)) return false;
    return true;
  }

  function normalizeToken(token) {
    return String(token || "").replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, "").replace(/[’‘]/g, "'").toLowerCase();
  }

  function extractFromText(text) {
    var tokens = String(text || "").match(/[A-Za-z][A-Za-z'’-]{1,22}/g) || [];
    var seen = {};
    var out = [];
    tokens.forEach(function (raw) {
      var t = normalizeToken(raw);
      if (!isValidToken(t) || seen[t]) return;
      seen[t] = true;
      out.push(t);
    });
    return out.slice(0, 28);
  }

  function wordsFromOcr(data, text) {
    var score = {};
    var firstSeen = {};
    var order = 0;
    (data && Array.isArray(data.words) ? data.words : []).forEach(function (w) {
      var t = normalizeToken(w && w.text);
      if (!isValidToken(t) || (w.confidence && w.confidence < 45)) return;
      if (!(t in score)) firstSeen[t] = order++;
      score[t] = (score[t] || 0) + 20 + (w.confidence || 0) / 10;
    });
    extractFromText(text).forEach(function (t, i) {
      if (!(t in score)) firstSeen[t] = order++;
      score[t] = (score[t] || 0) + 10;
    });
    return Object.keys(score).sort(function (a, b) {
      return (score[b] - score[a]) || (firstSeen[a] - firstSeen[b]);
    }).slice(0, 28);
  }

  function recognizeImage(file, onProgress) {
    var progress = typeof onProgress === "function" ? onProgress : function () {};
    if (!file) return Promise.reject(new Error("没有选择图片"));
    if (!/^image\//.test(file.type || "")) {
      return Promise.reject(new Error("请选择 JPG、PNG 或 WebP 图片"));
    }
    if (location.protocol === "file:") {
      return Promise.reject(new Error("拍照识别需要通过本地服务打开。请回到文件夹双击「启动单词本.bat」，等浏览器打开 http://localhost:8080 后再试。"));
    }
    progress({ label: "正在优化图片", progress: 0.04 });
    return preprocessImage(file).then(function (canvas) {
      progress({ label: "正在加载本地识别引擎", progress: 0.1 });
      return loadScript(TESSERACT_LOCAL).then(function (Tesseract) {
        var labels = {
          "loading tesseract core": "正在加载识别引擎",
          "initializing tesseract": "正在初始化识别引擎",
          "loading language traineddata": "正在加载英文语言包",
          "initializing api": "正在准备识别",
          "recognizing text": "正在识别文字"
        };
        return Tesseract.createWorker("eng", 1, {
          workerPath: TESSERACT_WORKER,
          corePath: TESSERACT_CORE,
          langPath: TESSERACT_LANG,
          workerBlobURL: false,
          logger: function (m) {
            if (!m) return;
            var base = m.progress || 0;
            if (m.status === "recognizing text") base = 0.16 + base * 0.8;
            progress({
              label: labels[m.status] || "正在处理",
              progress: Math.max(0.05, Math.min(0.98, base))
            });
          }
        }).then(function (worker) {
          return worker.recognize(canvas).then(function (result) {
            return worker.terminate().then(function () { return result; });
          }, function (err) {
            return worker.terminate().then(function () { throw err; });
          });
        });
      });
    }).then(function (result) {
      var text = (result && result.data && result.data.text) ? result.data.text : "";
      var words = wordsFromOcr(result && result.data, text);
      progress({ label: "正在整理单词", progress: 1 });
      return {
        text: text,
        words: words,
        confidence: Math.round((result && result.data && result.data.confidence) || 0)
      };
    }).catch(function (err) {
      if (/failed to fetch|network|load/i.test(String(err && err.message))) {
        throw new Error("OCR 引擎加载失败。请确认 tess 文件夹完整；拍照识别建议通过「启动单词本.bat」打开。");
      }
      throw err;
    });
  }

  function recognizeImageCloud(file, options) {
    var opts = options || {};
    if (!file) return Promise.reject(new Error("没有选择图片"));
    var form = new FormData();
    form.append("apikey", String(opts.key || "helloworld"));
    form.append("language", "eng");
    form.append("isOverlayRequired", "false");
    form.append("OCREngine", "2");
    form.append("scale", "true");
    form.append("detectOrientation", "true");
    form.append("file", file, file.name || "photo.jpg");
    return fetchJSON("https://api.ocr.space/parse/image", {
      method: "POST",
      body: form
    }, 60000).then(function (res) {
      if (!res || res.IsErroredOnProcessing) {
        var msg = res && res.ErrorMessage;
        if (Array.isArray(msg)) msg = msg.join("；");
        throw new Error(msg || "云端识别失败，请稍后重试");
      }
      var parsed = res.ParsedResults && res.ParsedResults[0];
      var text = parsed && parsed.ParsedText ? parsed.ParsedText : "";
      if (!text.trim()) throw new Error("云端没有识别到文字");
      return {
        text: text,
        words: wordsFromOcr(null, text),
        confidence: 0,
        cloud: true
      };
    }).catch(function (err) {
      if (err && err.status === 429) {
        throw new Error("云端 OCR 试用 Key 已被限流。请到「我的 → 云端增强识别」填写自己的免费 OCR.space Key，或稍后再试。");
      }
      if (err && (err.status === 401 || err.status === 403)) {
        throw new Error("云端 OCR Key 无效或没有权限。请检查「我的 → 云端增强识别」里的 Key。");
      }
      if (/abort|timeout|超时/i.test(String(err && err.message))) {
        throw new Error("云端识别超时，请检查网络后重试");
      }
      throw err;
    });
  }

  function aiExtract(text, ai) {
    if (!ai || !ai.enabled || !ai.apiKey) return Promise.resolve(null);
    var base = String(ai.baseUrl || "https://api.deepseek.com").replace(/\/+$/, "");
    var url = base + "/chat/completions";
    var body = {
      model: ai.model || "deepseek-chat",
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是一个英语单词提取器。只提取 OCR 文本中真正像英语词条的单词，纠正明显的 OCR 错误，忽略解释、例句和指令。只输出 JSON。"
        },
        {
          role: "user",
          content: "从下面的 OCR 文本中提取 1—30 个英语单词。返回格式：{\"words\":[\"norm\",\"conform\"]}。\n\n<<<OCR\n" +
            String(text || "").slice(0, 6000) + "\nOCR>>>"
        }
      ]
    };
    return fetchJSON(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ai.apiKey
      },
      body: JSON.stringify(body)
    }, 20000).then(function (res) {
      var content = res && res.choices && res.choices[0] && res.choices[0].message &&
        res.choices[0].message.content;
      if (!content) return null;
      var cleaned = String(content).replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      var parsed;
      try { parsed = JSON.parse(cleaned); } catch (err) { return null; }
      var list = Array.isArray(parsed) ? parsed : parsed.words;
      if (!Array.isArray(list)) return null;
      var seen = {};
      return list.map(function (w) {
        return normalizeToken(typeof w === "string" ? w : (w && w.term));
      }).filter(function (w) {
        if (!isValidToken(w) || seen[w]) return false;
        seen[w] = true;
        return true;
      }).slice(0, 30);
    }).catch(function (err) {
      console.warn("拾词：AI 识词失败", err);
      return null;
    });
  }

  function aiReviewWords(terms, ai) {
    if (!ai || !ai.enabled || !ai.apiKey) return Promise.resolve(null);
    var list = (terms || []).map(function (t) { return normalizeToken(t); }).filter(function (t, i, arr) {
      return t && arr.indexOf(t) === i;
    }).slice(0, 40);
    if (!list.length) return Promise.resolve([]);
    var base = String(ai.baseUrl || "https://api.deepseek.com").replace(/\/+$/, "");
    var url = base + "/chat/completions";
    var body = {
      model: ai.model || "deepseek-chat",
      temperature: 0.1,
      max_tokens: 3200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是四六级词典编辑。输入是 OCR 候选词，可能有拼写错误。逐个判断：明显拼错就改成正确英文单词（例如 acep-seated -> deep-seated、spontancous -> spontaneous）；不是英文单词或只是页眉噪声就标记 valid=false；不要改成人名地名。对有效词给出简洁中文释义、音标、词性、一个四六级难度的英文例句和中文翻译。只输出 JSON。"
        },
        {
          role: "user",
          content: "校对并补全下面这些候选词。返回：{\"words\":[{\"original\":\"acep-seated\",\"term\":\"deep-seated\",\"valid\":true,\"phonetic\":\"/ˌdiːp ˈsiːtɪd/\",\"pos\":\"adj.\",\"zh\":\"根深蒂固的\",\"exampleEn\":\"The distrust is deep-seated.\",\"exampleZh\":\"这种不信任根深蒂固。\"}]}。不要遗漏任何输入词；不确定的也保留 original 并标记 valid=false。\n\n候选词：" +
            JSON.stringify(list)
        }
      ]
    };
    return fetchJSON(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ai.apiKey
      },
      body: JSON.stringify(body)
    }, 30000).then(function (res) {
      var content = res && res.choices && res.choices[0] && res.choices[0].message &&
        res.choices[0].message.content;
      if (!content) return null;
      var cleaned = String(content).replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      var parsed;
      try { parsed = JSON.parse(cleaned); } catch (err) { return null; }
      var raw = Array.isArray(parsed) ? parsed : parsed.words;
      if (!Array.isArray(raw)) return null;
      var byOriginal = {};
      raw.forEach(function (item) {
        if (!item) return;
        var original = normalizeToken(item.original || item.word || item.term);
        if (!original) return;
        var term = normalizeToken(item.term || original);
        var valid = item.valid !== false && isValidToken(term);
        byOriginal[original] = {
          original: original,
          term: valid ? term : original,
          valid: valid,
          checked: true,
          phonetic: String(item.phonetic || "").trim().slice(0, 48),
          pos: String(item.pos || "").trim().slice(0, 12),
          zh: String(item.zh || "").trim().slice(0, 120),
          exampleEn: String(item.exampleEn || "").trim().slice(0, 300),
          exampleZh: String(item.exampleZh || "").trim().slice(0, 200)
        };
      });
      return list.map(function (t) {
        return byOriginal[t] || { original: t, term: t, valid: true, checked: false };
      });
    }).catch(function (err) {
      console.warn("拾词：AI 词条校对失败", err);
      return null;
    });
  }

  function testAI(ai) {
    if (!ai || !ai.apiKey) return Promise.reject(new Error("请先填写 API Key"));
    var base = String(ai.baseUrl || "https://api.deepseek.com").replace(/\/+$/, "");
    return fetchJSON(base + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ai.apiKey
      },
      body: JSON.stringify({
        model: ai.model || "deepseek-chat",
        temperature: 0,
        max_tokens: 20,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "只输出 JSON。" },
          { role: "user", content: "返回 {\"ok\":true}" }
        ]
      })
    }, 20000).then(function (res) {
      if (res && res.choices && res.choices[0]) return true;
      throw new Error("接口返回格式不正确");
    });
  }

  WB.api = {
    lookup: lookup,
    translateText: translateText,
    parseZhGroups: parseZhGroups,
    recognizeImage: recognizeImage,
    recognizeImageCloud: recognizeImageCloud,
    extractFromText: extractFromText,
    aiExtract: aiExtract,
    aiReviewWords: aiReviewWords,
    testAI: testAI,
    speak: speak,
    tts: tts,
    audioUrl: audioUrl,
    isValidToken: isValidToken,
    normalizeToken: normalizeToken,
    fetchJSON: fetchJSON
  };
})();
