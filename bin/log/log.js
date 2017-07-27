const fs = require('fs');
const path = require('path');
const logPath = path.join(Think.option.log.path);
const logSwitch = Think.option.log.switch;
const logTimeInfo = Think.timeInfo.toUpperCase();
const timeZone = require('./timeZone.json') || {};
const timeDeviation = timeZone[logTimeInfo] || 0; 
let logFileData = {};

let errorInt = (()=> {
    let {time} = getDate();
    return Number(time.replace(/:/g, '').slice(0, 6));
})();


// 写入log
function log(url, error) {
    if (!logSwitch) return;
    let {tool} = Think;
    let dateobj = getDate();
    let {date, all} = dateobj;
    let info = '';
    let $logPath = path.join(logPath, date);
    if (logFileData.filesName !== date) {
        // 关闭文件
        logFileData.success && fs.close(logFileData.success);
        logFileData.fail && fs.close(logFileData.fail);

        // 创建文件
        tool.createFilesSync($logPath);
        let successFileFlag = fs.openSync(path.join($logPath, 'success.log'), 'a');
        let failFileFlag = fs.openSync(path.join($logPath, 'fail.log'), 'a');
        logFileData.filesName = date;
        logFileData.success = successFileFlag;
        logFileData.fail = failFileFlag;

    }
    
    info += `[${all}] - ${url}`;
    if (error) {
        errorInt ++, info = `[${errorInt}]${info}`;
        let errInfo = `${info}\r\n\r\n${getErrorInfo(error)}`;
        fs.writeFile(logFileData.fail, `${info}\r\n`, ()=>{});
        fs.writeFile(path.join($logPath, `${errorInt}.log`), errInfo, (err) => {
            if (err) {
                console.log(ThinkInfo('writerError').warn);
                console.log(logPath.error);
                console.log('\r\n', ThinkInfo('logInfo'));
            }
        })
    } else {
        fs.writeFile(logFileData.success, `${info}\r\n`, ()=>{});
    }
};

function getErrorInfo(error) {
    return `${error.stack}\r\n`;
};

// 获取时间
function getDate($ = new Date(), deviation = timeDeviation) {
    $ = new Date(+new Date($) + deviation);
    let [y, m, d, h, t, s] = 
        [
            $.getFullYear(),
            $.getMonth() + 1,
            $.getDate(),
            $.getHours(),
            $.getMinutes(),
            $.getSeconds()
        ];
        m < 10 && (m = '0' + m);
        d < 10 && (d = '0' + d);
        h < 10 && (h = '0' + h);
        t < 10 && (t = '0' + t);
        s < 10 && (s = '0' + s);
    
    let date = [y, m, d].join('.');
    let time = [h, t, s].join(':');
    return {
        y, m, d, h, t, s, date, time,
        'all': [date, time].join(' ')
    }
};

Think.log = log;