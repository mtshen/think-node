"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 一些测试常量
const STRING_LIST = ["pillow No Smoking", "toothpaste Parking", "dance floor", "toothbrush No Flash", "toothpick Entrance", "playground", "Exit", "runway", "television Fire Alarm", "traffic", "lights", "crossroads", "supermarket", "post", "office", "parking", "lot", "clothing", "store", "toilet", "account", "address", "ads", "balance", "banner", "bet", "bonus", "canel", "cash", "check"];
let is = (content) => {
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
// 随机生产string类型测试数据
function getTestString(str, option) {
    switch (is(option)) {
        case 'string':
            return option;
        case 'array':
            return option[randomNumber(option.length - 1)];
        case 'function':
            return option(str);
        case 'object':
            return getTestString(str, option.data);
        default:
            return STRING_LIST[randomNumber(STRING_LIST.length - 1)];
    }
}
// 随机生成number类型测试数据
function getTestNumber(num, option) {
    switch (is(option)) {
        case 'number':
            return option;
        case 'array':
            return option[randomNumber(option.length - 1)];
        case 'function':
            return option(num);
        case 'object':
            const { min, max, data } = option;
            if (min) {
                return randomNumber(min, max);
            }
            else {
                return getTestNumber(num, option.data);
            }
        default:
            return randomNumber();
    }
}
// 随机生成布尔类型测试数据
function getTestBoolean(bool, option) {
    switch (is(option)) {
        case 'boolean':
            return option;
        case 'array':
            return option[randomNumber(option.length - 1)];
        case 'function':
            return option(bool);
        case 'object':
            return getTestBoolean(bool, option.data);
        default:
            return bool;
    }
}
// 随机生成空值
function getTestNull(nnull, option) {
    switch (is(option)) {
        case 'function':
            return option(nnull);
        default:
            return null;
    }
}
// 随机生成list数据
function getTestList(list, option) {
    switch (is(option)) {
        case 'array': return option;
        case 'function': return option(list);
        case 'object':
            const { minLength, maxLength, child } = option;
            const listData = list[0];
            const newList = [];
            for (let i = randomNumber(minLength, maxLength); i > 0; i--) {
                newList.push(randomTestData(listData, child));
            }
            return newList;
        default:
            return list;
    }
}
/**
 * 生成一个随机数介于 min 与 max 之间
 * 生产的随机精度会取min 与 max 中精度最大的值作为参考
 * @param min 随机数下限
 * @param max 随机数上限
 */
let randomNumber = function (min, max) {
    if (min && max) {
        const minSplit = ('' + min).split('.');
        const maxSplit = ('' + max).split('.');
        const minAccuracy = (minSplit[1] ? minSplit[1].length : 0);
        const maxAccuracy = (maxSplit[1] ? maxSplit[1].length : 0);
        const multiple = Math.pow(10, Math.max(minAccuracy, maxAccuracy));
        min = min * multiple;
        max = max * multiple;
        const num = parseInt(`${Math.random() * (max - min + 1)}`);
        return (min + num) / multiple;
    }
    else if (min) {
        const minSplit = ('' + min).split('.');
        const minAccuracy = (minSplit[1] ? minSplit[1].length : 0);
        const multiple = Math.pow(10, minAccuracy);
        min = min * multiple;
        const num = parseInt(`${Math.random() * (min + 1)}`);
        return num / multiple;
    }
    else {
        return parseInt(`${Math.random() * 100}`);
    }
};
/**
 * 随机生成测试数据
 * 如果是简单类型如 String / Number / Boolean 可以简写为 Array/Value/Function
 * Number: 如果设置{min, max} 则为限定取值
 * Array: 如果设置{minLength, maxLength} 则为限定长度
 * @param reference 数据模板
 * @param config 模板参数限定
 */
let randomTestData = function (reference, config = {}) {
    // 由于该函数只能处理object类型包裹的数据, 
    // 如果遇到非object类型数据则包裹一层再次处理, 并返回结果
    if (typeof reference !== 'object') {
        const $reference = { reference }, $config = { reference: config };
        const $data = randomTestData($reference, $config);
        return $data.reference;
    }
    const keyList = Object.keys(reference);
    const randomdata = {};
    // 获取一个随机生产内容
    keyList.forEach((key) => {
        const data = reference[key];
        const type = is(data);
        const conf = config[key];
        switch (type) {
            case 'string':
                randomdata[key] = getTestString(data, conf);
                break;
            case 'number':
                randomdata[key] = getTestNumber(data, conf);
                break;
            case 'boolean':
                randomdata[key] = getTestBoolean(data, conf);
                break;
            case 'undefined':
            case 'null':
                randomdata[key] = getTestNull(data, conf);
                break;
            case 'array':
                randomdata[key] = getTestList(data, conf);
                break;
            case 'object':
                randomdata[key] = randomTestData(data, conf);
                break;
            default: break;
        }
    });
    return randomdata;
};
/**
 * 测试实例
 */
class TestModel {
    constructor(model, option) {
        this.$model = model;
        this.$option = option;
    }
    setModel(model) {
        this.$model = model;
        return this;
    }
    setOption(option) {
        this.$option = option;
        return this;
    }
    random() {
        return randomTestData(this.$model, this.$option);
    }
}
exports.TestModel = TestModel;
