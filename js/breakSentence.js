const express = require('express');
const path = require('path'); // 引入 path 模块
const allPoems = require('../src/js/all').default; // 加载所有古诗文数据
const router = express.Router();

// 标点符号分类
const punctuation = {
    mustBreak: ['。', '，', '！', '？', '：', '；'], // 必须断
    canBreak: ['、'], // 可以断
    ignore: ['《', '》', '“', '”', '——'], // 忽略
};

// 去除标点符号并生成断句信息
function processText(text) {
    const cleanText = [];
    const breakInfo = [];
    let currentIndex = 0; // 用于跟踪 cleanText 的字符位置

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (punctuation.mustBreak.includes(char)) {
            // 如果是最后一个字符的标点符号，标记为 canBreak
            if (i === text.length - 1) {
                breakInfo.push({ index: currentIndex - 1, type: 'canBreak' });
            } else {
                breakInfo.push({ index: currentIndex - 1, type: 'mustBreak' });
            }
        } else if (punctuation.canBreak.includes(char)) {
            breakInfo.push({ index: currentIndex - 1, type: 'canBreak' });
        } else if (!punctuation.ignore.includes(char)) {
            cleanText.push(char);
            currentIndex++; // 仅在添加到 cleanText 时递增
        }
    }

    return { cleanText: cleanText.join(''), breakInfo };
}

// 根据断句信息生成断句后的诗句
function generateBrokenText(text, breaks) {
    const chars = text.split('');
    breaks.sort((a, b) => b - a); // 从后往前插入，避免索引偏移
    breaks.forEach(index => {
        chars.splice(index + 1, 0, '/');
    });
    return chars.join('');
}

// 获取古诗文并处理
router.get('/getPoem/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const poem = allPoems.find(p => p.title === title);

    if (!poem) {
        return res.status(404).json({ error: '未找到指定古诗文' });
    }

    const { cleanText, breakInfo } = processText(poem.content.map(c => c.line).join(''));
    res.json({ title: poem.title, content: cleanText, breakInfo });
});

// 校验用户提交的断句结果
router.post('/getResult/:title', express.json(), (req, res) => {
    const { userBreaks } = req.body;
    const title = decodeURIComponent(req.params.title);
    const poem = allPoems.find(p => p.title === title);

    if (!poem) {
        return res.status(404).json({ error: '未找到指定古诗文' });
    }

    const { cleanText, breakInfo } = processText(poem.content.map(c => c.line).join(''));

    let correct = 0;
    let errors = 0;
    let missing = 0;

    const correctBreaks = [];
    const wrongBreaks = [];
    const missingBreaks = [];

    // 遍历断句信息，统计正确和漏标的断句
    breakInfo.forEach(({ index, type }) => {
        if (type === 'mustBreak') {
            if (userBreaks.includes(index)) {
                correct++;
                correctBreaks.push(index);
            } else {
                missing++;
                missingBreaks.push(index);
            }
        } else if (type === 'canBreak') {
            // 可断可不断，不计入错误或漏标
            if (userBreaks.includes(index)) {
                correctBreaks.push(index); // 如果用户标了，视为正确
            }
        }
    });

    // 遍历用户断句，统计错误的断句
    userBreaks.forEach(index => {
        if (!breakInfo.some(b => b.index === index && (b.type === 'mustBreak' || b.type === 'canBreak'))) {
            errors++;
            wrongBreaks.push(index);
        }
    });

    // 生成断句后的诗句
    const userBrokenText = generateBrokenText(cleanText, userBreaks);
    const correctBrokenText = generateBrokenText(cleanText, breakInfo.filter(b => b.type === 'mustBreak').map(b => b.index));

    res.json({
        correct,
        errors,
        missing,
        correctBreaks,
        wrongBreaks,
        missingBreaks,
        userBrokenText,
        correctBrokenText,
    });
});

// 定义 /game/breakSentence/:title 路由，返回 breakSentence.html
router.get('/:title', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game/breakSentence.html'));
});

module.exports = router;
