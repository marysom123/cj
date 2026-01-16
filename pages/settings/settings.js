// pages/settings/settings.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    storageOptions: [
      { value: 'local', label: '仅本地存储' },
      { value: 'cloud', label: '云端备份' },
    ],
    storageIndex: 0,
    notificationOptions: [
      { value: 'immediately', label: '立即通知' },
      { value: 'after1hour', label: '1小时后' },
      { value: 'manually', label: '手动查看' },
    ],
    notificationIndex: 1,
  },

  onLoad() {
    this.loadUserInfo();
    this.loadSettings();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    // TODO: 获取微信用户信息
    this.setData({
      userInfo: {
        nickName: '用户',
      },
    });
  },

  /**
   * 加载设置
   */
  loadSettings() {
    const settings = app.getSettings();

    // 设置存储位置
    const storageIndex = this.data.storageOptions.findIndex(
      option => option.value === settings.storageLocation
    );

    // 设置通知时机
    const notificationIndex = this.data.notificationOptions.findIndex(
      option => option.value === settings.notificationTime
    );

    this.setData({
      storageIndex: storageIndex >= 0 ? storageIndex : 0,
      notificationIndex: notificationIndex >= 0 ? notificationIndex : 1,
    });
  },

  /**
   * 存储位置变更
   */
  onStorageChange(e) {
    const index = e.detail.value;
    const storageLocation = this.data.storageOptions[index].value;

    const settings = app.getSettings();
    settings.storageLocation = storageLocation;
    app.updateSettings(settings);

    this.setData({ storageIndex: index });

    wx.showToast({
      title: '已更新',
      icon: 'success',
    });
  },

  /**
   * 通知时机变更
   */
  onNotificationChange(e) {
    const index = e.detail.value;
    const notificationTime = this.data.notificationOptions[index].value;

    const settings = app.getSettings();
    settings.notificationTime = notificationTime;
    app.updateSettings(settings);

    this.setData({ notificationIndex: index });

    wx.showToast({
      title: '已更新',
      icon: 'success',
    });
  },

  /**
   * 导出数据
   */
  exportData() {
    const records = app.getRecords();

    if (records.length === 0) {
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
      });
      return;
    }

    wx.showModal({
      title: '导出数据',
      content: `将导出 ${records.length} 条记录，是否继续？`,
      success(res) {
        if (res.confirm) {
          // TODO: 实现数据导出功能
          wx.showToast({
            title: '导出功能开发中',
            icon: 'none',
          });
        }
      },
    });
  },

  /**
   * 清空所有数据
   */
  clearAllData() {
    wx.showModal({
      title: '确认清空',
      content: '此操作将删除所有吵架记录，不可恢复！',
      confirmText: '确认清空',
      confirmColor: '#FF6B6B',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('quarrel_records');
          wx.showToast({
            title: '已清空',
            icon: 'success',
          });
        }
      },
    });
  },

  /**
   * 显示帮助
   */
  showHelp() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 吵架时用手机录音机录制\\n2. 吵架后选择录音文件上传\\n3. 等待AI分析完成\\n4. 查看分析报告，理解彼此\\n\\n建议在冷静后再查看结果！',
      showCancel: false,
    });
  },

  /**
   * 显示隐私政策
   */
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '• 录音文件识别后立即删除\\n• 分析结果默认保存在本地\\n• 不会上传到第三方服务器\\n• 您可以随时删除所有数据',
      showCancel: false,
    });
  },
});
