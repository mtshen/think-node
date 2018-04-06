"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * think日志模块
 */
const fs = require("fs");
const path = require("path");
const timeZone = require("./timeZone.json");
const think_1 = require("./../think");
// 获取think工具
const { tool } = think_1.default;
// 获取用户设置的内容
const THINK_LOG_PATH = path.join(think_1.default.option.log.path);
const THINK_LOG_SW = think_1.default.option.log.switch;
// 获取时区
const logTimeInfo = think_1.default.timeInfo.toUpperCase();
// 获取时区偏移
const timeDeviation = timeZone[logTimeInfo] || 0;
// 日志存储记录
let logFileData = {
    filesName: void 0,
    success: void 0,
    fail: void 0
};
// 错误起始ID
let errorInt = (_ => {
    let { time } = getDate();
    return Number(time.replace(/:/g, '').slice(0, 6));
})();
// 获取错误信息
let getErrorInfo = (error) => `${error.stack}\r\n`;
// 写入log
function log(url, error) {
    // 检查是否开启了日志写入, 如果未开启, 则不会写入日志
    if (THINK_LOG_SW) {
        errorInt++;
        let { date, all } = getDate();
        // 即将要写入的日志内容
        let info = `[${errorInt}][${all}] - ${url}`;
        // 得到日志的写入目录
        let $logPath = path.join(THINK_LOG_PATH, date);
        // 如果日期过期, 则更换新的文件
        if (logFileData.filesName !== date) {
            // 关闭文件
            logFileData.success && fs.close(logFileData.success, _ => _);
            logFileData.fail && fs.close(logFileData.fail, _ => _);
            // 创建文件
            tool.createFilesSync($logPath);
            let successFileFlag = fs.openSync(path.join($logPath, 'success.log'), 'a');
            let failFileFlag = fs.openSync(path.join($logPath, 'fail.log'), 'a');
            logFileData.filesName = date;
            logFileData.success = successFileFlag;
            logFileData.fail = failFileFlag;
        }
        // 开始写入
        if (error) {
            let errInfo = `${info}\r\n\r\n${getErrorInfo(error)}`;
            fs.writeFile(logFileData.fail, `${info}\r\n`, _ => _);
            fs.writeFile(path.join($logPath, `${errorInt}.log`), errInfo, (err) => {
                if (err) {
                    console.log(think_1.default.info('writerError').warn);
                    console.log(err);
                    console.log('\r\n', think_1.default.info('logInfo'));
                }
            });
        }
        else {
            fs.writeFile(logFileData.success, `${info}\r\n`, _ => _);
        }
    }
}
;
/**
 * 获取当前日期
 * @param $ 当前日期, 默认为new Date
 * @param deviation 时间偏移值, 默认为设置的时区偏移
 * 会获取到 {y, m, d, h, t, s, date, time, all} 这些值
 */
function getDate($, deviation) {
    $ = $ || new Date();
    deviation = deviation || timeDeviation;
    $ = new Date(+new Date($) + deviation);
    // 得到时间
    let [y, m, d, h, t, s] = [
        $.getFullYear(),
        $.getMonth() + 1,
        $.getDate(),
        $.getHours(),
        $.getMinutes(),
        $.getSeconds()
    ];
    // 补位
    m < 10 && (m = '0' + m);
    d < 10 && (d = '0' + d);
    h < 10 && (h = '0' + h);
    t < 10 && (t = '0' + t);
    s < 10 && (s = '0' + s);
    // 获得date和time
    let date = [y, m, d].join('.');
    let time = [h, t, s].join(':');
    // 返回
    return {
        y, m, d, h, t, s, date, time,
        'all': [date, time].join(' ')
    };
}
;
think_1.default.log = log;
exports.default = log;
