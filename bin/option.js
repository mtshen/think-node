const fs = require('fs');

// 预设内容 PATH
let PATH = __dirname.replace('/', '\\').split('\\');
PATH.pop();
PATH = PATH.join('\\\\');

// 获取option.json内容
let data = fs.readFileSync(`${PATH}/option.json`, 'utf-8').replace(/\/\/.*\r?\n?/g, '');

// 定义预设内容
const PRESET = { PATH };

// 将 option.js 转换成可解析内容
for (var key in PRESET) {
    let re = new RegExp('\\$\\{' + key + '\\}', 'g');
    (data = data.replace(re, PRESET[key]));
}

// 解析
const option = JSON.parse(data);

// 内存回收
data = null;
PATH = null;

module.exports = option;