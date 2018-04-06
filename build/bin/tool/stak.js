"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 任务系统, 通常用于大数据处理
class Stak {
    constructor(...staks) {
        this.stakList = [];
        this.flag = 0;
        this.pushStak(...staks);
    }
    pushStak(...staks) {
        staks.forEach(function (stak) {
            this.flag < 2 && typeof stak === 'function' && this.stakList.push(stak);
        }, this);
    }
    start() {
        this.flag = 1;
        this.timer = setInterval(this.timeFn.bind(this), 1);
    }
    timeFn() {
        let stak = this.stakList.shift();
        if (stak)
            stak();
        else {
            this.timer && clearInterval(this.timer);
            this.flag = 2;
            this.callback && this.callback();
        }
    }
    restart() {
        this.stakList = [];
        this.timer && clearInterval(this.timer);
        this.timer = null;
        this.flag = 0;
    }
}
exports.Stak = Stak;
