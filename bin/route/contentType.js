const CONTENTTYPE = require('./contentType.json');

/**
 * 获取文件对应的contentType值
 * @param {string} path 
 */
function get(path) {
    for (let key in CONTENTTYPE)
        if (path.endsWith(key))
            return CONTENTTYPE[key];
    return CONTENTTYPE['+type'];
};

// 检查文件后缀, 是否该文件应该返回utf-8格式
function hasUtf8(str) {
    return CONTENTTYPE['+utf8'].indexOf(str) > -1;
};

module.exports = {get, hasUtf8};