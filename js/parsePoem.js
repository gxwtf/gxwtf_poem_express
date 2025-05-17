const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const srcDir = path.join(__dirname, '../src/poem');
const destDir = path.join(__dirname, '../src/js');

// 确保目标目录存在
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 将半角标点转换为全角标点
function convertToFullWidth(text) {
    return text.replace(/[\u0021-\u007E]/g, char => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code === 0x20 ? 0x3000 : code + 0xFEE0);
    });
}

// 解析单个文件
function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim());

    const title = lines[0];
    const [dynasty, author] = lines[1].match(/【(.*?)】(.*)/).slice(1, 3);
    const tagsLine = lines[2];
    const tags = tagsLine.startsWith('tags:') ? tagsLine.slice(5).split(',') : [];

    // 提取 display 属性
    const displayLine = lines[3];
    const display = displayLine.startsWith('display:') ? displayLine.slice(8).trim() : undefined;

    const poemStartIndex = lines.indexOf('', 4) + 1;
    const emptyLineIndex = lines.indexOf('', poemStartIndex);

    const poemLines = lines.slice(poemStartIndex, emptyLineIndex).filter(line => line);
    const transLines = lines.slice(emptyLineIndex + 1).filter(line => line);

    // 解析每行的 display 信息
    const parsedContent = poemLines.map((line, index) => {
        const match = line.match(/^(.*?):(.*)$/); // 检查是否有 display 前缀
        if (match) {
            return {
                display: match[1].trim(),
                line: convertToFullWidth(match[2].trim().replace(/"/g, '\\"')),
                trans: convertToFullWidth((transLines[index] || '').replace(/"/g, '\\"'))
            };
        }
        return {
            line: convertToFullWidth(line.replace(/"/g, '\\"')),
            trans: convertToFullWidth((transLines[index] || '').replace(/"/g, '\\"'))
        };
    });

    return { title, dynasty, author, tags, display, content: parsedContent };
}

// 主解析函数
async function parsePoem() {
    const subDirs = fs.readdirSync(srcDir).filter(subDir => {
        const subDirPath = path.join(srcDir, subDir);
        return fs.statSync(subDirPath).isDirectory();
    });

    const allPoems = [];

    for (const subDir of subDirs) {
        const subDirPath = path.join(srcDir, subDir);
        const files = fs.readdirSync(subDirPath).filter(file => file.endsWith('.txt'));

        const poems = files.map(file => {
            const filePath = path.join(subDirPath, file);
            return parseFile(filePath);
        });

        allPoems.push(...poems);

        const jsContent = `
/**
 * ${subDir} 合集
 */
const poems = ${JSON.stringify(poems, null, 4)};
export default poems;
        `.trim();

        const destPath = path.join(destDir, `${subDir}.js`);
        fs.writeFileSync(destPath, jsContent, 'utf-8');
    }

    const allJsContent = `
/**
 * 所有诗词合集
 */
const allPoems = ${JSON.stringify(allPoems, null, 4)};
export default allPoems;
    `.trim();

    const allDestPath = path.join(destDir, 'all.js');
    fs.writeFileSync(allDestPath, allJsContent, 'utf-8');

    console.log('所有子目录已成功解析并生成到 /src/js 目录下，并合并到 all.js！');
}

module.exports = { parsePoem };