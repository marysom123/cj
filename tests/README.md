# 测试数据说明

本目录包含用于测试的模拟数据。

## 文件说明

- `mock-data.js`：包含所有测试数据和生成函数

## 使用方法

### 1. 在开发者工具中使用

打开微信开发者工具控制台，运行：

```javascript
// 引入测试数据
import { initMockData, mockRecords } from './tests/mock-data.js';

// 初始化测试数据到本地存储
initMockData();

// 刷新页面，查看效果
```

### 2. 在页面中使用

```javascript
// pages/index/index.js
const { mockRecords } = require('../../tests/mock-data.js');

Page({
  onLoad() {
    // 使用模拟数据
    this.setData({
      records: mockRecords
    });
  }
});
```

### 3. 生成随机数据

```javascript
import { generateRandomRecord } from './tests/mock-data.js';

// 生成一条随机记录
const randomRecord = generateRandomRecord();

// 保存到本地
app.saveRecord(randomRecord);
```

## 测试数据内容

### mockTranscript
模拟语音识别结果，包含完整的转写文本和时间戳。

### mockAnalysis
模拟AI分析结果，包含：
- 情绪曲线（9个数据点）
- 触发点识别
- 双方需求分析
- 沟通模式分析
- 高频关键词
- 原因分类
- 时长统计

### mockRecord
完整的吵架记录对象。

### mockRecords
记录列表，包含2条示例记录。

## 注意事项

1. **仅用于开发测试**：这些数据是假的，仅供UI测试使用
2. **不要用于生产**：真实环境需要调用真实的云函数
3. **数据结构真实**：虽然内容是假的，但数据结构与真实数据完全一致

## 清理测试数据

如果需要清理测试数据：

```javascript
wx.removeStorageSync('quarrel_records');
```
