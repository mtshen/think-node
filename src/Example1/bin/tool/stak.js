// 任务系统, 通常用于大数据处理
class Stak {
    constructor () {
        this.timer = null;
        this.callback = null;
        this.stakList = [];
        this.pushStak(arguments);
    }

    pushStak() {
        Array.prototype.forEach.call(arguments, function(stak) {
            typeof stak === 'function' && this.stakList.push(stak);
        }, this);
    }

    start() {
        this.timer = setInterval(this.timeFn.bind(this), 1);
    }

    timeFn() {
        let stak = this.stakList.shift();
        if (stak) 
            stak() 
        else {
            clearInterval(timer);
            this.callback && this.callback();
        } 
    }
}

Think.tool.stak = Stak;