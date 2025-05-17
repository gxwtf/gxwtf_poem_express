const express = require('express');
const path = require('path');
const router = express.Router();

// 加载古诗文数据
const seniorPoems = require('../src/js/senior.js').default;
const juniorPoems = require('../src/js/junior.js').default;
const allPoems = require('../src/js/all.js').default;

// 高中版路由
router.get('/poem/senior', (req, res) => {
    res.json(seniorPoems);
});

// 初中版路由
router.get('/poem/junior', (req, res) => {
    res.json(juniorPoems);
});

// 根据标题返回古诗文详情
router.get('/poem', (req, res) => {
    const title = req.query.title;
    const poem = allPoems.find(p => p.title === title);

    if (poem) {
        res.json(poem);
    } else {
        res.status(404).send('未找到对应的古诗文');
    }
});

// 根据路径直接返回古诗文详情页面
router.get('/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const poem = allPoems.find(p => p.title === title);

    if (poem) {
        res.sendFile(path.join(__dirname, '../public/view.html'));
    } else {
        res.status(404).send('未找到对应的古诗文');
    }
});

module.exports = router;
