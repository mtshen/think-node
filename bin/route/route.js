// 加载缓存
require('./../cache/answer');
require("./../cache/staticFile");

// 加载相关函数
const minimatch = require("minimatch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require('querystring');
const tool = Think.tool;
const offsprdomain = (Think.option || {}).offsprdomain || false;

// nodeList接口
class NodeList {
    constructor(answer) {
        this.answer = answer;
        this.nodeList = [];
        (answer.get('nodeList') || []).forEach(function(node) {
            this.nodeList.push(...node.get('nodeList'));
        }.bind(this));
        this.nodeList.sort((nodeA, nodeB) => {
            return (nodeA.priority || 0) - (NodeB.priority || 0);
        });
    }

    get(pathname, request) {
        let nodeList = this.nodeList;
        for (let i = nodeList.length - 1; i >= 0; i--) {
            let nodeValue = nodeList[i];
            if (nodeValue.url === pathname && 
                (nodeValue.type ? 
                    nodeValue.type.toLowerCase() === request.method.toLowerCase()
                    : true)
            ) return nodeValue;
        }
        return null;
    }
}

// 将host值解析成路径
function hostPares(host) {
    if (!offsprdomain) return '';
    let hostArr = host.split('.');
    hostArr.pop();hostArr.pop();
    return hostArr.sort(()=>true).join('/');
}

// 基本路由
let route = (request, response, requestData) => {
    let reqUrlOption = url.parse(request.url, true);
    let {pathname, query} = reqUrlOption;
    // 1. 获取url
    let {method} = request;
    requestData = JSONParseData((method === 'POST' ? requestData : query));
    let answer = Think.getAnswer(request.headers.host);
    if (!answer) return response.writeHead(404), response.end(), false;
    // 4. 匹配首页
    if (pathname === '/') return getDefaultPath({answer, response});
    // 5. 匹配接口
    let nodeList = new NodeList(answer);
    let data = nodeList.get(pathname, request);
    if (data) {
        let {callback, ContentType = 'application/json; charset=utf-8'} = data;
        let cbFlag;
        try {
            cbFlag = callback ? callback(requestData, {
                url: pathname,
                type: method.toLowerCase(),
                request, response
            }) : true;

            // log
            Think.log(pathname);

            switch (cbFlag) {
                case Think.END:
                    // 内部已经执行完成, 不需要返回数据了
                    return;
                case Think.NODATA:
                    // 没有数据, 返回404
                    break;
                default:
                    // data数据
                    let rtn = (typeof cbFlag === 'object' ? JSON.stringify(cbFlag) : cbFlag);
                    response.writeHead(200, {"Content-Type": ContentType});
                    response.end(rtn);
                    return false;
            };
        } catch (error) {
            Think.log(pathname, error);
            console.log(pathname.error),
            console.log(ThinkInfo('InterError').error);
        };

    } else {
        let option = answer.get('option') || {};
        let _path = option.path;
        // 此处的 _path 是否存在错误
        let filePath = path.join(_path, hostPares(request.headers.host)); 
        let staticResource = option.staticResource || ['**/*.*'];
        for (let i = staticResource.length - 1; i >= 0; i--) {
            let staticPath = staticResource[i];
            if (minimatch(pathname, staticPath)){
                let fsName = path.join(filePath, pathname);
                fs.readFile(fsName, (err, data) => {
                    if (err) {
                        console.log('404:', fsName.error);
                        Think.log(fsName, err);
                        response.writeHead(404);
                        response.end();
                    } else {
                        let hz = path.extname(pathname);
                        response.writeHead(200, {"Content-Type": tool.contentType(hz)});
                        tool.hasUtf8(hz) && (data = data.toString());
                        response.end(data);
                        Think.log(fsName);
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

// 首页路由
function getDefaultPath({response, answer}, index = 0) {
    let option = answer.get('option');
    let filePath = answer.get('fileUrl');
    let indexArr = option.default || Think.option.default;
    let _path = option.path || Think.option.path || '';
    let $default = indexArr[index];
    
    if (!$default) {
        response.writeHead(404);
	    response.end();
        return false;
    }

    let $defaultIndex = path.join((offsprdomain ? filePath || '' : ''), _path, $default);

    fs.readFile($defaultIndex, 'utf-8', (err, data) => {
        if (err) {
            Think.log($defaultIndex, err);
            console.log(`${ThinkInfo('indexError1s')} ${$defaultIndex} ${ThinkInfo('indexError1n')}`.error);
            return getDefaultPath({response, answer}, index + 1);
        }
        let headInfo = {"Content-Type": tool.contentType(path.extname($default))};
        Think.log($defaultIndex);
        Think.headerInfo.length && 
            Think.headerInfo.forEach((value) => {
                valInfo = value.split(':');
                headInfo[valInfo[0]] = valInfo[1];
            });
        response.writeHead(200, headInfo);
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

module.exports = route; 