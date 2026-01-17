// 测试数据 - 用于演示页面效果
const mockRecords = [
  {
    id: "20250117-001",
    date: "2025-01-17 20:30",
    audioFile: "吵架_孩子教育.mp3",
    transcript: {
      text: "关于孩子教育问题的争吵...",
      sentences: []
    },
    analysis: {
      emotionCurve: [
        { time: "00:15", speaker: "妻子", text: "你看看现在几点了？", emotion: "愤怒", intensity: 8 },
        { time: "00:20", speaker: "丈夫", text: "我加班回来都9点了", emotion: "疲惫", intensity: 5 },
        { time: "00:30", speaker: "妻子", text: "这周都三次了！", emotion: "愤怒", intensity: 9 },
      ],
      triggerPoint: {
        text: "你看看现在几点了？小杰又偷偷玩游戏到9点！",
        time: "00:15",
        type: "累积爆发",
      },
      needsAnalysis: {
        wife: {
          surface: "抱怨丈夫不管孩子教育",
          deep: "希望被认可、分担压力、感到孤立无援",
        },
        husband: {
          surface: "辩解工作忙、赚钱辛苦",
          deep: "希望付出被理解、得到认可",
        },
      },
      communicationPattern: {
        wifeStyle: "情绪主导型",
        husbandStyle: "回避防御型",
        problem: "双方都在表达，但缺少倾听",
      },
      keywords: [
        { word: "孩子", count: 5, sentiment: "中性" },
        { word: "累", count: 3, sentiment: "负面" },
      ],
      reasonCategory: {
        category: "孩子教育",
        description: "围绕孩子的教育方式产生分歧",
      },
      duration: {
        total: "03:00",
        effective: "02:30",
      },
    },
    reasonCategory: "孩子教育",
    duration: "03:00",
    resolved: false,
    createTime: Date.now(),
  },
  {
    id: "20250116-001",
    date: "2025-01-16 22:00",
    audioFile: "吵架_家务分配.mp3",
    transcript: {
      text: "关于家务分配的争吵...",
      sentences: []
    },
    analysis: {
      emotionCurve: [
        { time: "00:10", speaker: "妻子", text: "家务都是我做的", emotion: "愤怒", intensity: 7 },
        { time: "00:15", speaker: "丈夫", text: "我赚钱养家也很累", emotion: "不满", intensity: 6 },
      ],
      triggerPoint: {
        text: "你回来就只知道玩手机",
        time: "00:10",
        type: "累积爆发",
      },
      needsAnalysis: {
        wife: {
          surface: "抱怨家务分配不均",
          deep: "希望分担家务、被认可付出",
        },
        husband: {
          surface: "强调赚钱养家",
          deep: "希望工作被理解",
        },
      },
      communicationPattern: {
        wifeStyle: "情绪主导型",
        husbandStyle: "回避防御型",
        problem: "缺少有效沟通",
      },
      keywords: [
        { word: "家务", count: 4, sentiment: "中性" },
        { word: "累", count: 2, sentiment: "负面" },
      ],
      reasonCategory: {
        category: "家务分配",
        description: "家务劳动分配不均",
      },
      duration: {
        total: "02:15",
        effective: "02:00",
      },
    },
    reasonCategory: "家务分配",
    duration: "02:15",
    resolved: true,
    createTime: Date.now() - 86400000,
  },
];

/**
 * 初始化测试数据到本地存储
 */
function initMockData() {
  wx.setStorageSync('quarrel_records', mockRecords);
  console.log('测试数据已初始化，共', mockRecords.length, '条记录');
}

module.exports = {
  mockRecords,
  initMockData,
};
