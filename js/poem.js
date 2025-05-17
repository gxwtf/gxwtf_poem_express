const express = require('express');
const path = require('path');
const router = express.Router();

// 加载古诗文数据
const seniorPoems = require('../src/js/senior.js').default;
const juniorPoems = require('../src/js/junior.js').default;
const allPoems = require('../src/js/all.js').default;

// 高中版路由
router.get('/senior', (req, res) => {
    res.json(seniorPoems);
});

// 初中版路由
router.get('/junior', (req, res) => {
    res.json(juniorPoems);
});

// 根据标题返回古诗文详情
router.get('/', (req, res) => {
    const title = req.query.title;
    const poem = allPoems.find(p => p.title === title);

    if (poem) {
        res.json(poem);
    } else {
        res.status(404).send('未找到对应的古诗文');
    }
});

module.exports = router;
