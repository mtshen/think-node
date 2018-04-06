"use strict";
/*
    paramForm.js 编译与反编译from类型数据
*/
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 反编译from类型数据
 * 将一串from类型的字符串反编译为json数据
 * @param text from数据
 */
exports.paramForm = (text) => {
    // 设置分隔符
    const split = '&', split2 = '=';
    // 解析为文本
    let decodeText = decodeURIComponent(text);
    // 分割文本
    let decodeArr = decodeText.split(split);
    let paramJSONData = [];
    // 解析
    decodeArr.forEach(function (decode) {
        // 分割 =, 如 a=1 分割为a,1
        let [keyDecode, valueDecode] = decode.split(split2);
        let value = '', key = paramJSONData, keyProto = [paramJSONData], nameProto = [], valNumber;
        // 查询value
        if (Number(valueDecode))
            valNumber = Number(valueDecode);
        else if (valueDecode)
            valNumber = valueDecode;
        // 查询key
        let keyArr = keyDecode.replace(/\[([a-z0-9_$]*)\]/g, '.$1').split('.');
        let keyN = keyArr.pop();
        keyArr.forEach(function (kName, index) {
            let isNumber = !isNaN(Number(kName));
            let keyData = key[kName];
            index && keyProto.push(keyProto[keyProto.length - 1][nameProto[nameProto.length - 1]]);
            nameProto.push(kName);
            let kp = keyProto[keyProto.length - 1];
            let kp2 = keyProto[keyProto.length - 2];
            let kn2 = nameProto[nameProto.length - 2];
            if (!isNumber) {
                if (Array.isArray(kp)) {
                    if (kp === paramJSONData) {
                        paramJSONData = paramArray(paramJSONData);
                        key = paramJSONData;
                        keyProto = [paramJSONData];
                    }
                    else {
                        kp2[kn2] = paramArray(kp);
                        key = kp2[kn2];
                        keyProto[keyProto.length - 1] = kp2[kn2];
                    }
                }
            }
            key = keyData || (key[kName] = []);
        });
        let kpop = keyProto.pop();
        let vpop = nameProto.pop();
        key = kpop[vpop] || paramJSONData;
        if (keyN) {
            let isNumber = !isNaN(Number(keyN));
            if (!isNumber) {
                if (Array.isArray(key)) {
                    if (key === paramJSONData) {
                        paramJSONData = paramArray(paramJSONData);
                        key = paramJSONData;
                        keyProto = [paramJSONData];
                    }
                    else {
                        kpop[vpop] = paramArray(key);
                        key = kpop[vpop];
                    }
                }
            }
            key[keyN] = valNumber;
        }
        else {
            // kName 不存在, 则始终是数组成员
            // TODO 这里可能有错误！！
            if (!key) {
                key = nameProto;
            }
            key.push(valNumber);
        }
    });
    return paramJSONData;
};
function paramArray(array) {
    let object = {};
    array.forEach((v, i) => {
        object[i] = v;
    });
    return object;
}
function buildParams(prefix, obj, traditional, add) {
    var name;
    if (Array.isArray(obj)) {
        obj.forEach(function (v, i) {
            if (traditional || /\[\]$/.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, v);
            }
            else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams.call(this, prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']', v, traditional, add);
            }
        });
    }
    else if (!traditional && this.is(obj) === 'object')
        for (name in obj)
            buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
    else
        add(prefix, obj);
}
exports.stringifyForm = function (data, traditional = false) {
    var prefix;
    var s = [];
    var add = function (key, valueOrFunction) {
        // If value is a function, invoke it and use its return value
        var value = typeof valueOrFunction === 'function' ?
            valueOrFunction() :
            valueOrFunction;
        s[s.length] = encodeURIComponent(key) + '=' +
            encodeURIComponent(value == null ? '' : value);
    };
    // If an array was passed in, assume that it is an array of form elements.
    if (this.is(data) === 'array')
        data.forEach(data, function (v) {
            add(v.name, v.value);
        });
    else
        for (prefix in data)
            buildParams.call(this, prefix, data[prefix], traditional, add);
    return s.join('&');
};
