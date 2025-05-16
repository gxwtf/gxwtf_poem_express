const express = require('express');
const path = require('path');
const { parsePoem } = require('./js/parsePoem');
const listRoutes = require('./js/list'); // 引入 list.js 路由

const app = express();
const PORT = 1234;

// 检测是否传入 --parsePoem 参数
const args = process.argv.slice(2);
if (args.includes('--parsePoem')) {
    parsePoem(); // 调用 parsePoem 函数
}

// 设置 public 目录为静态文件根目录
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] })); // 支持省略 .html 后缀

// 挂载 list.js 路由
app.use(listRoutes);

// 捕获所有未匹配的路由，返回 404 页面
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicDir, '404.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，访问地址：http://localhost:${PORT}`);
});