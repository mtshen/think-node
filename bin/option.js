const path = require('path');
const fs = require('fs');

// 预设内容 PATH
const PATH = path.dirname(__dirname);
const notes = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;

// 获取option.json
function getOption() {
    // 获取option.json内容
    let data = fs.readFileSync(path.join(PATH, 'option.json'), 'utf-8');

    // 定义预设内容
    const PRESET = { PATH };

    // 将 option.js 转换成可解析内容
    for (let key in PRESET) {
        let re = new RegExp('\\$\\{' + key + '\\}', 'g');
        (data = data.replace(re, PRESET[key]));
    }

    // 最终解析
    return JSON.parse(data.replace(/\\/g, '\\\\'));
}

module.exports = getOption();