const fs = require('fs');
const option = require('./../option');

let logData = [];
let saveDate = null;
let currentFileName = '';

function log(config = {}, saveFlag) {
    if (config === true) {
        logData.push(startService());
        saveDate = +new Date;
        let {auto, time} = option.log;
        currentFileName = getDate(saveDate);
        !auto && time && setInterval(function() {
                save();
            }, time);
        console.info('服务器已启动, 日志持续打印中');
    } else if (config === false) {
        logData.push(endService());
    } else {
        logData.push(createFileLog(config));
    }
    (saveFlag || config.log.auto) && save();
};

// 保存日志文件到本地
function save() {
    if (+new Date - saveDate > option.log.fileTime) {
        currentFileName = getDate(saveDate);
        saveDate = +new Date;
    }

    fs.readFile(`${option.log.path}/${currentFileName}.log`,'utf-8',function(error, data){
        if(error) {
            fs.writeFile(`${option.log.path}/${currentFileName}.log`, logData.join(''));
        } else {
            fs.writeFile(`${option.log.path}/${currentFileName}.log`, data.toString() + logData.join(''));
        }
        logData = [];
    })
};

// 获取时间
function getDate(time = new Date()) {
    time = new Date(time);
    let [y, m, d, h, t, s] = 
        [
            time.getFullYear(),
            time.getMonth() + 1,
            time.getDate() + 1,
            time.getHours(),
            time.getMinutes(),
            time.getSeconds()
        ];
        m < 10 && (m = '0' + m);
        d < 10 && (d = '0' + d);
        h < 10 && (h = '0' + h);
        t < 10 && (t = '0' + t);
        s < 10 && (s = '0' + s);
    return `${y}年${m}月${d}日 ${h}时${t}分${s}秒`;
};

function createFileHead(sTime, eTime) {
    return `# DATE ${getDate(sTime)} - ${getDate(eTime)}\n#\n`;
};

function createFileLog({time = getDate(), title = '', level = 'log', log = '', url = '???', type = '???'}) {
    return `\r\n**\r\n# DATE  : ${time}\r\n# URL   : {${type}} ${url}\r\n# TITLE : {${level}} ${title}\r\n#\r\n#\r\n${log}\r\n#\r\n**\r\n`;
};

let startService = () => `* [127.0.0.1:${option.port}] STAST SERVICE - ${getDate()} *\r\n`;
let endService = () => `\r\n* [127.0.0.1:${option.port}] END   SERVICE - ${getDate()} *`;

// 结束服务监听
process.on('exit', () => log(false, true));
log(true, true);

module.exports = log;