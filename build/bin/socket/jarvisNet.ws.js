"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jarvisId_1 = require("./jarvisId");
// 数据传输规则/协议
const jarvisReg = /^jarvis\*(\w+)\*([\w\\\/\.]+)\*([0-9]{0,3}):(.{0,})$/;
class JarvisNet {
    /**
     * 初始化属性
     * @param {*} netNode net实例
     * @param {*} callback 初始化结束, 接收到发送的option接口的内容后的回调函数
     */
    constructor(netNode, callback) {
        // 属性
        this.netNode = netNode;
        this.urls = [];
        this.attr = {};
        this.netWaitList = [];
        this.receiveList = [];
        // 初始化jarvisNet 模块
        this.init(callback);
    }
    // 初始化链接
    init(callback) {
        let { 
        // 内部方法
        netNode, parseAgreement, stringify, 
        // 数据
        urls, netWaitList, receiveList } = this;
        // 当net断开连接的回调
        netNode.on('close', function () {
            let outCallback = this.outCallback;
            outCallback && outCallback(netNode);
        }.bind(this));
        // 当出现某些异常时
        netNode.on('error', function (error) {
            let tryCallback = this.tryCallback;
            tryCallback && tryCallback(error);
        }.bind(this));
        // 当net获取到数据的回调函数
        netNode.on('message', function (news) {
            let { id, url, data, state } = parseAgreement(news.toString());
            // 如果失败, 抛出异常
            if (!id) {
                return console.log('jarvis: illegal content! =>', news.toString());
            }
            // url处理函数
            if (urls.indexOf(url) !== -1) {
                // 处理接收函数
                for (let i = receiveList.length - 1; i >= 0; i--) {
                    const receiveData = receiveList[i];
                    if (receiveData.url === url) {
                        let receiveFn = _ => _;
                        if (state === '001') {
                            receiveFn = function (receiveData = {}) {
                                // 假设这样做可以将中文文本安全的传输
                                // 并未经过测试!!
                                const bufferContent = new Buffer(stringify(id, 'receive', receiveData, '000'), 'utf8');
                                netNode.send(bufferContent.toString());
                                receiveFn = null;
                            };
                        }
                        receiveData.callback(receiveFn, JSONparse(data));
                    }
                }
            }
            else {
                // 处理响应函数
                for (let i = netWaitList.length - 1; i >= 0; i--) {
                    const netWaitData = netWaitList[i];
                    let { $callback } = netWaitData;
                    if (netWaitData.id === id) {
                        $callback && $callback(JSONparse(data));
                        netWaitList.splice(i, 1);
                        return;
                    }
                }
            }
        }.bind(this));
        // 当连接到设备时, 对方设备初始化完成
        this.send('option', function (data) {
            this.id = data.id;
            callback.call(this, data);
        }.bind(this));
    }
    // 设置某个数据
    data(key, value) {
        let { attr } = this;
        if (typeof value === undefined) {
            return key ? attr[key] : attr;
        }
        else {
            return attr[key] = value;
        }
    }
    // 设置断开连接的回调函数
    close(callback) {
        this.outCallback = callback;
    }
    // 设置
    error(callback) {
        this.tryCallback = callback;
    }
    // 获取jarvis格式的数据
    stringify(id, url, json, state) {
        typeof json === 'string' || (json = JSON.stringify(json));
        return `jarvis*${id}*${url}*${state}:${json}`;
    }
    // 解析jarvis数据
    /**
     * 传入一个字符串进行解析, 最后一定返回4个值
     * str, id, url, data
     * str 始终返回原始数据, 当解析失败时, 其他4个值返回undefined
     * @param {*} data 需要解析的字符串
     */
    parseAgreement(jarvisData) {
        const $jarvisData = jarvisReg.exec(jarvisData);
        let str, id, url, data, state;
        if ($jarvisData) {
            // 成功
            [str, id, url, state, data] = $jarvisData;
        }
        else {
            // 失败
            [str, id, url, state, data] = [jarvisData, , , , ,];
        }
        return { str, id, url, state, data };
    }
    // 发送数据, 只发送数据, 不负责响应
    // data, callback 为选填
    send(url, data, callback) {
        const id = jarvisId_1.default();
        let $data, $callback;
        switch (typeof data) {
            case 'undefined':
                $data = '';
                break;
            case 'function':
                $callback = data;
                break;
            default:
                $data = data;
                break;
        }
        if (typeof callback === 'function') {
            $callback = callback;
        }
        if ($callback) {
            this.netNode.send(this.stringify(id, url, $data, '001'));
            this.netWaitList.push({ id, $callback });
        }
        else {
            this.netNode.send(this.stringify(id, url, $data, '002'));
        }
    }
    // 配置响应
    receive(url, callback) {
        this.urls.push(url);
        this.receiveList.push({ url, callback });
    }
}
function JSONparse(data) {
    let json = null;
    try {
        json = JSON.parse(data);
    }
    catch (error) {
        json = null;
    }
    return json;
}
exports.default = JarvisNet;
