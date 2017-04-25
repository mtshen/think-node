const option = require('./../option');
const answer = require('./answer');
const type = require('./contentType');
const log = require("./../log/log");
const minimatch = require("minimatch");
const url = require("url");
const fs = require("fs");
const path = require("path");

// path
const $path = option.path;
const $userPath = option.user.path;

// modal
function initUserRoute(userPath = $userPath) {
    // 初始化路由
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

    // 初始化加载
    if (pathname === '/')
        return getDefaultPath(response);
    
    let data = answer.get(pathname);
    // 用户指定
    if (data) {
        let {callback} = data;
        let cbFlag = callback ? callback.call({
            url: pathname,
            type: request.method,
            request, response
        }, requestData) : true;
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
                log({
                    title: '页面请求成功',
                    url: pathname,
                    log: `${rtn}`
                });
            return 
        };
    } else {
        // 静态取值内容
        let {staticResource} = option;
        for (let i = staticResource.length - 1; i >= 0; i--) {
            let staticPath = staticResource[i];
            if (minimatch(pathname, staticPath)){
               fs.readFile($path + pathname, function(err, data) {
                    if (err) {
                        response.writeHead(404);
                        response.end();
                        log({
                            title: '页面请求失败',
                            level: 'error',
                            url: pathname,
                            log: `页面请求失败: ${$path + pathname} !`
                        });
                    } else {
                        let hz = pathname.split('.').pop();
                        response.writeHead(200, {"Content-Type": type.get('.' + hz)});
                        type.hasUtf8(hz) && (data = data.toString());
                        response.end(data);
                        log({
                            title: '页面请求成功',
                            url: pathname,
                            log: `页面请求成功: ${$path + pathname} !`
                        });
                    }
                });
                return true;
            }
        }
    }
    
    // 404
    response.writeHead(404);
	response.end();
    log({
        title: '未请求到内容',
        level: 'error',
        url: pathname,
        log: `${$path + pathname}`
    });
};

// 首页路由
function getDefaultPath(response, index = 0) {
    let $default = option.default[index];
    if (!$default) {
        response.writeHead(404);
	    response.end();
        log({
            title: '页面请求失败',
            level: 'error',
            url: '/',
            log: '首页请求失败!'
        }, true);
    }

    fs.readFile($path + $default, 'utf-8', function(err, data) {
        if (err) return getDefaultPath(response, index + 1);
        response.writeHead(200, {"Content-Type": type.get('.' + $default.split('.').pop())});
		response.end((typeof data === 'object' ? JSON.stringify(data) : data));
        log({
            title: '页面请求成功',
            level: 'log',
            url: '/',
            log: `页面请求成功: ${$path + $default} !`
        }, true);
    });
};

initUserRoute();

module.exports = route;