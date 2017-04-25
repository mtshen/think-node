const fs = require('fs');

// PATH
let PATH = __dirname.replace('/', '\\').split('\\');
PATH.pop();
PATH = PATH.join('\\\\');
let data = fs.readFileSync(`${PATH}/option.json`, 'utf-8').replace(/\/\/.*\r?\n?/g, '');

// 预设内容
const PRESET = { PATH };

for (var key in PRESET) {
    let re = new RegExp('\\$\\{' + key + '\\}', 'g');
    (data = data.replace(re, PRESET[key]));
}

// 初始化全局变量
global.END = Symbol('end');
global.NODATA = Symbol('nodata');
module.exports = JSON.parse(data);