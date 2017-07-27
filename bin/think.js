const path = require('path');
const colors = require('colors');

const think = {};
const tplDefineArr = [];

// 控制台颜色
colors.setTheme({file: 'grey', error: 'red', true: 'green', data: 'blue', inter: 'cyan', warn: 'yellow', start: 'magenta'});
__ISMASTER && console.log('load think');

think.frontPath = function(url) {
    let urlArr = path.normalize(url).split(path.sep);
    return urlArr.slice(0, -1).join(path.sep);
}

// 常量
think.END = Symbol('end');
think.NODATA = Symbol('nodata');
think.DIR = think.frontPath(__dirname);

// 请求头默认
think.headerInfo = [];

// 设置请求头
think.header = (responeHeaders) => think.headerInfo.push(responeHeaders);

// 默认时区
think.timeInfo = 'GMT';

// 设置时区
think.timeZone = (info) => (think.timeInfo = info);

// 设置option, 失败返回false, 成功返回true
think.opt = (key, value) => {
    if (typeof key !== 'string' || value === undefined) return false;
    let keyPath = key.toLowerCase().split('_');
    let optVal = think.option;
    
    for (let i = 0, j = keyPath.length - 1; i < j; i ++) {
        optVal = optVal[keyPath[i]];
        if (!optVal) return false;
    }

    let popPath = keyPath.pop();

    if (typeof optVal === 'object')
        return optVal[popPath] = value, true;
    else
        return false;
}

// define 定义内容
think.define = (key, value, url = '*') => {
    if (typeof key === 'string' && typeof url === 'string')
        return tplDefineArr.push({key, value, url}), true;
    else if (!key) 
        return tplDefineArr;
    else
        return false;
}

// 语言默认为中文
think.language = 'en';

// 设置语言
think.lang = (l) => {
    think.language = l;
}

// load功能
let loadList = [];

think.load = (callback) => {
    typeof callback === 'function' &&
        loadList.push(callback);
};

// 执行load列表
think.onload = () => loadList.forEach((callback) => callback());


module.exports = think;