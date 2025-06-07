const fs = require('fs');
const path = require('path');
const poemDir = path.join(__dirname, '../src/poem');

function renameDir(dir){
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            // 读取 file 的第一行内容
            const filePath = path.join(dir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const firstLine = fileContent.split('\n')[0];

            // 获取文件名称与扩展名
            const fileName = path.basename(filePath, path.extname(filePath));
            const extName = path.extname(filePath);
            console.log(fileName, extName);

            // 如果 fileName 由纯数字构成：
            if (/^\d+$/.test(fileName)) {
                // 重命名文件
                const newFilename = fileName + firstLine + extName;
                const newFilePath = path.join(dir, newFilename);
                fs.renameSync(filePath, newFilePath);
                console.log(`rename ${filePath} to ${newFilePath}`);
            }
        });
    });
}

renameDir(path.join(poemDir, 'junior'));