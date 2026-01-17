// pages/detail/detail.js
const app = getApp();
const echarts = require('../../components/ec-canvas/echarts.min');

Page({
  data: {
    loading: true,
    record: null,
    triggerPoint: {},
    needs: { wife: {}, husband: {} },
    communication: {},
    keywords: [],
    emotionChart: {},
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.loadRecord(id);
    } else {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载记录详情
   */
  loadRecord(id) {
    const record = app.getRecordById(id);

    if (!record) {
      this.setData({ loading: false });
      return;
    }

    // 提取分析数据
    const analysis = record.analysis || {};

    this.setData({
      record,
      triggerPoint: analysis.triggerPoint || {},
      needs: analysis.needsAnalysis || { wife: {}, husband: {} },
      communication: analysis.communicationPattern || {},
      keywords: analysis.keywords || [],
      loading: false,
    });

    // 绘制情绪曲线
    if (analysis.emotionCurve && analysis.emotionCurve.length > 0) {
      this.initEmotionChart(analysis.emotionCurve);
    }
  },

  /**
   * 初始化情绪曲线图
   */
  initEmotionChart(emotionCurve) {
    const that = this;

    // 分离妻子和丈夫的数据
    const wifeData = emotionCurve.filter(e => e.speaker === '妻子');
    const husbandData = emotionCurve.filter(e => e.speaker === '丈夫');

    // 生成X轴标签（时间点）
    const timeLabels = emotionCurve.map((e, index) => {
      const time = e.time || `00:${String(index * 10).padStart(2, '0')}`;
      return time.substring(0, 5); // 只显示分:秒
    });

    this.setData({
      emotionChart: {
        onInit: function(canvas, width, height, dpr) {
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr,
          });

          const option = {
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                const wife = wifeData[dataIndex];
                const husband = husbandData[dataIndex];

                let result = `${timeLabels[dataIndex]}\\n`;

                if (wife) {
                  result += `妻子: ${wife.text}\\n情绪: ${wife.emotion} (${wife.intensity})\\n`;
                }

                if (husband) {
                  result += `丈夫: ${husband.text}\\n情绪: ${husband.emotion} (${husband.intensity})`;
                }

                return result;
              },
            },
            legend: {
              data: ['妻子', '丈夫'],
              bottom: 0,
            },
            grid: {
              left: '10%',
              right: '5%',
              bottom: '15%',
              top: '10%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: timeLabels,
              boundaryGap: false,
              axisLabel: {
                fontSize: 10,
              },
            },
            yAxis: {
              type: 'value',
              min: 0,
              max: 10,
              axisLabel: {
                formatter: '{value}',
              },
            },
            series: [
              {
                name: '妻子',
                type: 'line',
                smooth: true,
                data: wifeData.map(e => e.intensity || 0),
                lineStyle: {
                  color: '#FF6B6B',
                  width: 2,
                },
                itemStyle: {
                  color: '#FF6B6B',
                },
              },
              {
                name: '丈夫',
                type: 'line',
                smooth: true,
                data: husbandData.map(e => e.intensity || 0),
                lineStyle: {
                  color: '#4ECDC4',
                  width: 2,
                },
                itemStyle: {
                  color: '#4ECDC4',
                },
              },
            ],
          };

          chart.setOption(option);
          return chart;
        },
      },
    });
  },

  /**
   * 显示关键词上下文
   */
  showKeywordContext(e) {
    const word = e.currentTarget.dataset.word;
    const record = this.data.record;
    const transcript = record.transcript || '';

    // 这里可以弹出一个对话框，显示包含该关键词的所有对话片段
    wx.showModal({
      title: `"${word.word}" 的上下文`,
      content: `功能开发中\\n\\n出现次数: ${word.count}\\n情感色彩: ${word.sentiment}`,
      showCancel: false,
    });
  },

  /**
   * 分享给伴侣
   */
  shareToPartner() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
    });
  },

  /**
   * 切换解决状态
   */
  toggleResolved() {
    const record = this.data.record;
    const resolved = !record.resolved;

    app.updateRecord(record.id, { resolved });

    this.setData({
      'record.resolved': resolved,
    });

    wx.showToast({
      title: resolved ? '已标记为解决' : '已标记为未解决',
      icon: 'success',
    });
  },

  /**
   * 删除记录
   */
  deleteRecord() {
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这条记录吗？',
      confirmText: '删除',
      confirmColor: '#FF6B6B',
      success(res) {
        if (res.confirm) {
          app.deleteRecord(that.data.record.id);
          wx.showToast({
            title: '已删除',
            icon: 'success',
          });

          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      },
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    const record = this.data.record;
    return {
      title: `我们的吵架记录 - ${record.reasonCategory}`,
      path: `/pages/detail/detail?id=${record.id}`,
      imageUrl: '',
    };
  },
});
