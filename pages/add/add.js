// pages/add/add.js
const app = getApp();

Page({
  data: {
    selectedFile: null,
    uploading: false,
    progress: 0,
    statusText: '',
  },

  /**
   * 选择音频文件
   */
  chooseAudio() {
    const that = this;

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['mp3', 'm4a', 'wav', 'amr', 'aac'],
      success(res) {
        const file = res.tempFiles[0];

        // 格式化文件大小
        const sizeText = that.formatFileSize(file.size);

        that.setData({
          selectedFile: {
            ...file,
            sizeText,
          },
        });

        // 自动开始上传和分析
        that.startAnalysis(file);
      },
      fail(err) {
        console.error('选择文件失败', err);
        wx.showToast({
          title: '选择文件失败',
          icon: 'none',
        });
      },
    });
  },

  /**
   * 开始分析流程
   */
  async startAnalysis(file) {
    this.setData({
      uploading: true,
      progress: 0,
      statusText: '准备上传...',
    });

    try {
      // 步骤1: 上传文件到云存储
      this.setProgress(10, '上传文件中...');
      const cloudPath = await this.uploadToCloud(file);
      console.log('文件上传成功:', cloudPath);

      // 步骤2: 语音识别
      this.setProgress(30, '语音识别中...');
      const transcript = await this.recognizeSpeech(cloudPath);
      console.log('语音识别成功:', transcript);

      // 删除云端文件
      await this.deleteFromCloud(cloudPath);

      // 步骤3: AI分析
      this.setProgress(60, 'AI分析中...');
      const analysis = await this.analyzeWithAI(transcript);
      console.log('AI分析成功:', analysis);

      // 步骤4: 保存记录
      this.setProgress(90, '保存记录中...');
      const record = this.createRecord(file, transcript, analysis);
      app.saveRecord(record);

      this.setProgress(100, '分析完成！');

      // 延迟后跳转到详情页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/detail/detail?id=${record.id}`,
        });
      }, 1000);

    } catch (error) {
      console.error('分析失败:', error);
      wx.showModal({
        title: '分析失败',
        content: error.message || '未知错误，请重试',
        showCancel: false,
      });
      this.setData({
        uploading: false,
        progress: 0,
      });
    }
  },

  /**
   * 上传文件到云存储
   */
  uploadToCloud(file) {
    return new Promise((resolve, reject) => {
      const cloudPath = `quarrel-audio/${Date.now()}-${file.name}`;
      wx.cloud.uploadFile({
        cloudPath,
        filePath: file.path,
        success: res => {
          resolve(res.fileID);
        },
        fail: reject,
      });
    });
  },

  /**
   * 语音识别
   */
  recognizeSpeech(cloudPath) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'voice-recognize',
        data: {
          fileID: cloudPath,
        },
        success: res => {
          if (res.result.success) {
            resolve(res.result.data);
          } else {
            reject(new Error(res.result.message));
          }
        },
        fail: reject,
      });
    });
  },

  /**
   * AI分析
   */
  analyzeWithAI(transcript) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ai-analysis',
        data: {
          transcript,
        },
        success: res => {
          if (res.result.success) {
            resolve(res.result.data);
          } else {
            reject(new Error(res.result.message));
          }
        },
        fail: reject,
      });
    });
  },

  /**
   * 删除云端文件
   */
  deleteFromCloud(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.deleteFile({
        fileList: [fileID],
        success: resolve,
        fail: reject,
      });
    });
  },

  /**
   * 创建记录对象
   */
  createRecord(file, transcript, analysis) {
    const now = new Date();
    const id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    return {
      id,
      date: now.toLocaleString('zh-CN'),
      audioFile: file.name,
      transcript,
      analysis,
      reasonCategory: analysis.reasonCategory?.category || '其他',
      duration: analysis.duration?.total || '00:00',
      resolved: false,
      createTime: now.getTime(),
    };
  },

  /**
   * 设置进度
   */
  setProgress(progress, statusText) {
    this.setData({
      progress,
      statusText,
    });
  },

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },
});
