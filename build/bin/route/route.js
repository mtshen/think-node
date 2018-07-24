"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 加载缓存
require("./../cache/answer");
require("./../cache/staticFile");
// 加载相关函数
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const minimatch = require("minimatch");
const think_1 = require("./../think");
const { tool } = think_1.default;
const offsprdomain = (think_1.default.option || {}).offsprdomain || false;
// nodeList接口
class NodeList {
    constructor(answer) {
        this.answer = answer;
        this.nodeList = [];
        // 载入用户设置的接口信息
        (answer.get('nodeList') || []).forEach(function (node) {
            this.nodeList.push(...node.get('nodeList'));
        }.bind(this));
        // 接口优先级排序, 当接口数量非常多时, 配置优先级能够提升一些性能
        this.nodeList.sort((nodeA, nodeB) => {
            return (nodeA.priority || 0) - (nodeB.priority || 0);
        });
    }
    // 获取接口内容
    get(pathname, request) {
        let nodeList = this.nodeList;
        for (let i = nodeList.length - 1; i >= 0; i--) {
            let nodeValue = nodeList[i];
            if (nodeValue.url === pathname &&
                (nodeValue.type ?
                    nodeValue.type.toLowerCase() === request.method.toLowerCase()
                    : true))
                return nodeValue;
        }
        return null;
    }
}
// 将host值解析成路径
function hostPares(host) {
    if (!offsprdomain)
        return '';
    let hostArr = host.split('.');
    hostArr.pop();
    hostArr.pop();
    return hostArr.sort(_ => 1).join('/');
}
// 基本路由
let route = (request, response, requestData) => {
    let reqUrlOption = url.parse(request.url, true);
    // 1. 获取url
    let { pathname, query } = reqUrlOption;
    // 获取请求类型
    let { method } = request;
    // 获取请求内容
    requestData = JSONParseData((method === 'POST' ? requestData : query));
    // 获取该域下可用的接口
    // 即使没有开启子域系统, 始终会有一个根域 www
    let answer = think_1.default.getAnswer(request.headers.host);
    if (!answer)
        return response.writeHead(404), response.end(), false;
    // 匹配首页
    if (pathname === '/')
        return getDefaultPath({ answer, response });
    // 匹配接口
    let nodeList = new NodeList(answer);
    let data = nodeList.get(pathname, request);
    if (data) {
        let { callback, ContentType = 'application/json; charset=utf-8' } = data;
        let cbFlag;
        try {
            cbFlag = callback ? callback(requestData, {
                url: pathname,
                type: method.toLowerCase(),
                request, response
            }) : true;
            // log
            think_1.default.log(pathname);
            switch (cbFlag) {
                case think_1.default.END:
                    // 内部已经执行完成, 不需要返回数据了
                    return;
                case think_1.default.NODATA:
                    // 没有数据, 返回404
                    break;
                default:
                    // 如果没有返回END或者NODATA, 则系统自动返回信息
                    let rtn = (typeof cbFlag === 'object' ? JSON.stringify(cbFlag) : cbFlag);
                    response.writeHead(200, { "Content-Type": ContentType });
                    response.end(rtn);
                    return false;
            }
            ;
        }
        catch (error) {
            think_1.default.log(pathname, error);
            console.log(`[x]${pathname}(`, think_1.default.info('InterError').error, ')');
        }
        ;
    }
    else {
        // 如果不是请求接口, 则认为是在请求文件
        // 这里接口的优先级比文件的优先级要高, 所以尽量不要让接口与文件名出线冲突
        let option = answer.get('option') || {};
        let _path = option.path;
        // TODO: 此处的 _path 是否存在错误
        let filePath = path.join(_path, hostPares(request.headers.host));
        let staticResource = option.staticResource || ['**/*.*'];
        for (let i = staticResource.length - 1; i >= 0; i--) {
            let staticPath = staticResource[i];
            // 匹配文件
            if (minimatch(pathname, staticPath)) {
                let fsName = path.join(filePath, pathname);
                fs.readFile(fsName, (err, data) => {
                    if (err) {
                        // 如果没有可用的文件, 则返回404错误
                        console.log('404:', fsName.error);
                        think_1.default.log(fsName, err);
                        response.writeHead(404);
                        response.end();
                    }
                    else {
                        // 如果匹配到了可用的文件, 则返回文件
                        let hz = path.extname(pathname);
                        response.writeHead(200, { "Content-Type": tool.contentType(hz) });
                        tool.hasUtf8(hz) && (data = data.toString());
                        response.end(data);
                        think_1.default.log(fsName);
                    }
                });
                return true;
            }
        }
    }
    // 404
    response.writeHead(404);
    response.end();
};
// 匹配首页
function getDefaultPath({ response, answer }, index = 0) {
    let option = answer.get('option');
    let filePath = answer.get('fileUrl');
    let indexArr = option.default || think_1.default.option.default;
    let _path = option.path || think_1.default.option.path || '';
    let $default = indexArr[index];
    // 如果没有设置首页文件, 返回404错误
    if (!$default) {
        response.writeHead(404);
        response.end();
        return false;
    }
    // 如果设置了, 则请求文件
    let $defaultIndex = path.join((offsprdomain ? filePath || '' : ''), _path, $default);
    fs.readFile($defaultIndex, 'utf-8', (err, data) => {
        if (err) {
            think_1.default.log($defaultIndex, err);
            const errorInfo = `${think_1.default.info('indexError1s')} ${$defaultIndex} ${think_1.default.info('indexError1n')}`;
            console.log(errorInfo.error);
            return getDefaultPath({ response, answer }, index + 1);
        }
        // 文件header信息
        let headInfo = { "Content-Type": tool.contentType(path.extname($default)) };
        // 控制台日志
        think_1.default.log($defaultIndex);
        response.writeHead(200, Object.assign({}, headInfo, think_1.default.headerInfo));
        response.end((typeof data === 'object' ? JSON.stringify(data) : data));
    });
}
;
// 将get内容转换成data
function JSONParseData(data) {
    if (!data || typeof data === 'object')
        return data;
    let result = /^\{.*\}$/.test(data) ?
        JSON.parse(data) : querystring.parse(data);
    return result;
}
;
exports.default = route;
