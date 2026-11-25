/* 从手写单词表整理出的基本词库（152 个），追加到内置种子词之后。 */
(function () {
  var MY_WORDS = [
  {
    "term": "exert",
    "phonetic": "/ɪɡˈzɜːt/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "运用",
      "施加"
    ],
    "en": "I exerted myself in today's training.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "muscle",
    "phonetic": "/ˈmʌs.əl/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "肌肉",
      "力量"
    ],
    "en": "Muscle consists largely of actin and myosin filaments.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "proud",
    "phonetic": "/pɹaʊd/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "骄傲的",
      "自豪的"
    ],
    "en": "I am proud of Sivu’s schoolwork.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "enforce",
    "phonetic": "/ɪnˈfɔːs/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "执行",
      "强制实施"
    ],
    "en": "The police are there to enforce the law.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "obscene",
    "phonetic": "/əbˈsiːn/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "淫秽的",
      "道德败坏的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "alleviate",
    "phonetic": "/əˈli.vi.eɪt/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "减轻",
      "缓解"
    ],
    "en": "Alcohol is often a cheap tool to alleviate the stress of a hard day.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "explicit",
    "phonetic": "/ɪkˈsplɪsɪt/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "明确的",
      "清楚的"
    ],
    "en": "I gave explicit instructions for him to stay here, but he followed me, anyway.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "strive",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "努力",
      "奋斗"
    ],
    "en": "",
    "cn": "",
    "phrases": [
      [
        "strive to",
        "努力做某事"
      ],
      [
        "strive for",
        "争取"
      ]
    ]
  },
  {
    "term": "excessive",
    "phonetic": "/ɪkˈsɛsɪv/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "过度的",
      "过多的"
    ],
    "en": "Putting a wide vibrato on a single 16th triplet note at 160 beats per minute seems rather excessive.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "alert",
    "phonetic": "/əˈlɜːt/",
    "level": "CET4",
    "pos": "adj./v.",
    "zh": [
      "警觉的",
      "意识到",
      "提醒"
    ],
    "en": "an airborne alert; ground alert",
    "cn": "",
    "phrases": []
  },
  {
    "term": "deep-seated",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "根深蒂固的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "instinctive",
    "phonetic": "/ɪnˈstɪŋktɪv/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "本能的",
      "直觉的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "spontaneous",
    "phonetic": "/spɒnˈteɪ.ni.əs/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "自发的",
      "自然的"
    ],
    "en": "He made a spontaneous offer of help.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "differ",
    "phonetic": "/ˈdɪfə/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "不同",
      "有差异"
    ],
    "en": "These shoes only differ from those ones in having slightly longer laces.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "substantially",
    "phonetic": "",
    "level": "CET4",
    "pos": "adv.",
    "zh": [
      "大量地",
      "实质上"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "respect",
    "phonetic": "/ɹɪˈspɛkt/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "尊敬",
      "尊重",
      "方面"
    ],
    "en": "He is an intellectual giant, and I have great respect for him.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "lawsuit",
    "phonetic": "/ˈlɔˌs(j)ut/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "诉讼",
      "官司"
    ],
    "en": "The lawyer advised his client against filing a lawsuit as it would take a lot of time and money to resolve.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "allege",
    "phonetic": "/əˈlɛdʒ/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "指控",
      "声称"
    ],
    "en": "The agency alleged my credit history had problems.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "infringe",
    "phonetic": "/ɪnˈfɹɪndʒ/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "侵犯",
      "违反"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "compensation",
    "phonetic": "/ˌkɒmpɛnˈseɪʃən/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "补偿",
      "报酬"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "consent",
    "phonetic": "/kənˈsɛnt/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "同意",
      "准许"
    ],
    "en": "After reflecting a little bit, I've consented.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "replace",
    "phonetic": "/ɹɪˈpleɪs/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "取代",
      "替换"
    ],
    "en": "When you've finished using the telephone, please replace the handset.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "intellectual property",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "知识产权"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "interpretation",
    "phonetic": "/ɪntəpɹəˈteɪʃən/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "解释",
      "口译"
    ],
    "en": "the interpretation of a dream, or of an enigma.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "clause",
    "phonetic": "/klɔːz/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "条款",
      "从句"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "programme",
    "phonetic": "/ˈpɹəʊɡɹæm/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "节目",
      "计划"
    ],
    "en": "He programmed the DVR to record his favorite show.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "alarmingly",
    "phonetic": "/ə.ˈlɑːm.ɪŋ.li/",
    "level": "CET6",
    "pos": "adv.",
    "zh": [
      "令人担忧地"
    ],
    "en": "He sneezed alarmingly.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "correlate",
    "phonetic": "/ˈkɒɹələt/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "相互关联",
      "使相关"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "extent",
    "phonetic": "/ɪksˈtɛnt/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "程度",
      "范围"
    ],
    "en": "The extent of his knowledge of the language is a few scattered words.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "regulation",
    "phonetic": "/ˌɹɛɡjʊˈleɪʃən/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "规则",
      "法规"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "inadequately",
    "phonetic": "",
    "level": "CET6",
    "pos": "adv.",
    "zh": [
      "不充分地",
      "不足地"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "pose",
    "phonetic": "/pəʊz/",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "造成",
      "引起",
      "姿势"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "undervalue",
    "phonetic": "/ˌʌndə(ɹ)ˈvælju/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "低估",
      "轻视"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "prompt",
    "phonetic": "/pɹɒmpt/",
    "level": "CET4",
    "pos": "v./adj.",
    "zh": [
      "促使",
      "迅速的"
    ],
    "en": "I filled in my name where the prompt appeared on the computer screen but my account wasn't recognized.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "optional",
    "phonetic": "",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "可选择的",
      "非必需的"
    ],
    "en": "On that beach clothing is entirely optional.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "consensus",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "共识",
      "一致意见"
    ],
    "en": "After years of debate over the best wine to serve at Thanksgiving, no real consensus has emerged.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "willpower",
    "phonetic": "/ˈwɪlˌpaʊɚ/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "意志力"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "equally",
    "phonetic": "/ˈiːkwəli/",
    "level": "CET4",
    "pos": "adv.",
    "zh": [
      "平等地",
      "同样地"
    ],
    "en": "All citizens are equally taxed.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "wisdom",
    "phonetic": "/ˈwɪzdəm/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "智慧",
      "明智"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "figure",
    "phonetic": "/ˈfɪɡjɚ/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "数字",
      "人物",
      "计算",
      "认为"
    ],
    "en": "a figure in bronze; a figure cut in marble",
    "cn": "",
    "phrases": []
  },
  {
    "term": "curb",
    "phonetic": "/kɜːb/",
    "level": "CET6",
    "pos": "v./n.",
    "zh": [
      "抑制",
      "路缘"
    ],
    "en": "\"Curb your dog.\"",
    "cn": "",
    "phrases": []
  },
  {
    "term": "aggravate",
    "phonetic": "/ˈæɡ.ɹə.veɪ̯t/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "使恶化",
      "加重"
    ],
    "en": "He aggravated the story.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "take a toll",
    "phonetic": "",
    "level": "CET6",
    "pos": "phrase",
    "zh": [
      "产生重大影响",
      "造成损失"
    ],
    "en": "",
    "cn": "",
    "phrases": [
      [
        "take a toll on",
        "对……造成损害"
      ]
    ]
  },
  {
    "term": "cease",
    "phonetic": "/siːs/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "停止",
      "结束"
    ],
    "en": "And with that, his twitching ceased.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "cause",
    "phonetic": "/kɔːz/",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "造成",
      "原因",
      "事业"
    ],
    "en": "They identified a burst pipe as the cause of the flooding.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "deplete",
    "phonetic": "/dɪˈpliːt/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "消耗",
      "耗尽"
    ],
    "en": "Certain medications can deplete vitamin D.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "restore",
    "phonetic": "/ɹɪˈstɔː/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "恢复",
      "修复"
    ],
    "en": "We backed up the data successfully, but the restore failed.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "akin",
    "phonetic": "/əˈkɪn/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "相似的",
      "类似的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "exhaust",
    "phonetic": "/ɪɡˈzɔːst/",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "耗尽",
      "使筋疲力尽",
      "废气"
    ],
    "en": "Moisture of the earth is exhausted by evaporation.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "figure out",
    "phonetic": "",
    "level": "CET6",
    "pos": "phrase",
    "zh": [
      "解决",
      "弄明白"
    ],
    "en": "As soon as I figure out what is wrong with my car, I will fix it.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "energy",
    "phonetic": "/ˈɛnəd͡ʒi/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "能量",
      "精力"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "city",
    "phonetic": "/sɪtɪ/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "城市"
    ],
    "en": "São Paulo is the largest city in South America.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "controversial",
    "phonetic": "/kɒn.tɹə.ˈvɜː.sjəl/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "引起争论的",
      "有争议的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "contentious",
    "phonetic": "/kənˈtɛn.ʃəs/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "有争议的",
      "好争论的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "immediate",
    "phonetic": "/ɪˈmiːdɪət/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "立刻的",
      "直接的"
    ],
    "en": "Computer users these days expect immediate results when they click on a link.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "disposal",
    "phonetic": "[dɪsˈpəʊzəɫ]",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "处理",
      "丢弃"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "industrialize",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "使工业化"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "promote",
    "phonetic": "/pɹəˈməʊt/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "促进",
      "晋升",
      "推广"
    ],
    "en": "He promoted his clerk to office manager.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "suspend",
    "phonetic": "/səˈspɛnd/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "暂停",
      "悬挂"
    ],
    "en": "The meeting was suspended for lunch.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "exclusive",
    "phonetic": "/ɪkˈsklu.sɪv/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "独有的",
      "排他的"
    ],
    "en": "The editor agreed to keep a lid on a potentially disastrous political scoop in exchange for an exclusive of a happier nature.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "attainable",
    "phonetic": "/əˈteɪnəb(ə)l/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "可达到的",
      "可获得的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "nuclear",
    "phonetic": "/ˈn(j)ukliɚ/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "核能的",
      "核心的"
    ],
    "en": "a nuclear reactor",
    "cn": "",
    "phrases": []
  },
  {
    "term": "market",
    "phonetic": "/ˈmɑːkɪt/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "市场",
      "营销"
    ],
    "en": "The privilege to hold a weekly market was invaluable for any feudal era burgh.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "sector",
    "phonetic": "/ˈsɛk.təɹ/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "部门",
      "行业"
    ],
    "en": "public sector;  private sector",
    "cn": "",
    "phrases": []
  },
  {
    "term": "emerge",
    "phonetic": "/iˈmɜːd͡ʒ/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "出现",
      "浮现"
    ],
    "en": "He emerged unscathed from the accident.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "conscious",
    "phonetic": "/ˈkɒn.ʃəs/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "意识到的",
      "自觉的"
    ],
    "en": "The noise woke me, but it was another few minutes before I was fully conscious.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "occupation",
    "phonetic": "/ɒkjəˈpeɪʃən/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "职业",
      "占据"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "render",
    "phonetic": "/ˈɹɛn.də/",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "给予",
      "使得",
      "渲染"
    ],
    "en": "A low-resolution render might look blocky.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "upward",
    "phonetic": "/ˈʌpwəd/",
    "level": "CET4",
    "pos": "adj./adv.",
    "zh": [
      "向上的",
      "向上"
    ],
    "en": "with upward eye; with upward course",
    "cn": "",
    "phrases": []
  },
  {
    "term": "mobility",
    "phonetic": "/mə(ʊ)ˈbɪlɪti/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "移动能力",
      "流动性"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "overtake",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "超过",
      "赶上"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "envy",
    "phonetic": "/ˈɛnvi/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "羡慕",
      "妒忌"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "reinterpret",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "重新解释",
      "重新解读"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "inequality",
    "phonetic": "/ˌɪnɪˈkwɒlɪti/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "不平等",
      "不均等"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "state",
    "phonetic": "/steɪt/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "状态",
      "说明",
      "陈述"
    ],
    "en": "He stated that he was willing to help.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "regard",
    "phonetic": "",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "认为",
      "看待",
      "尊重"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "theory",
    "phonetic": "/ˈθiːəɹi/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "理论",
      "学说"
    ],
    "en": "Knot theory classifies the mappings of a circle into 3-space.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "arouse",
    "phonetic": "/əˈɹaʊz/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "引起",
      "唤醒"
    ],
    "en": "I can't keep my eyes off the dancer; she arouses me greatly.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "imagine",
    "phonetic": "",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "想象",
      "设想"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "invent",
    "phonetic": "",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "发明",
      "编造"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "unfold",
    "phonetic": "/ʌnˈfəʊld/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "展开",
      "打开"
    ],
    "en": "to unfold a map; to unfold a tablecloth; she unpacks the new dress and unfolds it carefully",
    "cn": "",
    "phrases": []
  },
  {
    "term": "address",
    "phonetic": "/æˈdɹɛs/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "地址",
      "处理",
      "解决"
    ],
    "en": "He addressed some portions of his remarks to his supporters, some to his opponents.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "precedent",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "前例",
      "先例"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "penalty",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "惩罚",
      "处罚"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "worksite",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "工作场所",
      "工地"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "competent",
    "phonetic": "/ˈkɒmpətənt/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "有能力的",
      "胜任的"
    ],
    "en": "He is a competent skier and an expert snowboarder.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "intervention",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "干预",
      "介入"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "unforeseeable",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "不可预见的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "block",
    "phonetic": "/blɒk/",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "阻塞",
      "封锁",
      "街区"
    ],
    "en": "a block of ice",
    "cn": "",
    "phrases": []
  },
  {
    "term": "unfavorable",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "不顺利的",
      "不利的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "intervene",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "干预",
      "介入"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "properly",
    "phonetic": "",
    "level": "CET4",
    "pos": "adv.",
    "zh": [
      "正确地",
      "适当地"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "favorable",
    "phonetic": "",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "有利的",
      "顺利的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "blank",
    "phonetic": "/blæŋk/",
    "level": "CET4",
    "pos": "adj./n.",
    "zh": [
      "空白的",
      "空白"
    ],
    "en": "the double blank",
    "cn": "",
    "phrases": []
  },
  {
    "term": "split",
    "phonetic": "",
    "level": "CET4",
    "pos": "v./n.",
    "zh": [
      "分裂",
      "分离",
      "分摊"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "distinction",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "差别",
      "区别"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "universal",
    "phonetic": "/ˌjuːnɪˈvɜːsl̩/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "普遍的",
      "通用的"
    ],
    "en": "She achieved universal fame.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "meanwhile",
    "phonetic": "/ˈmiːnhwaɪl/",
    "level": "CET4",
    "pos": "adv.",
    "zh": [
      "与此同时",
      "期间"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "account",
    "phonetic": "/ə.ˈkaʊnt/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "账户",
      "解释",
      "占比"
    ],
    "en": "to keep one's account at the bank.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "combat",
    "phonetic": "",
    "level": "CET6",
    "pos": "n./v.",
    "zh": [
      "战斗",
      "对抗"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "implement",
    "phonetic": "/ˈɪmpləmənt/",
    "level": "CET6",
    "pos": "v./n.",
    "zh": [
      "实施",
      "执行",
      "工具"
    ],
    "en": "They carried an assortment of gardening implements in the truck.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "insight",
    "phonetic": "/ˈɪnsaɪt/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "洞察力",
      "理解"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "reform",
    "phonetic": "/ɹɪˈfɔːm/",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "改革",
      "革新"
    ],
    "en": "A major reform is needed to improve the efficiency in the factory.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "portray",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "描写",
      "描绘"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "irritation",
    "phonetic": "/ˌɪɹɪˈteɪʃən/",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "恼怒",
      "刺激"
    ],
    "en": "What irritation causes you to be so moody?",
    "cn": "",
    "phrases": []
  },
  {
    "term": "humor",
    "phonetic": "/hjuː.mə(ɹ)/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "幽默",
      "幽默感"
    ],
    "en": "She has a great sense of humour, and I always laugh a lot whenever we get together.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "put down",
    "phonetic": "",
    "level": "CET4",
    "pos": "phrase",
    "zh": [
      "放下",
      "记下",
      "贬低"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "rude",
    "phonetic": "",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "粗鲁的",
      "不礼貌的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "contemptible",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "令人轻视的",
      "可鄙的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "indeed",
    "phonetic": "",
    "level": "CET4",
    "pos": "adv.",
    "zh": [
      "确实",
      "的确"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "literally",
    "phonetic": "",
    "level": "CET6",
    "pos": "adv.",
    "zh": [
      "字面地",
      "确实地"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "serve",
    "phonetic": "",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "服务",
      "招待",
      "起……作用"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "underlie",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "构成……的基础",
      "位于……之下"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "hostility",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "敌意",
      "对抗"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "intention",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "目的",
      "意图"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "chief",
    "phonetic": "",
    "level": "CET4",
    "pos": "adj./n.",
    "zh": [
      "首要的",
      "首领"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "incapable",
    "phonetic": "/ɪnˈkeɪpəbl̩/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "无能力的",
      "不能胜任的"
    ],
    "en": "A pint glass is incapable of holding more than a pint of liquid.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "comment",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "评论",
      "意见"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "disguise",
    "phonetic": "/dɪsˈɡaɪz/",
    "level": "CET6",
    "pos": "v./n.",
    "zh": [
      "伪装",
      "掩饰"
    ],
    "en": "A cape and moustache completed his disguise.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "intend",
    "phonetic": "",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "打算",
      "意图"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "infant",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "婴儿",
      "幼儿"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "degree",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "学位",
      "程度",
      "度"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "category",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "种类",
      "类别"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "species",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "物种",
      "种类"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "conducive",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "有益的",
      "有助于……的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "immune",
    "phonetic": "/ɪˈmjuːn/",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "免疫的",
      "不受影响的"
    ],
    "en": "As a diplomat, you are immune from prosecution.",
    "cn": "",
    "phrases": []
  },
  {
    "term": "conduce",
    "phonetic": "",
    "level": "CET6",
    "pos": "v.",
    "zh": [
      "导致",
      "有助于"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "agriculture",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "农业"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "vulnerable",
    "phonetic": "",
    "level": "CET6",
    "pos": "adj.",
    "zh": [
      "脆弱的",
      "易受伤害的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "income",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "收入"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "crop",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "农作物",
      "种植"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "improve",
    "phonetic": "",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "改善",
      "提高"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "obvious",
    "phonetic": "/ˈɒ.vɪəs/",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "明显的",
      "显然的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "rival",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "对手",
      "竞争者",
      "与……竞争"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "campaign",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "运动",
      "战役",
      "参加运动"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "candidate",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "候选人",
      "考生"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "wage",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "工资",
      "进行"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "critic",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "批评家",
      "评论家"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "throughout",
    "phonetic": "",
    "level": "CET4",
    "pos": "prep./adv.",
    "zh": [
      "遍及",
      "贯穿",
      "自始至终"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "cult",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "狂热崇拜",
      "邪教"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "relentlessly",
    "phonetic": "/ɹɪˈlɛntləsli/",
    "level": "CET6",
    "pos": "adv.",
    "zh": [
      "不停地",
      "无情地"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "formula",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "公式",
      "方案"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "labor",
    "phonetic": "",
    "level": "CET4",
    "pos": "n./v.",
    "zh": [
      "劳动",
      "劳动力"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "outdated",
    "phonetic": "",
    "level": "CET4",
    "pos": "adj.",
    "zh": [
      "过时的"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "consumption",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "消耗",
      "消费"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "rationality",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "合理性",
      "理性"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "sensation",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "感觉",
      "轰动"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "journal",
    "phonetic": "",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "期刊",
      "日志"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "expertise",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "专门技术",
      "专长"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "integrity",
    "phonetic": "",
    "level": "CET6",
    "pos": "n.",
    "zh": [
      "正直",
      "完整性"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "salary",
    "phonetic": "/ˈsælɚi/",
    "level": "CET4",
    "pos": "n.",
    "zh": [
      "薪水"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  },
  {
    "term": "appoint",
    "phonetic": "/əˈpɔɪnt/",
    "level": "CET4",
    "pos": "v.",
    "zh": [
      "任命",
      "约定"
    ],
    "en": "",
    "cn": "",
    "phrases": []
  }
];
  if (!window.WB) return;
  WB.MY_WORDS = MY_WORDS;
  if (!Array.isArray(WB.SEED_WORDS)) return;
  var seen = {};
  WB.SEED_WORDS.forEach(function (w) { seen[String(w.term).toLowerCase()] = true; });
  MY_WORDS.forEach(function (w) {
    var key = String(w.term).toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    WB.SEED_WORDS.push(w);
  });
})();
