// pages/index/index.js
const app = getApp();
const { initMockData } = require('../../utils/mock-data.js');

Page({
  data: {
    records: [],
    monthlyCount: 0,
    totalDuration: 0,
    topReason: '-',
  },

  onLoad() {
    console.log('首页加载');

    // 开发模式：初始化测试数据（如果没有数据的话）
    const records = app.getRecords();
    if (records.length === 0) {
      console.log('没有数据，初始化测试数据');
      initMockData();
    }

    this.loadRecords();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadRecords();
  },

  /**
   * 加载记录列表
   */
  loadRecords() {
    const records = app.getRecords();
    console.log('加载记录:', records.length, '条');

    // 计算统计数据
    const monthlyCount = this.calculateMonthlyCount(records);
    const totalDuration = this.calculateTotalDuration(records);
    const topReason = this.calculateTopReason(records);

    // 为每条记录添加情绪强度最大值
    const recordsWithIntensity = records.map(record => {
      const wifeMaxIntensity = this.getMaxIntensity(record, '妻子');
      const husbandMaxIntensity = this.getMaxIntensity(record, '丈夫');
      return {
        ...record,
        wifeMaxIntensity,
        husbandMaxIntensity,
      };
    });

    this.setData({
      records: recordsWithIntensity,
      monthlyCount,
      totalDuration,
      topReason,
    });
  },

  /**
   * 计算本月吵架次数
   */
  calculateMonthlyCount(records) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return records.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length;
  },

  /**
   * 计算总时长（分钟）
   */
  calculateTotalDuration(records) {
    return records.reduce((total, record) => {
      const duration = this.parseDuration(record.duration);
      return total + duration;
    }, 0);
  },

  /**
   * 解析时长字符串（如"03:00"）为分钟数
   */
  parseDuration(durationStr) {
    if (!durationStr) return 0;
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  },

  /**
   * 计算最常见的原因
   */
  calculateTopReason(records) {
    if (records.length === 0) return '-';

    const reasonCount = {};
    records.forEach(record => {
      const reason = record.reasonCategory || '其他';
      reasonCount[reason] = (reasonCount[reason] || 0) + 1;
    });

    let maxCount = 0;
    let topReason = '-';
    for (const reason in reasonCount) {
      if (reasonCount[reason] > maxCount) {
        maxCount = reasonCount[reason];
        topReason = reason;
      }
    }

    return topReason;
  },

  /**
   * 获取某人的最大情绪强度
   */
  getMaxIntensity(record, speaker) {
    if (!record.analysis || !record.analysis.emotionCurve) {
      return 0;
    }

    const speakerEmotions = record.analysis.emotionCurve.filter(
      e => e.speaker === speaker
    );

    if (speakerEmotions.length === 0) return 0;

    return Math.max(...speakerEmotions.map(e => e.intensity || 0));
  },

  /**
   * 跳转到详情页
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    });
  },
});
