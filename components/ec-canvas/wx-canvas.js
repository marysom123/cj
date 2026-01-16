export default class WxCanvas {
  constructor(ctx, canvasId, isNew) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.isNew = isNew;
  }

  setChart(chart) {
    this.chart = chart;
  }

  addEventListener() {
    // 暂不支持
  }

  removeEventListener() {
    // 暂不支持
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }

  // 将echarts的toFix方法转换为wx的toFix方法
  toFix() {
    if (this.isNew) {
      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        this.ctx.draw(false, resolve);
      });
    }
  }
}
