const express = require('express');
const path = require('path');
const router = express.Router();

// 加载高中版和初中版的诗文数据
const seniorPoems = require('../src/js/senior.js').default;
const juniorPoems = require('../src/js/junior.js').default;

// 高中版路由
router.get('/poem/senior', (req, res) => {
    res.json(seniorPoems);
});

// 初中版路由
router.get('/poem/junior', (req, res) => {
    res.json(juniorPoems);
});

module.exports = router;
