/*
    paramForm.js 反编译表单数据
    将深度解析后台返回的表单内容
*/ 
let {tool} = Think;

Think.tool.paramForm = (text, split = '&', split2 = '=') => {
    let decodeText = decodeURIComponent(text);
    let decodeArr = decodeText.split(split);
    let paramJSONData = [];
    decodeArr.forEach(function(decode) {
        let [keyDecode, valueDecode] = decode.split(split2);
        let value = '', key = paramJSONData, keyProto = [paramJSONData], nameProto = [];
        
        // 查询value
        if (Number(valueDecode))
            value = Number(valueDecode);
        else if (valueDecode) 
            value = valueDecode;

        // 查询key
        let keyArr = keyDecode.replace(/\[([a-z0-9_$]*)\]/g, '.$1').split('.');
        let keyN = keyArr.pop();
        keyArr.forEach(function(kName, index) {
            
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
                            keyProto =[paramJSONData];
                        } else {
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
                            keyProto =[paramJSONData];
                        } else {
                            kpop[vpop] = paramArray(key);
                            key = kpop[vpop];
                        }
                    }
                }
            key[keyN] = value;
        } else {
            // kName 不存在, 则始终是数组成员
            if (!key) {
                !keyProto[nameProto] && (keyProto[nameProto] = []);
                key = keyProto[nameProto];
            }
            key.push(value);
        }
    });
    return paramJSONData;
}

function paramArray(array) {
    let object = {};
    array.forEach((v, i) => {
        object[i] = v;
    });
    return object;
}



function buildParams(prefix, obj, traditional = commonOption.traditional, add) {
    var name;
    if (Array.isArray(obj)) {
        obj.forEach(function(v, i) {
            if (traditional || /\[\]$/.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, v);
            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(
                    prefix + '[' + (typeof v === 'object' && v != null ? i : '') + ']',
                    v,
                    traditional,
                    add
                );
            }
        });

    } else if (!traditional && tool.is(obj) === 'object')
        for (name in obj) buildParams(prefix + '[' + name + ']', obj[ name ], traditional, add);
    else
        add(prefix, obj);
}

Think.tool.stringifyForm = function (data, traditional = false) {
    var prefix;
    var s = [];
    var add = function(key, valueOrFunction) {

            // If value is a function, invoke it and use its return value
            var value = typeof valueOrFunction === 'function' ?
                valueOrFunction() :
                valueOrFunction;

            s[s.length] = encodeURIComponent(key) + '=' +
                encodeURIComponent(value == null ? '' : value);
        };

    // If an array was passed in, assume that it is an array of form elements.
    if (tool.is(data) === 'array')
        data.forEach(data, function(v) {
            add(v.name, v.value);
        });
    else
        for (prefix in data)
            buildParams(prefix, data[ prefix ], traditional, add);
    
    return s.join('&');
};