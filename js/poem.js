const express = require('express');
const path = require('path');
const router = express.Router();

// 加载古诗文数据
const seniorPoems = require('../src/js/senior.js').default;
const juniorPoems = require('../src/js/junior.js').default;
const allPoems = require('../src/js/all.js').default;

// 支持根据标题、作者、朝代、标签和搜索参数查询古诗文
router.get('/', (req, res) => {
    const { title, author, dynasty, tags, search, version = 'senior' } = req.query;

    const versionMap = {
        senior: seniorPoems,
        junior: juniorPoems,
        all: allPoems
    };
    const basePoems = versionMap[version] || seniorPoems;
    let result = basePoems;

    if (search) {
        result = basePoems.filter(p => p.title.includes(search));
        if (result.length > 0) return res.json(result);

        result = basePoems.filter(p => p.author.includes(search));
        if (result.length > 0) return res.json(result);

        result = basePoems.filter(p => p.dynasty.includes(search));
        if (result.length > 0) return res.json(result);

        result = basePoems.filter(p =>
            p.content.some(line => line.line.includes(search))
        );
        if (result.length > 0) return res.json(result);

        result = basePoems.filter(p => p.tags.some(t => t.includes(search)));
        return result.length > 0
            ? res.json(result)
            : res.status(404).send('未找到相关古诗文');
    }

    if (title) {
        result = result.filter(p => p.title === title);
    }

    if (author) {
        result = result.filter(p => p.author === author);
    }

    if (dynasty) {
        result = result.filter(p => p.dynasty === dynasty);
    }

    if (tags) {
        const raw = Array.isArray(tags) ? tags : decodeURIComponent(tags);

        // 拆成交集组（每个组内部是逗号并集）
        const groupStrings = Array.isArray(raw) ? raw : raw.split(';');
        const groups = groupStrings.map(group => group.split(','));

        result = result.filter(p =>
            groups.every(orGroup =>
                orGroup.some(tag => p.tags.includes(tag))
            )
        );
    }

    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).send('未找到符合条件的古诗文');
    }
});

module.exports = router;
