// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 请替换为你的云开发环境ID
        traceUser: true,
      });
    }

    // 检查本地存储，初始化数据
    this.initLocalData();
  },

  /**
   * 初始化本地数据
   */
  initLocalData() {
    const records = wx.getStorageSync('quarrel_records');
    if (!records) {
      wx.setStorageSync('quarrel_records', []);
    }

    const settings = wx.getStorageSync('quarrel_settings');
    if (!settings) {
      const defaultSettings = {
        storageLocation: 'local', // local | cloud
        notificationTime: 'after1hour', // immediately | after1hour | manually
      };
      wx.setStorageSync('quarrel_settings', defaultSettings);
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
