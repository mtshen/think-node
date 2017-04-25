var request = (function() {

    // 全局设置,可以被更改
    var commonOption = {
        url: '',
        type: 'form',
        timeout: 0,
        cache: true,
        data: {},
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        traditional: false,
        httpHeader: {},
        beforeSend: function() { return true; },
        complete: function() { },
        success: function() { },
        error: function() { },
        isStatus: true
    };

    /**
     * 判断一个变量的类型,大多数类型都能判断
     * 返回的数据类型都是小写单词
     * 如果无法确认类型则返回字符串 'unknown'
     */
    var _is = function _is(content) {
        try {
            if (content === null) return null;
            if (typeof content !== 'object') return typeof content;
            if (content.nodeType) return 'domElement';
            if (
                typeof content === 'object' &&
                Object.prototype.toString.call(content) === '[object Array]'
            ) {
                return 'array';
            }
            if (
                content.length &&
                typeof content.length === 'number' &&
                content.length > -1
            ) {
                return 'likeArray';
            }
            if (typeof content === 'object') {
                return Object.prototype.toString
                    .call(content)
                    .replace(/\[object (\w+)\]/, '$1')
                    .toLowerCase();
            }
            return 'unknown';
        } catch (e) {
            return 'unknown';
        }
    };

    /**
     * 合并2个option对象
     * 后者优先级高于前者
     */
    var __merge = function __merge(gOption = {}, option = {}) {
        var nOption = __copy(gOption);
        for (var k in option) {
            nOption[k] = option[k];
        }
        return nOption;
    };

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

        } else if (!traditional && _is(obj) === 'object') {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + '[' + name + ']', obj[ name ], traditional, add);
            }
        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    function param(a, traditional = commonOption.traditional) {
        var prefix;
        var s = [];
        var add = function(key, valueOrFunction) {

                // If value is a function, invoke it and use its return value
                var value = typeof valueOrFunction === 'function' ?
                    valueOrFunction() :
                    valueOrFunction;

                s[ s.length ] = encodeURIComponent(key) + '=' +
                    encodeURIComponent(value == null ? '' : value);
            };

        // If an array was passed in, assume that it is an array of form elements.
        if (_is(a) === 'array') {
            // Serialize the form elements
            a.forEach(a, function(v) {
                add(v.name, v.value);
            });
        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[ prefix ], traditional, add);
            }
        }
        // Return the resulting serialization
        return s.join('&');
    };

    /**
     * 深度拷贝数据
     * 改变返回的数据不会对原始数据造成影响
     * 回调函数
     * 容易造成内存泄漏
     */
    var __copy = function __copy(data) {
        try {

            switch (_is(data)) {
                case 'array':
                    var arr = [];
                    for (var i = 0, j = data.length; i < j; i++) {
                        arr.push(__copy(data[i]));
                    }
                    return arr;
                case 'likeArray':
                case 'object':
                    var obj = {};
                    for (var k in data) {
                        obj[k] = __copy(data[k]);
                    }
                    return obj;
                default:
                    return data;
            }

            return data;

        } catch (error) {
            console.info(error);
        }
    };

    function getMergeUrl(url, mosaic, data) {
        let [mosaic0, mosaic1, mosaic2] = mosaic;
        let str = [mosaic2];
        for (var k in data) if (data.hasOwnProperty(k)) {
            var _d = data[k];
            if (typeof _d === 'object') {
                _d = encodeURIComponent(JSON.stringify(_d));
            }
            str.push(k + mosaic1 + _d);
            str.push(mosaic0);
        }
        str.pop();
        return url += str.join('');
    };

    function setHttpHeader(request, headerObj) {
        for (var k in headerObj) if (headerObj.hasOwnProperty(k)) {
            request.setRequestHeader(k, headerObj[k]);
        }
    };

    function branchFn(option, data, type) {
        // 得到option常用值
        var request = new XMLHttpRequest;

        // 设置延时
        option.timeout && (request.timeout = option.timeout);

        // 发送get/post请求
        request.open(type, option.url);

        // 设置内容编码
        request.setRequestHeader('Content-Type', option.contentType);

        // 设置是否缓存
        option.cache && request.setRequestHeader('If-Modified-Since', '0');

        // 设置请求头
        setHttpHeader(request, option.httpHeader);

        // 用户自定义
        option.beforeSend(request);

        // 发送数据
        request.send(data);

        var oldTimer = +new Date();
        var packingRequest = new PackingRequest(request, {
            option: option,
            startTime: oldTimer,
            trigger: request
        });

        request.onreadystatechange = function(even) {
            requestCallback.call(this, even, option, {time: oldTimer, packingRequest: packingRequest});
        };

        return packingRequest;
    };

    var requestBranch = {
        get: function(option) {
            option.url = option.url + param(option.data);
            return branchFn(option, undefined, 'get');
        },
        post: function(option) {
            return branchFn(option, JSON.stringify(option.data), 'post');
        },
        form: function(option) {
            return branchFn(option, param(option.data), 'post');
        }
    };

    function requestCallback(even, option, conf) {
        var isStatus = option.isStatus;
        if (this.readyState === 4) {
            const newTimer = +new Date - conf.time;

            if (this.status === 200) {
                var data = requestParse(option.dataType, this.responseText);

                isStatus && !_isStatus(data) && option.error.call(conf.packingRequest, {
                    target: request,
                    error: request.statusText,
                    time: newTimer
                });

                option.success.call(conf.packingRequest, data || this.responseText, {
                    target: request,
                    time: newTimer
                });

            } else if (this.status !== 0) {

                option.error.call(conf.packingRequest, {
                    target: request,
                    error: request.statusText,
                    time: newTimer
                });

            }

            option.complete.call(conf.packingRequest, {
                target: request,
                error: request.statusText,
                time: newTimer
            });
        }
    };

    function requestParse(type, data) {
        try {
            var requestParseReturn = data;

            switch (type) {
                case 'json':
                    (typeof data === 'string') && (requestParseReturn = JSON.parse(data));
                    break;
                case 'html':
                    if (typeof data === 'string') {
                        var box = document.createElement('request');
                        box.innerHTML = data;
                        requestParseReturn = box;
                    }
                case 'string':
                default:
                    break;
            }
            return requestParseReturn;
        } catch (error) {
            return false;
        }
    }

    function PackingRequest(request, option) {
        this.trigger = request;
        this._option = option;
        this.option = option.option;
        this.startTime = option.startTime;
    };

    /**
     * 分支 - post, get, form 的切换
     */
    function branch(option) {
        var lawfulOption = __merge(commonOption, option);
        var branchFunction = requestBranch[lawfulOption.type];
        if (branchFunction) return branchFunction(lawfulOption);
        return false;
    };

    /**
     * 检查option是否合法
     */
    function main(url, type, data, callback) {
        var option = {};
        typeof url === 'string' && (option.url = url);
        typeof url === 'object' && (option = url);
        typeof type === 'string' && (option.type = type);
        data && (option.data = data);
        callback && (option.callback = callback);
        branch(option);
    };

    /**
     * 检查对象中的status值是否不为0, 如果为0抛出异常
     */
    function _isStatus(json = {}) {
        if (typeof json === 'string') {
            json.startsWith('<!DOCTYPE html>') &&
                (location.href = '/login.html');
            console.log('JSON =|> ', json);
            return false;
        }

        if (json.status == 0) {
            swal ? swal({
                title: '',
                text: json.info,
                type: 'error',
                timer: 1000,
                showCancelButton: false
            }) : alert(json.info);
            return false;
        }

        return true;
    };

    main.post = function(url, data, callback) {
        var option = {type: 'post'};
        typeof url === 'string' && (option.url = url);
        typeof url === 'object' && (option = url);
        data && (option.data = data);
        callback && (option.callback = callback);
        main(option);
    };

    main.get = function(url, data, callback) {
        var option = {type: 'get'};
        typeof url === 'string' && (option.url = url);
        typeof url === 'object' && (option = url);
        data && (option.data = data);
        callback && (option.callback = callback);
        main(option);
    };

    main.option = commonOption;

    return main;
})();
