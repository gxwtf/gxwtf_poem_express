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
        // 转换为全角字符
        return String.fromCharCode(code === 0x20 ? 0x3000 : code + 0xFEE0);
    });
}

// 解析单个文件
function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim());

    // 提取标题、朝代和作者
    const title = lines[0];
    const [dynasty, author] = lines[1].match(/【(.*?)】(.*)/).slice(1, 3);

    // 提取标签
    const tagsLine = lines[2];
    const tags = tagsLine.startsWith('Tags:') ? tagsLine.slice(5).split(',') : [];

    // 找到正文开始的索引（跳过标题、朝代、作者、标签和空行）
    const poemStartIndex = lines.indexOf('', 3) + 1; // 第一个空行之后
    const emptyLineIndex = lines.indexOf('', poemStartIndex); // 正文和翻译之间的空行

    // 分割正文和翻译
    const poemLines = lines.slice(poemStartIndex, emptyLineIndex).filter(line => line); // 正文部分
    const transLines = lines.slice(emptyLineIndex + 1).filter(line => line); // 翻译部分

    // 将诗句和翻译一一对应
    const parsedContent = poemLines.map((line, index) => ({
        line: convertToFullWidth(line.replace(/"/g, '\\"')), // 转换为全角标点并转义双引号
        trans: convertToFullWidth((transLines[index] || '').replace(/"/g, '\\"')) // 转换为全角标点并转义双引号
    }));

    return { title, dynasty, author, tags, content: parsedContent };
}

// 写入 JS 文件
function writeJsFile(fileName, data) {
    const jsContent = `
/**
 * ${fileName} 合集
 */
const poems = ${JSON.stringify(data, null, 4)};
export default poems;
    `.trim();

    const destPath = path.join(destDir, `${fileName}.js`);
    fs.writeFileSync(destPath, jsContent, 'utf-8');
}

// 合并所有古诗文到 all.js
function writeAllJsFile(allPoems) {
    const jsContent = `
/**
 * 所有古诗文合集
 */
const allPoems = ${JSON.stringify(allPoems, null, 4)};
export default allPoems;
    `.trim();

    const destPath = path.join(destDir, 'all.js');
    fs.writeFileSync(destPath, jsContent, 'utf-8');
}

// 主函数
function main() {
    const subDirs = fs.readdirSync(srcDir).filter(subDir => {
        const subDirPath = path.join(srcDir, subDir);
        return fs.statSync(subDirPath).isDirectory();
    });

    const allPoems = [];

    subDirs.forEach(subDir => {
        const subDirPath = path.join(srcDir, subDir);
        const files = fs.readdirSync(subDirPath).filter(file => file.endsWith('.txt'));

        const poems = files.map(file => {
            const filePath = path.join(subDirPath, file);
            return parseFile(filePath);
        });

        allPoems.push(...poems); // 合并到总集合
        writeJsFile(subDir, poems); // 写入子目录对应的 JS 文件
    });

    writeAllJsFile(allPoems); // 写入 all.js 文件

    console.log('所有子目录已成功解析并生成到 /src/js 目录下，并合并到 all.js！');
}

main();