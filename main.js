const path = require('path');
const { spawnSync } = require('child_process');

// 检测是否传入 --initPoem 参数
const args = process.argv.slice(2);
const initPoem = args.includes('--parsePoem');

// 运行 trans.js
const transScript = path.join(__dirname, 'js/parsePoem.js'); // 使用相对路径
const transArgs = initPoem ? ['--parsePoem'] : [];
spawnSync('node', [transScript, ...transArgs], { stdio: 'inherit' });