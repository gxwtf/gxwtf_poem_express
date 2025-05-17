/**
 * split-poems.js
 * 将 input.txt 拆成多首古诗文文件
 * 用法：node split-poems.js
 */

const fs   = require('fs');
const path = require('path');

const SRC_FILE = 'input.txt';          // 源文件
const OUT_DIR  = 'output';             // 统一输出目录

// 确保输出目录存在
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// 读取并按两行以上空白切分
const raw = fs.readFileSync(SRC_FILE, 'utf8')
              .replace(/\r\n/g, '\n');                     // 统一换行符
const blocks = raw.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

// 每两块为「信息块 + 翻译块」；信息块再分头部/正文
for (let i = 0; i < blocks.length; i += 2) {
    const info   = blocks[i];
    const trans  = blocks[i + 1] || '';
    const lines  = info.split('\n');

    // 头三行：题目、作者行、tags 行
    const [title, authorLine, tagLine, ...rest] = lines;

    // 查找正文从第 4 行开始，直到遇到空行
    const emptyIdx = rest.findIndex(l => l.trim() === '');
    const poemLines = emptyIdx === -1 ? rest : rest.slice(0, emptyIdx);
    const metaExtra = emptyIdx === -1 ? []   : rest.slice(emptyIdx + 1); // 若信息块中还有别的行

    const num   = i / 2 + 1;
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, '');     // 去除非法文件名字符
    const file  = path.join(OUT_DIR, `${num}${safeTitle}.txt`);

    const content = [
        title,
        authorLine,
        tagLine,
        ...metaExtra,           // 如果信息块里有多余信息也保留
        '',
        poemLines.join('\n'),
        '',
        trans.trim()
    ].join('\n');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ 生成 ${file}`);
}