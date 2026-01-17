// app.js
App({
  onLaunch() {
    console.log('小程序启动');

    // 检查本地存储，初始化数据
    this.initLocalData();

    // 初始化云开发环境（如果配置了）
    if (wx.cloud) {
      try {
        wx.cloud.init({
          // env: 'your-env-id', // TODO: 替换为你的云开发环境ID
          traceUser: true,
        });
        console.log('云开发初始化成功');
      } catch (e) {
        console.warn('云开发初始化失败，使用本地模式', e);
      }
    } else {
      console.warn('当前基础库版本不支持云开发');
    }
  },

  /**
   * 初始化本地数据
   */
  initLocalData() {
    const records = wx.getStorageSync('quarrel_records');
    if (!records) {
      // 如果没有记录，初始化测试数据
      const mockRecords = [
        {
          id: "20250117-001",
          date: "2025-01-17 20:30",
          audioFile: "吵架_孩子教育.mp3",
          reasonCategory: "孩子教育",
          duration: "03:00",
          resolved: false,
          wifeMaxIntensity: 9,
          husbandMaxIntensity: 6,
          analysis: {
            emotionCurve: [],
            triggerPoint: { text: "你看看现在几点了？", time: "00:15", type: "累积爆发" },
            needsAnalysis: {
              wife: { surface: "抱怨丈夫不管孩子", deep: "希望分担压力" },
              husband: { surface: "辩解工作忙", deep: "希望被理解" }
            },
            communicationPattern: { wifeStyle: "情绪主导型", husbandStyle: "回避防御型", problem: "缺少倾听" },
            keywords: [
              { word: "孩子", count: 5, sentiment: "neutral" },
              { word: "累", count: 3, sentiment: "negative" }
            ],
            reasonCategory: { category: "孩子教育", description: "围绕教育方式产生分歧" },
            duration: { total: "03:00", effective: "02:30" }
          },
          createTime: Date.now(),
        },
        {
          id: "20250116-001",
          date: "2025-01-16 22:00",
          audioFile: "吵架_家务分配.mp3",
          reasonCategory: "家务分配",
          duration: "02:15",
          resolved: true,
          wifeMaxIntensity: 7,
          husbandMaxIntensity: 6,
          analysis: {
            emotionCurve: [],
            triggerPoint: { text: "你回来就只知道玩手机", time: "00:10", type: "累积爆发" },
            needsAnalysis: {
              wife: { surface: "抱怨家务分配", deep: "希望分担家务" },
              husband: { surface: "强调赚钱养家", deep: "希望工作被理解" }
            },
            communicationPattern: { wifeStyle: "情绪主导型", husbandStyle: "回避防御型", problem: "缺少沟通" },
            keywords: [
              { word: "家务", count: 4, sentiment: "neutral" },
              { word: "累", count: 2, sentiment: "negative" }
            ],
            reasonCategory: { category: "家务分配", description: "家务分配不均" },
            duration: { total: "02:15", effective: "02:00" }
          },
          createTime: Date.now() - 86400000,
        },
      ];
      wx.setStorageSync('quarrel_records', mockRecords);
      console.log('初始化测试数据，共', mockRecords.length, '条记录');
    } else {
      console.log('已有记录数:', records.length);
    }

    const settings = wx.getStorageSync('quarrel_settings');
    if (!settings) {
      const defaultSettings = {
        storageLocation: 'local',
        notificationTime: 'after1hour',
      };
      wx.setStorageSync('quarrel_settings', defaultSettings);
      console.log('初始化设置');
    }
  },

  /**
   * 获取吵架记录列表
   */
  getRecords() {
    return wx.getStorageSync('quarrel_records') || [];
  },

  /**
   * 保存吵架记录
   */
  saveRecord(record) {
    const records = this.getRecords();
    records.unshift(record); // 最新的在前面
    wx.setStorageSync('quarrel_records', records);
    return records;
  },

  /**
   * 获取单条记录
   */
  getRecordById(id) {
    const records = this.getRecords();
    return records.find(r => r.id === id);
  },

  /**
   * 删除记录
   */
  deleteRecord(id) {
    const records = this.getRecords().filter(r => r.id !== id);
    wx.setStorageSync('quarrel_records', records);
  },

  /**
   * 更新记录
   */
  updateRecord(id, updates) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      wx.setStorageSync('quarrel_records', records);
    }
  },

  /**
   * 获取设置
   */
  getSettings() {
    return wx.getStorageSync('quarrel_settings') || {
      storageLocation: 'local',
      notificationTime: 'after1hour',
    };
  },

  /**
   * 更新设置
   */
  updateSettings(settings) {
    wx.setStorageSync('quarrel_settings', settings);
  },

  globalData: {
    userInfo: null
  }
});
