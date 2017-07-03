/**
 * 判断一个变量的类型,大多数类型都能判断
 * 返回的数据类型都是小写单词
 * 如果无法确认类型则返回字符串 'unknown'
 */
global.Think.tool.is = (content) => {
    if (typeof content !== 'object')
        return typeof content;
    if (content === null)
        return null;
    if (content.nodeType)
        return 'domElement';
    if (typeof content === 'object' && Object.prototype.toString.call(content) === '[object Array]')
        return 'array';
    if (content.length && typeof content.length === 'number' && content.length > -1)
        return 'likeArray';
    if (typeof content === 'object') 
        return Object.prototype.toString.call(content)
            .replace(/\[object (\w+)\]/, '$1').toLowerCase();
    
    return 'unknown';
};
