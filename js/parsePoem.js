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
    if (filePath.endsWith('.txt') === false)
        throw new Error(`文件名 "${filePath}" 不是以 .txt 结尾`);
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').map(line => line.trim());

        const title = lines[0];
        const [dynasty, author] = lines[1].match(/【(.*?)】(.*)/).slice(1, 3);
        const tagsLine = lines[2];
        const tags = tagsLine.startsWith('tags:') ? tagsLine.slice(5).split(',') : [];

        // 提取 display 属性
        const displayLine = lines[3];
        const display = displayLine.startsWith('display:') ? displayLine.slice(8).trim() : undefined;

        // 找到正文、翻译、拼音的分割点
        const poemStartIndex = lines.indexOf('', 4) + 1;
        const emptyLineIndex = lines.indexOf('', poemStartIndex);

        const poemLines = lines.slice(poemStartIndex, emptyLineIndex).filter(line => line);
        const transStartIndex = emptyLineIndex + 1;
        // 查找翻译和拼音之间的空行
        let pinyinStartIndex = lines.length;
        for (let i = transStartIndex; i < lines.length; i++) {
            if (lines[i] === '') {
                pinyinStartIndex = i + 1;
                break;
            }
        }
        const transLines = lines.slice(transStartIndex, pinyinStartIndex - 1).filter(line => line);
        const pinyinLines = lines.slice(pinyinStartIndex).filter(line => line);

        // 解析每行的 display 信息
        const parsedContent = poemLines.map((line, index) => {
            const match = line.match(/^(.*?):(.*)$/); // 检查是否有 display 前缀
            let displayVal, lineVal;
            if (match) {
                displayVal = match[1].trim();
                lineVal = match[2].trim();
            } else {
                lineVal = line;
            }
            return {
                ...(displayVal ? { display: displayVal } : {}),
                line: convertToFullWidth(lineVal.replace(/"/g, '\\"')),
                trans: convertToFullWidth((transLines[index] || '').replace(/"/g, '\\"')),
                pinyin: pinyinLines[index] ? pinyinLines[index] : ''
            };
        });

        // 解析写作背景（background）和内容赏析（analysis）
        let background = '';
        let analysis = '';
        if (pinyinStartIndex < lines.length) {
            // 跳过拼音内容
            let bgStart = pinyinStartIndex;
            while (bgStart < lines.length && lines[bgStart] !== '') bgStart++;
            // 跳过拼音后的空行
            while (bgStart < lines.length && lines[bgStart] === '') bgStart++;
            // 背景内容为 bgStart 及其后所有非空行，直到遇到空行为止
            let bgLines = [];
            let i = bgStart;
            for (; i < lines.length; i++) {
                if (lines[i] === '') break;
                bgLines.push(lines[i].replace(/"/g, '\\"'));
            }
            background = bgLines.join('\n');
            // 跳过背景后的空行
            while (i < lines.length && lines[i] === '') i++;
            // 内容赏析内容为 i 及其后所有非空行
            let analysisLines = [];
            for (; i < lines.length; i++) {
                if (lines[i] !== '') {
                    analysisLines.push(lines[i].replace(/"/g, '\\"'));
                }
            }
            analysis = analysisLines.join('\n');
        }

        return { title, dynasty, author, tags, display, content: parsedContent, background, analysis };
    } catch (err) {
        console.error(`解析文件失败: ${filePath}\n错误信息: ${err.message}`);
        // 抛出一个带文件路径信息的错误，供上层捕获
        throw new Error(`解析文件失败: ${filePath}`);
    }
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
        const files = fs
            .readdirSync(subDirPath)
            .filter(file => file.endsWith('.txt'))
            .sort((a, b) => {
                // 提取文件名前面的连续数字；没有数字时返回 Infinity 保证排在后面
                const numA = parseInt(a.match(/^\d+/)?.[0] || '', 10);
                const numB = parseInt(b.match(/^\d+/)?.[0] || '', 10);
                if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b, 'zh-CN'); // 都没数字，按字典序
                if (isNaN(numA)) return 1;
                if (isNaN(numB)) return -1;
                return numA - numB; // 按数字升序
            });

        const poems = [];
        for (const file of files) {
            const filePath = path.join(subDirPath, file);
            try {
                poems.push(parseFile(filePath));
            } catch (err) {
                // 已在 parseFile 中打印错误，这里继续下一个文件
                continue;
            }
        }

        allPoems.push(...poems);

        const jsContent = `
/**
 * ${subDir} 合集
 */
const poems = ${JSON.stringify(poems, null, 4)};
exports.default = poems;
    `.trim();

        const destPath = path.join(destDir, `${subDir}.js`);
        fs.writeFileSync(destPath, jsContent, 'utf-8');
    }

    if (allPoems.length === 0) {
        console.warn('警告: 没有成功解析任何诗词，请检查源文件格式。');
    }

    const allJsContent = `
/**
 * 所有诗词合集
 */
const allPoems = ${JSON.stringify(allPoems, null, 4)};
exports.default = allPoems;
    `.trim();

    const allDestPath = path.join(destDir, 'all.js');
    fs.writeFileSync(allDestPath, allJsContent, 'utf-8');

    console.log('所有子目录已成功解析并生成到 /src/js 目录下，并合并到 all.js！');
}

module.exports = { parsePoem };