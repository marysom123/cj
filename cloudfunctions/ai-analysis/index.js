// 云函数：AI分析
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const axios = require('axios');

// 智谱AI API配置
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

// 分析Prompt模板
const ANALYSIS_PROMPT = (transcript) => `
你是一位专业的心理咨询师和沟通专家。请分析以下夫妻吵架的对话记录，返回JSON格式的分析结果。

对话内容：
${transcript}

请按以下要求分析：

1. 情绪曲线分析
- 逐句分析情绪类型：愤怒、委屈、疲惫、冷静、歉意等
- 情绪强度：1-10分
- 返回格式：[{"time": "00:15", "speaker": "妻子", "text": "原话", "emotion": "愤怒", "intensity": 8}]

2. 触发点识别
- 第一句引发争吵的话
- 触发时间
- 触发类型：累积爆发/直接冲突/误解触发

3. 双方需求分析
- 妻子的表层诉求和深层需求
- 丈夫的表层诉求和深层需求

4. 沟通模式
- 妻子的沟通风格
- 丈夫的沟通风格
- 存在的沟通问题

5. 高频关键词
- 提取出现2次以上的关键词
- 标注情感色彩：正面/负面/中性

6. 吵架原因分类
- 主要原因：家务/孩子/金钱/沟通/其他
- 原因说明（50字以内）

7. 吵架时长
- 总时长
- 估算有效争吵时长

请确保返回的是有效的JSON格式，不要有任何其他文字。
`;

exports.main = async (event, context) => {
  const { transcript } = event;

  try {
    // 1. 准备对话内容
    let conversationText = '';
    if (Array.isArray(transcript.sentences)) {
      conversationText = transcript.sentences
        .map(s => `${s.speaker}: ${s.text}`)
        .join('\\n');
    } else {
      conversationText = transcript.text || '';
    }

    // 2. 调用智谱AI API
    const response = await axios.post(
      ZHIPU_API_URL,
      {
        model: 'glm-4', // 使用GLM-4模型
        messages: [
          {
            role: 'user',
            content: ANALYSIS_PROMPT(conversationText),
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
        },
        timeout: 30000, // 30秒超时
      }
    );

    // 3. 解析AI返回结果
    const aiResponse = response.data;
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('AI返回内容为空');
    }

    // 4. 提取JSON（可能包含markdown代码块）
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    jsonStr = jsonStr.trim();

    // 5. 解析JSON
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON解析失败:', jsonStr);
      throw new Error('AI返回格式不正确');
    }

    // 6. 返回结果
    return {
      success: true,
      data: analysis,
    };

  } catch (error) {
    console.error('AI分析失败:', error);
    return {
      success: false,
      message: error.message || 'AI分析失败',
    };
  }
};
