// 测试数据示例
// 用于在没有真实云函数时测试UI

// 模拟语音识别结果
export const mockTranscript = {
  text: "你看看现在几点了？小杰又偷偷玩游戏到9点！你平时到底管不管孩子？我加班回来都9点了，哪有时间管？再说了，偶尔玩一次怎么了？偶尔？这周都三次了！你总是这样，孩子教育全是我的事！你当甩手掌柜当得很舒服啊！我一天到晚赚钱养家，回来还要听你数落？孩子玩游戏你直接没收不就行了？没收？前天我没收了，他还哭闹，你呢？你在旁边装聋作哑！你现在才回来，根本不知道情况就在这瞎指挥！好好好，都是我的错行了吧！我赚钱养家还有错了？那你在家带孩子多轻松啊！轻松？你试试一天到晚围着孩子转！每天辅导作业、接送、做饭，你根本不知道我有多累！行了行了，别吵了。明天我跟小杰谈谈，以后9点前必须做完作业才能玩半小时。这还差不多。但你得说到做到，别又忙忙忙的就把这事忘了。",
  sentences: [
    { text: "你看看现在几点了？小杰又偷偷玩游戏到9点！你平时到底管不管孩子？", speaker: "妻子", startTime: 0, endTime: 5 },
    { text: "我加班回来都9点了，哪有时间管？再说了，偶尔玩一次怎么了？", speaker: "丈夫", startTime: 5, endTime: 10 },
    { text: "偶尔？这周都三次了！你总是这样，孩子教育全是我的事！你当甩手掌柜当得很舒服啊！", speaker: "妻子", startTime: 10, endTime: 18 },
    { text: "我一天到晚赚钱养家，回来还要听你数落？孩子玩游戏你直接没收不就行了？", speaker: "丈夫", startTime: 18, endTime: 25 },
    { text: "没收？前天我没收了，他还哭闹，你呢？你在旁边装聋作哑！你现在才回来，根本不知道情况就在这瞎指挥！", speaker: "妻子", startTime: 25, endTime: 35 },
    { text: "好好好，都是我的错行了吧！我赚钱养家还有错了？那你在家带孩子多轻松啊！", speaker: "丈夫", startTime: 35, endTime: 42 },
    { text: "轻松？你试试一天到晚围着孩子转！每天辅导作业、接送、做饭，你根本不知道我有多累！", speaker: "妻子", startTime: 42, endTime: 52 },
    { text: "行了行了，别吵了。明天我跟小杰谈谈，以后9点前必须做完作业才能玩半小时。", speaker: "丈夫", startTime: 52, endTime: 58 },
    { text: "这还差不多。但你得说到做到，别又忙忙忙的就把这事忘了。", speaker: "妻子", startTime: 58, endTime: 63 },
  ],
};

// 模拟AI分析结果
export const mockAnalysis = {
  emotionCurve: [
    { time: "00:05", speaker: "妻子", text: "你看看现在几点了？", emotion: "愤怒", intensity: 8 },
    { time: "00:10", speaker: "丈夫", text: "我加班回来都9点了", emotion: "疲惫", intensity: 5 },
    { time: "00:15", speaker: "妻子", text: "这周都三次了！", emotion: "愤怒", intensity: 9 },
    { time: "00:20", speaker: "丈夫", text: "赚钱养家还要听你数落", emotion: "不满", intensity: 6 },
    { time: "00:30", speaker: "妻子", text: "你在旁边装聋作哑！", emotion: "愤怒", intensity: 10 },
    { time: "00:38", speaker: "丈夫", text: "都是我的错行了吧！", emotion: "愤怒", intensity: 8 },
    { time: "00:45", speaker: "妻子", text: "你根本不知道我有多累！", emotion: "愤怒", intensity: 10 },
    { time: "00:55", speaker: "丈夫", text: "别吵了。明天我跟小杰谈谈", emotion: "冷静", intensity: 3 },
    { time: "01:00", speaker: "妻子", text: "这还差不多", emotion: "平静", intensity: 2 },
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
    wifeStyle: "情绪主导型 - 先表达感受，再讲问题",
    husbandStyle: "回避防御型 - 回避冲突，自我保护",
    problem: "双方都在表达，但缺少倾听和共情",
  },
  keywords: [
    { word: "孩子", count: 5, sentiment: "中性" },
    { word: "累", count: 3, sentiment: "负面" },
    { word: "钱", count: 2, sentiment: "中性" },
    { word: "忙", count: 2, sentiment: "负面" },
    { word: "家", count: 4, sentiment: "正面" },
    { word: "玩", count: 3, sentiment: "中性" },
    { word: "作业", count: 2, sentiment: "中性" },
  ],
  reasonCategory: {
    category: "孩子教育",
    description: "围绕孩子的教育方式、陪伴时间和责任分配产生分歧",
  },
  duration: {
    total: "03:00",
    effective: "02:30",
  },
};

// 模拟完整的吵架记录
export const mockRecord = {
  id: "20250116-001",
  date: "2025-01-16 22:00",
  audioFile: "吵架_孩子教育.mp3",
  transcript: mockTranscript,
  analysis: mockAnalysis,
  reasonCategory: "孩子教育",
  duration: "03:00",
  resolved: false,
  createTime: 1705430400000,
};

// 模拟记录列表
export const mockRecords = [
  mockRecord,
  {
    id: "20250115-001",
    date: "2025-01-15 20:30",
    audioFile: "吵架_家务分配.mp3",
    transcript: mockTranscript,
    analysis: {
      ...mockAnalysis,
      reasonCategory: {
        category: "家务分配",
        description: "家务劳动分配不均，双方都觉得自己付出更多",
      },
    },
    reasonCategory: "家务分配",
    duration: "02:15",
    resolved: true,
    createTime: 1705338600000,
  },
];

/**
 * 生成随机测试数据
 */
export function generateRandomRecord() {
  const categories = ["家务分配", "孩子教育", "金钱管理", "沟通方式", "其他"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  return {
    id: `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 2400)).padStart(4, '0')}`,
    date: new Date().toLocaleString('zh-CN'),
    audioFile: `吵架_${randomCategory}.mp3`,
    transcript: mockTranscript,
    analysis: {
      ...mockAnalysis,
      reasonCategory: {
        category: randomCategory,
        description: `关于${randomCategory}的争吵`,
      },
    },
    reasonCategory: randomCategory,
    duration: `${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    resolved: Math.random() > 0.5,
    createTime: Date.now(),
  };
}

/**
 * 初始化本地存储（用于开发测试）
 */
export function initMockData() {
  const records = mockRecords;
  wx.setStorageSync('quarrel_records', records);

  const settings = {
    storageLocation: 'local',
    notificationTime: 'after1hour',
  };
  wx.setStorageSync('quarrel_settings', settings);

  console.log('Mock data initialized:', records);
}
