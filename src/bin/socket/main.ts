import * as net from 'net';
import JarvisNet from './jarvisNet';
import JarvisNeWS from './jarvisNet.ws';
import think from './../think';

interface SocketOption {
    port: number;
    host: string;
    name: string;
}

class Jarvis {
    private socketList: object;
    private opt: string;
    private server;
    private enterCallback: Function;
    private leaveCallback: Function;
    private errorCallback: Function;
    private receiveList: any[];

    // 初始化jarvis
    constructor(listen: number, ws) {
        this.socketList = {};
        this.receiveList = [];
        this.opt = '{"id": "jarvis"}';

        // 这里需要做一个判断, 
        // 当与web端进行通信时, 需要第二个参数ws
        // 这里是基于ws实现的, 但是对于不适用jarvis的用户来说, ws基本上是无用的
        let server;
        if (ws) {
            server = new ws.Server({port: listen});
        } else {
            server = net.createServer().listen(listen);
        }

        server.on('connection', function(netNode) {
            let JarvisClient = ws ? JarvisNeWS : JarvisNet;
            let client = new JarvisClient(netNode, function (data) {
                // 用户进入, 记录用户id
                let {enterCallback} = this;

                this.socketList[data.id] = client;
                enterCallback && enterCallback(data, client);
            }.bind(this));
            
            // 自动返回请求option时所返回的数据
            client.receive('option', function(receive) {
                receive(this.opt);
            }.bind(this));

            // 离开事件
            client.close(function() {
                let {socketList, leaveCallback} = this;
                delete socketList[client.id];
                leaveCallback && leaveCallback(client);
            }.bind(this));

            // 异常事件
            client.error(function() {
                let {socketList, leaveCallback, errorCallback} = this;
                delete socketList[client.id];
                leaveCallback && leaveCallback(client);
                errorCallback && errorCallback(client);
            }.bind(this));

            let {receiveList} = this;

            // 添加接口
            for (let i = receiveList.length - 1; i >=0; i--) {
                let {socketPath, callback} = receiveList[i];
                client.receive(socketPath, callback);
            }
        }.bind(this));

        this.server = server;
    }

    option(option: object) {
        this.opt = JSON.stringify(option);
        return this;
    }

    enter(callback: Function) {
        this.enterCallback = callback;
        return this;
    }

    leave(callback: Function) {
        this.leaveCallback = callback;
        return this;
    }

    error(callback: Function) {
        this.errorCallback = callback;
        return this;
    }

    // 为socket添加呼叫
    on(socketPath: string, callback: Function) {
        const {receiveList} = this;
        receiveList.push({socketPath, callback});
        return this;
    }

    // 主动呼叫客户端/单个呼叫
    send(socketName: string, url: string, data: any, callback?: Function) {
        const { socketList } = this;
        const socket = socketList[socketName];
        socket.send(url, data, callback);
        return this;
    }

    // 主动呼叫客户端/全部呼叫
    sendAll(url: string, data: any, callback?: Function) {
        const { socketList } = this;
        for (let key in socketList) {
            socketList[key].send(url, data, callback);
        }
        return this;
    }
}

think.Jarvis = Jarvis;
module.exports = Jarvis;
