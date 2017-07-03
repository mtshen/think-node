/*
    copy 一个对象, 深度的拷贝需要谨慎
    依赖于Think.tool.is函数
    如果大数据量中进行数据拷贝, 请使用copyLarge
 */
Think.tool.copy = function(copyObject) {
	switch (typeof copyObject) {
        case 'object':
            if (copyObject === null) return copyObject;
            switch (this.is(copyObject)) {
                case 'array':
                    return copyObject.map(function(values) {
                        return this.copy(values);
                    }.bind(this));
                case 'likeArray':
                case 'object':
                    let copyobj = {};
                    for (let key in copyObject) 
                        copyobj[key] = this.copy(copyObject[key]);
                    return copyobj;
            }
        default:
            return copyObject;
    }
}.bind(global.Think.tool);

/*
    只能拷贝复杂内容, 相应的速度对慢
 */
global.Think.tool.copyLarge = function (copyObject) {
    let obj = {value: copyObject};
    return JSON.parse(JSON.stringify(obj)).value;
}.bind(global.Think.tool);