/* 拾词 · 本地种子词库与常量
   纯静态，无构建依赖。所有词条均可被在线查词结果补充。 */
(function () {
  "use strict";

  window.WB = window.WB || {};

  WB.INTERVALS = [
    { ms: 5 * 60 * 1000, label: "5 分钟" },
    { ms: 30 * 60 * 1000, label: "30 分钟" },
    { ms: 12 * 60 * 60 * 1000, label: "12 小时" },
    { ms: 24 * 60 * 60 * 1000, label: "1 天" },
    { ms: 2 * 24 * 60 * 60 * 1000, label: "2 天" },
    { ms: 4 * 24 * 60 * 60 * 1000, label: "4 天" },
    { ms: 7 * 24 * 60 * 60 * 1000, label: "7 天" },
    { ms: 15 * 24 * 60 * 60 * 1000, label: "15 天" },
    { ms: 30 * 24 * 60 * 60 * 1000, label: "30 天" }
  ];

  WB.DAILY_GOALS = [5, 10, 15, 20, 30];
  WB.LEVELS = { CET4: "四级", CET6: "六级", EXTRA: "拓展" };
  WB.POS_ZH = {
    n: "名词", v: "动词", adj: "形容词", adv: "副词",
    prep: "介词", conj: "连词", pron: "代词", num: "数词"
  };

  WB.STOPWORDS = new Set(("a an the and or but nor so yet for of to in on at by with from into onto over under " +
    "about above below between among through during before after while as than then there here when where why how " +
    "is am are was were be been being do does did doing have has had having will would shall should can could may " +
    "might must not no yes this that these those it its it's they them their we us our you your he him his she her " +
    "i me my mine who whom whose which what all any both each few more most other some such only own same too very " +
    "just also even still already again ever never often always sometimes usually really quite rather almost " +
    "if because although though unless until since whether however therefore moreover besides instead " +
    "up down out off away back one two three four five six seven eight nine ten first second next last " +
    "mr mrs ms dr st etc eg ie vs per via").split(/\s+/));

  WB.FALLBACK_MEANINGS = [
    { term: "maintain", pos: "v.", zh: "维持；维护" },
    { term: "decline", pos: "v.", zh: "下降；谢绝" },
    { term: "approach", pos: "n.", zh: "方法；途径" },
    { term: "sufficient", pos: "adj.", zh: "足够的" },
    { term: "reveal", pos: "v.", zh: "揭示；透露" },
    { term: "tolerate", pos: "v.", zh: "容忍" },
    { term: "strategy", pos: "n.", zh: "策略" },
    { term: "inevitable", pos: "adj.", zh: "不可避免的" },
    { term: "promote", pos: "v.", zh: "促进；晋升" },
    { term: "substitute", pos: "n.", zh: "替代品" },
    { term: "fundamental", pos: "adj.", zh: "根本的" },
    { term: "withdraw", pos: "v.", zh: "撤回；退出" }
  ];

  /* 48 个四六级核心词，含音标、释义、真题风格例句与词组 */
  const RAW = [
    {
      term: "norm", phonetic: "/nɔːrm/", level: "CET4", pos: "n.",
      zh: ["常态", "规范，准则", "平均水平"],
      en: "Public transportation isn't that great, so it's the norm to drive.",
      cn: "公共交通不是那么好，所以开车是常态。",
      phrases: [["become the norm", "成为常态"], ["a departure from the norm", "一反常态"], ["social norms", "社会准则"]]
    },
    {
      term: "conform", phonetic: "/kənˈfɔːrm/", level: "CET4", pos: "v.",
      zh: ["遵守", "与……一致", "顺从"],
      en: "Students are expected to conform to the school's dress code.",
      cn: "学生应当遵守学校的着装规定。",
      phrases: [["conform to", "遵守；符合"], ["conform with", "与……一致"]]
    },
    {
      term: "departure", phonetic: "/dɪˈpɑːrtʃər/", level: "CET4", pos: "n.",
      zh: ["离开", "背离", "启程"],
      en: "His sudden departure surprised everyone in the room.",
      cn: "他的突然离开让房间里的每个人都感到意外。",
      phrases: [["a departure from", "对……的背离"], ["departure lounge", "候机室"]]
    },
    {
      term: "criterion", phonetic: "/kraɪˈtɪriən/", level: "CET4", pos: "n.",
      zh: ["标准", "准则", "尺度"],
      en: "Price is not the only criterion for choosing a laptop.",
      cn: "价格不是选购笔记本电脑的唯一标准。",
      phrases: [["meet the criteria", "符合标准"], ["selection criteria", "选拔标准"]]
    },
    {
      term: "consensus", phonetic: "/kənˈsensəs/", level: "CET6", pos: "n.",
      zh: ["共识", "一致意见"],
      en: "The committee finally reached a consensus on the budget.",
      cn: "委员会最终就预算达成了共识。",
      phrases: [["reach a consensus", "达成共识"], ["broad consensus", "广泛共识"]]
    },
    {
      term: "bias", phonetic: "/ˈbaɪəs/", level: "CET6", pos: "n.",
      zh: ["偏见", "偏向", "偏心"],
      en: "The report was criticized for its obvious bias.",
      cn: "这份报告因明显的偏见而受到批评。",
      phrases: [["bias against", "对……的偏见"], ["confirmation bias", "确认偏误"]]
    },
    {
      term: "perceive", phonetic: "/pərˈsiːv/", level: "CET4", pos: "v.",
      zh: ["察觉", "理解", "看待"],
      en: "Many people perceive silence as a sign of disagreement.",
      cn: "许多人把沉默理解为不赞同的信号。",
      phrases: [["perceive ... as", "把……视为"], ["perceive a change", "察觉到变化"]]
    },
    {
      term: "attribute", phonetic: "/əˈtrɪbjuːt/", level: "CET4", pos: "v.",
      zh: ["把……归因于", "归功于"],
      en: "She attributes her success to consistent practice.",
      cn: "她把自己的成功归因于持续的练习。",
      phrases: [["attribute A to B", "把 A 归因于 B"], ["a key attribute", "一个关键属性"]]
    },
    {
      term: "assess", phonetic: "/əˈses/", level: "CET4", pos: "v.",
      zh: ["评估", "评定", "估价"],
      en: "It is difficult to assess the damage without more evidence.",
      cn: "没有更多证据，很难评估损失。",
      phrases: [["assess the impact", "评估影响"], ["assess risk", "评估风险"]]
    },
    {
      term: "advocate", phonetic: "/ˈædvəkeɪt/", level: "CET6", pos: "v.",
      zh: ["提倡", "主张", "拥护"],
      en: "Several experts advocate a shorter working week.",
      cn: "几位专家提倡缩短每周工作时间。",
      phrases: [["advocate for", "为……发声"], ["a strong advocate", "坚定的拥护者"]]
    },
    {
      term: "ambiguous", phonetic: "/æmˈbɪɡjuəs/", level: "CET6", pos: "adj.",
      zh: ["模棱两可的", "含糊不清的"],
      en: "The wording of the agreement is deliberately ambiguous.",
      cn: "协议的措辞故意含糊其辞。",
      phrases: [["an ambiguous answer", "模棱两可的回答"], ["remain ambiguous", "仍然不明确"]]
    },
    {
      term: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", level: "CET4", pos: "v.",
      zh: ["预料", "期待", "预先考虑"],
      en: "We anticipate that demand will rise sharply next year.",
      cn: "我们预计明年需求会大幅上升。",
      phrases: [["anticipate changes", "预见变化"], ["as anticipated", "正如预期"]]
    },
    {
      term: "arbitrary", phonetic: "/ˈɑːrbɪtreri/", level: "CET6", pos: "adj.",
      zh: ["任意的", "武断的", "专断的"],
      en: "The decision seemed arbitrary and unfair to many employees.",
      cn: "在许多员工看来，这个决定显得武断而不公平。",
      phrases: [["an arbitrary rule", "武断的规定"], ["arbitrary power", "专断权力"]]
    },
    {
      term: "coherent", phonetic: "/koʊˈhɪrənt/", level: "CET6", pos: "adj.",
      zh: ["连贯的", "条理清楚的", "一致的"],
      en: "A good essay needs a coherent argument from beginning to end.",
      cn: "一篇好文章需要从头到尾连贯的论证。",
      phrases: [["a coherent story", "连贯的故事"], ["coherent policy", "一致的政策"]]
    },
    {
      term: "compensate", phonetic: "/ˈkɑːmpenseɪt/", level: "CET4", pos: "v.",
      zh: ["补偿", "弥补", "赔偿"],
      en: "Nothing can compensate for the loss of trust.",
      cn: "没有什么能弥补信任的丧失。",
      phrases: [["compensate for", "弥补"], ["compensate employees", "补偿员工"]]
    },
    {
      term: "comprehensive", phonetic: "/ˌkɑːmprɪˈhensɪv/", level: "CET4", pos: "adj.",
      zh: ["全面的", "综合的", "详尽的"],
      en: "The course offers a comprehensive introduction to economics.",
      cn: "这门课程提供经济学的全面入门。",
      phrases: [["a comprehensive review", "全面审查"], ["comprehensive coverage", "全面覆盖"]]
    },
    {
      term: "compromise", phonetic: "/ˈkɑːmprəmaɪz/", level: "CET4", pos: "n.",
      zh: ["妥协", "折中", "让步"],
      en: "Both sides agreed to a compromise after hours of talks.",
      cn: "经过数小时谈判，双方同意折中。",
      phrases: [["reach a compromise", "达成妥协"], ["compromise on", "在……上让步"]]
    },
    {
      term: "condemn", phonetic: "/kənˈdem/", level: "CET6", pos: "v.",
      zh: ["谴责", "判刑", "宣告有罪"],
      en: "The government condemned the attack as an act of violence.",
      cn: "政府谴责这次袭击是暴力行为。",
      phrases: [["condemn ... as", "谴责……为"], ["condemn to", "判处"]]
    },
    {
      term: "constitute", phonetic: "/ˈkɑːnstɪtuːt/", level: "CET6", pos: "v.",
      zh: ["构成", "组成", "被视为"],
      en: "Women constitute nearly half of the workforce.",
      cn: "女性占劳动力的近一半。",
      phrases: [["constitute a threat", "构成威胁"], ["constitute a majority", "构成多数"]]
    },
    {
      term: "contradict", phonetic: "/ˌkɑːntrəˈdɪkt/", level: "CET4", pos: "v.",
      zh: ["反驳", "与……矛盾", "否认"],
      en: "The latest figures contradict the earlier report.",
      cn: "最新数据与早先的报告相矛盾。",
      phrases: [["contradict oneself", "自相矛盾"], ["contradict a claim", "反驳某种说法"]]
    },
    {
      term: "controversial", phonetic: "/ˌkɑːntrəˈvɜːrʃl/", level: "CET4", pos: "adj.",
      zh: ["有争议的", "引起争论的"],
      en: "The new policy remains highly controversial among voters.",
      cn: "新政策在选民中仍然极具争议。",
      phrases: [["a controversial issue", "争议话题"], ["highly controversial", "极具争议"]]
    },
    {
      term: "convert", phonetic: "/kənˈvɜːrt/", level: "CET4", pos: "v.",
      zh: ["转换", "改变", "改造"],
      en: "The old factory was converted into a museum.",
      cn: "旧工厂被改造成了博物馆。",
      phrases: [["convert A into B", "把 A 改造成 B"], ["convert to", "转而信奉"]]
    },
    {
      term: "cope", phonetic: "/koʊp/", level: "CET4", pos: "v.",
      zh: ["应对", "处理", "对付"],
      en: "Small businesses are struggling to cope with rising costs.",
      cn: "小企业正艰难应对不断上涨的成本。",
      phrases: [["cope with", "应对"], ["cope under pressure", "在压力下应对"]]
    },
    {
      term: "crucial", phonetic: "/ˈkruːʃl/", level: "CET4", pos: "adj.",
      zh: ["至关重要的", "关键的"],
      en: "Early diagnosis is crucial for successful treatment.",
      cn: "早期诊断对成功治疗至关重要。",
      phrases: [["play a crucial role", "起关键作用"], ["crucial moment", "关键时刻"]]
    },
    {
      term: "decline", phonetic: "/dɪˈklaɪn/", level: "CET4", pos: "v.",
      zh: ["下降", "拒绝", "衰退"],
      en: "The number of readers has declined steadily over the past decade.",
      cn: "过去十年，读者数量持续下降。",
      phrases: [["decline an invitation", "谢绝邀请"], ["a sharp decline", "急剧下降"]]
    },
    {
      term: "dedicate", phonetic: "/ˈdedɪkeɪt/", level: "CET6", pos: "v.",
      zh: ["致力于", "献给", "投入"],
      en: "She dedicated her career to protecting wild animals.",
      cn: "她把职业生涯献给了保护野生动物。",
      phrases: [["dedicate oneself to", "致力于"], ["be dedicated to", "专注于"]]
    },
    {
      term: "deliberate", phonetic: "/dɪˈlɪbərət/", level: "CET6", pos: "adj.",
      zh: ["故意的", "深思熟虑的", "从容的"],
      en: "The mistake was too obvious to be deliberate.",
      cn: "这个错误太明显，不可能是故意的。",
      phrases: [["a deliberate attempt", "蓄意尝试"], ["deliberate choice", "深思熟虑的选择"]]
    },
    {
      term: "derive", phonetic: "/dɪˈraɪv/", level: "CET4", pos: "v.",
      zh: ["获得", "源自", "推导"],
      en: "Many English words derive from Latin.",
      cn: "许多英语单词源自拉丁语。",
      phrases: [["derive from", "源自"], ["derive pleasure from", "从……中获得乐趣"]]
    },
    {
      term: "diminish", phonetic: "/dɪˈmɪnɪʃ/", level: "CET6", pos: "v.",
      zh: ["减少", "削弱", "贬低"],
      en: "The pain gradually diminished over the next few days.",
      cn: "接下来几天，疼痛逐渐减轻。",
      phrases: [["diminish the risk", "降低风险"], ["diminish in value", "贬值"]]
    },
    {
      term: "discriminate", phonetic: "/dɪˈskrɪmɪneɪt/", level: "CET6", pos: "v.",
      zh: ["歧视", "区分", "辨别"],
      en: "It is illegal to discriminate against applicants because of age.",
      cn: "因年龄歧视申请人是违法的。",
      phrases: [["discriminate against", "歧视"], ["discriminate between", "区分"]]
    },
    {
      term: "dismiss", phonetic: "/dɪsˈmɪs/", level: "CET4", pos: "v.",
      zh: ["不予考虑", "解雇", "驳回"],
      en: "He dismissed the idea as unrealistic.",
      cn: "他认为这个想法不切实际而予以否定。",
      phrases: [["dismiss the possibility", "排除可能性"], ["dismiss an employee", "解雇员工"]]
    },
    {
      term: "dispose", phonetic: "/dɪˈspoʊz/", level: "CET6", pos: "v.",
      zh: ["处理", "丢弃", "安排"],
      en: "Please dispose of the packaging responsibly.",
      cn: "请负责任地处理包装。",
      phrases: [["dispose of", "处理掉"], ["be disposed to", "倾向于"]]
    },
    {
      term: "distinguish", phonetic: "/dɪˈstɪŋɡwɪʃ/", level: "CET4", pos: "v.",
      zh: ["区分", "辨别", "使出众"],
      en: "It is hard to distinguish between the two versions.",
      cn: "很难区分这两个版本。",
      phrases: [["distinguish A from B", "区分 A 和 B"], ["distinguish oneself", "使自己出众"]]
    },
    {
      term: "distort", phonetic: "/dɪˈstɔːrt/", level: "CET6", pos: "v.",
      zh: ["歪曲", "扭曲", "使变形"],
      en: "The media should not distort the facts to attract attention.",
      cn: "媒体不应为了吸引注意力而歪曲事实。",
      phrases: [["distort the truth", "歪曲真相"], ["distorted image", "失真的图像"]]
    },
    {
      term: "diverse", phonetic: "/daɪˈvɜːrs/", level: "CET4", pos: "adj.",
      zh: ["多样的", "不同的", "多元的"],
      en: "The city is home to a diverse population.",
      cn: "这座城市拥有多元化的人口。",
      phrases: [["diverse culture", "多元文化"], ["a diverse range of", "各种各样的"]]
    },
    {
      term: "dominate", phonetic: "/ˈdɑːmɪneɪt/", level: "CET4", pos: "v.",
      zh: ["支配", "主导", "占优势"],
      en: "A few large firms dominate the market.",
      cn: "少数大公司主导着市场。",
      phrases: [["dominate the conversation", "主导谈话"], ["dominate the market", "主导市场"]]
    },
    {
      term: "elaborate", phonetic: "/ɪˈlæbərət/", level: "CET6", pos: "adj.",
      zh: ["精心制作的", "复杂的", "详尽的"],
      en: "She gave an elaborate explanation of the whole process.",
      cn: "她对这个流程作了详尽的解释。",
      phrases: [["elaborate on", "详细说明"], ["an elaborate design", "精巧的设计"]]
    },
    {
      term: "eliminate", phonetic: "/ɪˈlɪmɪneɪt/", level: "CET4", pos: "v.",
      zh: ["消除", "淘汰", "排除"],
      en: "The new system eliminates the need for paper forms.",
      cn: "新系统消除了对纸质表格的需求。",
      phrases: [["eliminate waste", "消除浪费"], ["be eliminated from", "被淘汰出"]]
    },
    {
      term: "emerge", phonetic: "/ɪˈmɜːrdʒ/", level: "CET4", pos: "v.",
      zh: ["出现", "显露", "摆脱"],
      en: "New evidence has emerged in the case.",
      cn: "案件中出现了新证据。",
      phrases: [["emerge from", "从……中出现"], ["emerge as", "成为"]]
    },
    {
      term: "empirical", phonetic: "/ɪmˈpɪrɪkl/", level: "CET6", pos: "adj.",
      zh: ["实证的", "经验的", "以观察为依据的"],
      en: "The theory is supported by empirical evidence.",
      cn: "该理论得到了实证证据的支持。",
      phrases: [["empirical research", "实证研究"], ["empirical evidence", "实证证据"]]
    },
    {
      term: "encounter", phonetic: "/ɪnˈkaʊntər/", level: "CET4", pos: "v.",
      zh: ["遭遇", "偶遇", "面临"],
      en: "We encountered several problems during the trial.",
      cn: "我们在试验中遇到了几个问题。",
      phrases: [["encounter difficulties", "遇到困难"], ["a chance encounter", "偶然相遇"]]
    },
    {
      term: "enhance", phonetic: "/ɪnˈhæns/", level: "CET4", pos: "v.",
      zh: ["增强", "提高", "改善"],
      en: "The update is designed to enhance user experience.",
      cn: "这次更新旨在提升用户体验。",
      phrases: [["enhance efficiency", "提高效率"], ["enhance the reputation", "提升声誉"]]
    },
    {
      term: "equivalent", phonetic: "/ɪˈkwɪvələnt/", level: "CET6", pos: "adj.",
      zh: ["等同的", "相当的", "等价物"],
      en: "One mile is roughly equivalent to 1.6 kilometers.",
      cn: "一英里大约相当于 1.6 公里。",
      phrases: [["be equivalent to", "等同于"], ["the equivalent of", "相当于"]]
    },
    {
      term: "erode", phonetic: "/ɪˈroʊd/", level: "CET6", pos: "v.",
      zh: ["侵蚀", "削弱", "逐渐破坏"],
      en: "Repeated delays have eroded public confidence.",
      cn: "一再拖延削弱了公众信心。",
      phrases: [["erode trust", "侵蚀信任"], ["erode confidence", "削弱信心"]]
    },
    {
      term: "evaluate", phonetic: "/ɪˈvæljueɪt/", level: "CET4", pos: "v.",
      zh: ["评价", "评估", "估值"],
      en: "We need to evaluate the results before making a decision.",
      cn: "我们需要在作出决定前评估结果。",
      phrases: [["evaluate performance", "评估表现"], ["evaluate the options", "评估各种选择"]]
    },
    {
      term: "evident", phonetic: "/ˈevɪdənt/", level: "CET4", pos: "adj.",
      zh: ["明显的", "显而易见的"],
      en: "It was evident that she had prepared carefully.",
      cn: "很明显，她做了充分准备。",
      phrases: [["it is evident that", "显然"], ["become evident", "变得明显"]]
    },
    {
      term: "evolve", phonetic: "/ɪˈvɑːlv/", level: "CET4", pos: "v.",
      zh: ["演变", "发展", "进化"],
      en: "The idea evolved into a full research project.",
      cn: "这个想法发展成了一个完整的研究项目。",
      phrases: [["evolve into", "演变成"], ["gradually evolve", "逐渐演变"]]
    },
    {
      term: "exaggerate", phonetic: "/ɪɡˈzædʒəreɪt/", level: "CET4", pos: "v.",
      zh: ["夸大", "夸张", "言过其实"],
      en: "The report exaggerates the risks involved.",
      cn: "报告夸大了其中的风险。",
      phrases: [["exaggerate the importance", "夸大重要性"], ["grossly exaggerate", "严重夸大"]]
    }
  ];

  const now = Date.now();

  WB.SEED_WORDS = RAW.map(function (item, index) {
    return {
      id: "seed-" + item.term.toLowerCase(),
      term: item.term,
      phonetic: item.phonetic,
      audio: "",
      level: item.level,
      pos: item.pos,
      meanings: [{ pos: item.pos, zh: item.zh.slice() }],
      defs: [],
      example: { en: item.en, zh: item.cn },
      phrases: (item.phrases || []).map(function (p) {
        return { en: p[0], zh: p[1] };
      }),
      tags: ["四六级核心"],
      source: "seed",
      needsMeaning: false,
      createdAt: now - (RAW.length - index + 2) * 36e5,
      updatedAt: now - (RAW.length - index + 2) * 36e5
    };
  });
})();
