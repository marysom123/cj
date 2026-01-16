// components/ec-canvas/ec-canvas.js
import WxCanvas from './wx-canvas';

// ECharts for 微信小程序
// 需要先下载 echarts.min.js 放到同目录下
// 下载地址: https://github.com/ecomfe/echarts-for-weixin

let echarts = require('./echarts.min');

Component({
  properties: {
    canvasId: {
      type: String,
      value: 'ec-canvas',
    },
    ec: {
      type: Object,
    },
  },

  data: {
    isUseNewCanvas: false,
  },

  ready: function () {
    if (!this.data.ec) {
      console.warn('组件需绑定 ec 变量，例如：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
      return;
    }

    if (!this.data.ec.lazyLoad) {
      this.init();
    }
  },

  methods: {
    init: function (callback) {
      const version = wx.getSystemInfoSync().SDKVersion;

      const canUseNewCanvas = false; // 暂时禁用新版canvas

      const isNewCanvas = this.data.isUseNewCanvas;

      if (isNewCanvas) {
        // 新版 canvas
        this.setData({ isUseNewCanvas });
      } else {
        // 旧版 canvas
        const canvasContext = wx.createCanvasContext(this.data.canvasId, this);
        const canvas = new WxCanvas(canvasContext, this.data.canvasId, false);

        echarts.setCanvasCreator(() => {
          return canvas;
        });

        var query = wx.createSelectorQuery().in(this);
        query
          .select(`.ec-canvas`)
          .boundingClientRect((res) => {
            if (!res || res.length === 0) {
              return;
            }
            echarts.setCanvasCreator(() => {
              return canvas;
            });

            if (this.data.ec && this.data.ec.onInit) {
              const chart = this.data.ec.onInit(canvas, res.width, res.height);
              this.chart = chart;
              const that = this;

              canvas.addEventListener('render', () => {
                that.draw();
              });

              callback && callback(chart);
            }
          })
          .exec();
      }
    },

    canvasToTempFilePath(opt) {
      if (this.data.isUseNewCanvas) {
        // 新版
        this.canvasToTempFilePath(opt);
      } else {
        // 旧版
        const canvasContext = wx.createCanvasContext(this.data.canvasId, this);
        canvasContext.draw(true, () => {
          wx.canvasToTempFilePath({
            canvasId: this.data.canvasId,
            success: opt.success,
            fail: opt.fail,
            complete: opt.complete,
          });
        });
      }
    },

    touchStart(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        var handler = this.chart.getZr().handler;
        handler.dispatch('mousedown', {
          zrX: touch.x,
          zrY: touch.y,
        });
      }
    },

    touchMove(e) {
      if (this.chart && e.touches.length > 0) {
        var touch = e.touches[0];
        var handler = this.chart.getZr().handler;
        handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y,
        });
      }
    },

    touchEnd(e) {
      if (this.chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        var handler = this.chart.getZr().handler;
        handler.dispatch('mouseup', {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.dispatch('click', {
          zrX: touch.x,
          zrY: touch.y,
        });
      }
    },
  },
});
