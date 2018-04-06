/**
 * 这里是与国际化相关代码, 
 * 根据用户设置的语言类型, 这里会加载相应的JSON
 * 打印信息使用think.info('xxx');
 * 如此可以方便的达到国际化效果
 */
import * as path from 'path';
import * as fs from 'fs';
import * as cluster from 'cluster';
import think from './../think';

const __ISMASTER: boolean = cluster.isMaster;

const THINK_LENG_PATH: string = path.join(__dirname, think.language + '.json');

let lengInfo;
if (! fs.existsSync(THINK_LENG_PATH)){
    __ISMASTER && console.log(('The loading language failed. The language file did not exist!' as any).warning);
    __ISMASTER && console.log((THINK_LENG_PATH as any).error);
    
    // 如果没有设置lengPaht或没有找到语言文件, 自动加载zh.json
    lengInfo = require(path.join(__dirname, 'zh.json'));
    __ISMASTER && console.log(lengInfo['loadLengN'].error);
} else {
    // 如果找到了语言文件, 自动加载
    lengInfo = require(THINK_LENG_PATH);
    __ISMASTER && console.log(lengInfo['loadLeng']);
    __ISMASTER && console.log('   ' + (THINK_LENG_PATH as any).file);
    __ISMASTER && console.log(lengInfo['loadLengY']);
}

function info(i: string): string {
    let text: string = lengInfo[i];
    return text || '';
};

think.info = info;
export default info;