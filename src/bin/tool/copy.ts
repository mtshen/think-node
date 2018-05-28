/*
    copy 一个对象, 深度的拷贝需要谨慎
    依赖于Think.tool.is函数
 */
export let copy = function(copyObject) {
	switch (typeof copyObject) {
        case 'object':
            switch (is(copyObject)) {
                case 'null':
                    return copyObject;
                case 'array':
                    return copyObject.map(function(values) {
                        return copy(values);
                    });
                case 'likeArray':
                case 'object':
                    let copyobj = {};
                    for (let key in copyObject) 
                        copyobj[key] = copy(copyObject[key]);
                    return copyobj;
            }
        default:
            return copyObject;
    }
};

/**
 * 判断一个变量的类型,大多数类型都能判断
 * 返回的数据类型都是小写单词
 * 如果无法确认类型则返回字符串 'unknown'
 */
export let is = (content: any): string => {
    if (typeof content !== 'object')
        return typeof content;
    if (content === null)
        return 'null';
    if (content.nodeType)
        return 'element';
    if (typeof content === 'object' && Object.prototype.toString.call(content) === '[object Array]')
        return 'array';
    if (content.length && typeof content.length === 'number' && content.length > -1)
        return 'likeArray';
    if (typeof content === 'object') 
        return Object.prototype.toString.call(content)
            .replace(/\[object (\w+)\]/, '$1').toLowerCase();
    
    return 'unknown';
};