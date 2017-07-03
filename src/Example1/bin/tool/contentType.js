const CONTENTTYPE = require('./contentType.json');

/**
 * 获取文件对应的contentType值
 * @param {string} fileName 文件名或文件路径 
 */
Think.tool.contentType = (fileName) => {
    for (let key in CONTENTTYPE)
        if (fileName.endsWith(key))
            return CONTENTTYPE[key];
    return CONTENTTYPE['+type'];
};

// 检查文件后缀, 是否该文件应该返回utf-8格式
Think.tool.hasUtf8 = (fileName) => {
    return CONTENTTYPE['+utf8'].indexOf(fileName) > -1;
};
