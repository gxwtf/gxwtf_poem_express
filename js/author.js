const express = require('express');
const path = require('path');
const router = express.Router();

// 加载作者数据
const authorData = require('../src/author/author').default;

// 根据人名返回作者信息
router.get('/', (req, res) => {
    const name = req.query.name;
    const author = authorData.find(a => a.name === name);

    if (author) {
        res.json(author);
    } else {
        res.status(404).send('未找到该作者的信息');
    }
});

// 返回作者详情页面
router.get('/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/viewAuthor.html'));
});

module.exports = router;
