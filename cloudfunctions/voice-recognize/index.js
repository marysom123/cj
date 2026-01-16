// 云函数：语音识别
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 腾讯云语音识别SDK
const TCLCloudSpeech = require('tencentcloud-sdk-nodejs');

// 导入语音识别产品
const SpeechRecognitionClient = TCLCloudSpeech.v20190614.Client;

// 导入配置
const ClientProfile = TCLCloudSpeech.common.ClientProfile;
const HttpProfile = TCLCloudSpeech.common.HttpProfile;

// 配置腾讯云API
const httpProfile = new HttpProfile();
httpProfile.endpoint = 'asr.tencentcloudapi.com';

const clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;

exports.main = async (event, context) => {
  const { fileID } = event;

  try {
    // 1. 从云存储下载音频文件
    const fileRes = await cloud.downloadFile({
      fileID,
    });

    const buffer = fileRes.fileContent;

    // 2. 调用腾讯云语音识别API
    const client = new SpeechRecognitionClient({
      credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
      },
      region: process.env.TENCENT_REGION || 'ap-guangzhou',
      profile: clientProfile,
    });

    const params = {
      EngineModelType: '16k_zh', // 16k中文普通话通用
      ChannelNum: 1, // 单声道
      Data: buffer.toString('base64'),
      DataLen: buffer.length,
      SpeakerDiarization: 1, // 开启说话人分离
      SpeakerNumber: 2, // 2个说话人
    };

    const result = await client.CreateRecTask(params);

    // 3. 轮询获取识别结果
    const taskId = result.Data.TaskId;
    let transcript = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒

      const queryResult = await client.DescribeTaskStatus({
        TaskId: taskId,
      });

      const status = queryResult.Data.Status;

      if (status === 2) {
        // 识别完成
        transcript = queryResult.Data.Result;
        break;
      } else if (status === 3) {
        // 识别失败
        throw new Error(queryResult.Data.ErrorMsg || '语音识别失败');
      }

      attempts++;
    }

    if (!transcript) {
      throw new Error('语音识别超时');
    }

    // 4. 解析识别结果
    const sentences = transcript.SentenceList || [];

    // 5. 返回结果
    return {
      success: true,
      data: {
        text: transcript.Result || '',
        sentences: sentences.map(s => ({
          text: s.Text || '',
          speaker: s.SpeakerId === 0 ? '妻子' : '丈夫', // 假设0是妻子，1是丈夫
          startTime: s.StartTime || 0,
          endTime: s.EndTime || 0,
        })),
      },
    };

  } catch (error) {
    console.error('语音识别失败:', error);
    return {
      success: false,
      message: error.message || '语音识别失败',
    };
  }
};
