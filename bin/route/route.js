const option = require('./../option');
const answer = require('./answer');
const type = require('./contentType');
const log = require("./../log/log");
const staticFile = require("./../cache/staticFile");
const minimatch = require("minimatch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require('querystring');

// path
const $path = option.path;
const $userPath = option.user.path;

function initUserRoute(userPath = $userPath) {
    fs.readdir(userPath, function(err, stat) {
        if (err) return;
        stat.forEach(function(file) {
            let fileName = path.join(userPath, file);
            fs.stat(fileName, function (err, stats) {
                if (err) return;
                switch (true) {
                    case stats.isFile():
                        return require(fileName);
                    case stats.isDirectory():
                        return initUserRoute(fileName);
                }
            })
        });
    });
};

// 基本路由
let route = (request, response, requestData) => {
    const reqUrlOption = url.parse(request.url, true);
    const {pathname, query} = reqUrlOption;
    const {method} = request;
    // 解析data
    requestData = JSONParseData((method === 'POST' ? requestData : query));
    // 初始化加载
    if (pathname === '/')
        return getDefaultPath(response);
    
    let data = answer.get(pathname);
    // 用户指定
    if (data) {
        let {callback} = data;
        let cbFlag;
        try {
            cbFlag = callback ? callback(requestData, {
                url: pathname,
                type: method,
                request, response
            }) : true;
        } catch (error) {
            return console.log('出现了一个异常!', error);
        };
        switch (cbFlag) {
            case END:
                // 内部已经执行完成, 不需要返回数据了
            return;
            case NODATA:
                // 没有数据, 返回404
            break;
            default:
                // data数据
                let rtn = (typeof cbFlag === 'object' ? JSON.stringify(cbFlag) : cbFlag);
                response.writeHead(200, {"Content-Type": data.ContentType || "application/json; charset=utf-8"});
                response.end(rtn);
                log.send(request, response, true);
            return 
        };
    } else {
        // 静态取值内容
        let {staticResource} = option;
        for (let i = staticResource.length - 1; i >= 0; i--) {
            let staticPath = staticResource[i];
            if (minimatch(pathname, staticPath)){
                let fsName = $path + pathname;
                staticFile(fsName, function(err, data) {
                    if (err) {
                        response.writeHead(404);
                        response.end();
                        log.send(request, response, false);
                    } else {
                        let hz = path.extname(pathname);
                        response.writeHead(200, {"Content-Type": type.get(hz)});
                        type.hasUtf8(hz) && (data = data.toString());
                        response.end(data);
                        log.send(request, response, true);
                    }
                });
                return true;
            }
        }
    }
    
    // 404
    response.writeHead(404);
	response.end();
    log.send(request, response, false);
};

// 首页路由
function getDefaultPath(response, index = 0) {
    let $default = option.default[index];
    if (!$default) {
        response.writeHead(404);
	    response.end();
        return false;
    }
    console.log($path + $default);
    fs.readFile($path + $default, 'utf-8', function(err, data) {
        if (err) return getDefaultPath(response, index + 1);
        response.writeHead(200, {"Content-Type": type.get(path.extname($default))});
		response.end((typeof data === 'object' ? JSON.stringify(data) : data));
    });
};

// 将get内容转换成data
function JSONParseData(data) {
    if (!data || typeof data === 'object') return data;
    let result = /^\{.*\}$/.test(data) ?
        JSON.parse(data) : querystring.parse(data);
    return result;
};

initUserRoute();

module.exports = route; 