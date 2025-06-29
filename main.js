const express = require('express');
const path = require('path');
const { parsePoem } = require('./js/parsePoem');

// 检测是否传入 --parsePoem 参数
const args = process.argv.slice(2);

if (args.includes('--parsePoem')) {
    parsePoem();
}

const PoemRoutes = require('./js/poem'); // 引入 poem.js 路由
const authorRoutes = require('./js/author'); // 引入 author.js 路由
const breakSentenceRoutes = require('./js/breakSentence'); // 引入 breakSentence.js 路由
const allPoems = require('./src/js/all').default; // 加载所有古诗文数据

const app = express();
const PORT = 1234;

// 设置 public 目录为静态文件根目录，支持省略 .html 后缀
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] }));

// 挂载路由，添加唯一前缀
app.use('/author', authorRoutes); // 为 authorRoutes 添加 /author 前缀
app.use('/poem', PoemRoutes); // 为 PoemRoutes 添加 /poem 前缀
app.use('/game/breakSentence', breakSentenceRoutes); // 为 breakSentenceRoutes 添加前缀

// 定义通过 /古诗文名字 直接访问古诗文的路由
app.get('/:title', (req, res) => {
    res.sendFile(path.join(publicDir, 'viewPoem.html'));
});

// 捕获所有未匹配的路由，返回 404 页面
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicDir, '404.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，访问地址：http://localhost:${PORT}`);
});