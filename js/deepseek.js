// 该模块可以调用 DeepSeek API，方便后期处理
// 请注意，该模块用的是 WCK 的 API Key。

const https = require('https');
const apiKey = 'sk-17499a3e94614994bf54c6ffe63bc4a0';

/**
 * 调用 DeepSeek API 的简化函数
 * @param {string} userPrompt - 用户提示
 * @param {string} [systemPrompt='你是一个有帮助的助手'] - 系统提示
 * @param {Object} [options={}] - 可选参数
 * @returns {Promise<string>} - AI 生成的回复
 */
function deepseekChat(userPrompt, systemPrompt = '你是一个有帮助的助手', options = {}) {
  return new Promise((resolve, reject) => {
    // 构建请求体 [3,5](@ref)
    const requestBody = JSON.stringify({
      model: options.model || 'deepseek-reasoner',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      ...options
    });

    // 配置请求选项 [6,8](@ref)
    const requestOptions = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    // 发送请求 [7](@ref)
    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          reject(`解析响应失败: ${e.message}`);
        }
      });
    });

    req.on('error', (e) => reject(`API 请求失败: ${e.message}`));
    req.write(requestBody);
    req.end();
  });
}

module.exports = deepseekChat;

/* 响应示例：
{
  id: 'ab41fe37-6176-43bc-b178-4e07cecec45e',
  object: 'chat.completion',
  created: 1749267546,
  model: 'deepseek-chat',
  choices: [
    {
      index: 0,
      message: { role: 'assistant', content: 'XC2236' },
      logprobs: null,
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 19,
    completion_tokens: 3,
    total_tokens: 22,
    prompt_tokens_details: { cached_tokens: 0 },
    prompt_cache_hit_tokens: 0,
    prompt_cache_miss_tokens: 19
  },
  system_fingerprint: 'fp_8802369eaa_prod0425fp8'
}
*/