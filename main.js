const path = require('path');
const { parsePoem } = require('./js/parsePoem');

// 检测是否传入 --parsePoem 参数
const args = process.argv.slice(2);

if (args.includes('--parsePoem')) {
    parsePoem(); // 调用 parsePoem 函数
}