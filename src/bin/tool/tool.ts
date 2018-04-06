// node模块
import * as path from 'path';
import * as fs from 'fs';
import * as cluster from 'cluster';
import think from './../think';

// 装载内置函数
import { contentType, hasUtf8 } from './contentType';
import {copy, is} from './copy';
import {createFileSync, createFilesSync, createFile, createFiles} from './createfiles';
import {stringifyForm, paramForm} from './form';
import {Stak} from './stak';

const __ISMASTER: boolean = cluster.isMaster;
__ISMASTER && console.log(think.info('loadTool'));

think.tool = {
    contentType, hasUtf8, copy, is,
    createFileSync, createFilesSync,
    createFile, createFiles, Stak,
    stringifyForm: stringifyForm.bind(think.tool),
    paramForm: paramForm.bind(think.tool)
};

const THINK_TOOL_URL: string = think.option.tool;

// 装载第三方函数, 同步装载
if (THINK_TOOL_URL) {
    let stat: string[] = fs.readdirSync(THINK_TOOL_URL);
    
    stat.forEach((file: string) => {
        // 得到文件
        let fileName: string = path.join(THINK_TOOL_URL, file);
        let stats: fs.Stats = fs.statSync(fileName);
        if (stats.isFile() && /^[.-_$\w]+\.js$/.test(fileName)) {
            try {
                let toolCallback = require(fileName.slice(0, -3));
                think.tool[getFileName(fileName)] = toolCallback;
                __ISMASTER && console.log('   ' + (fileName as any).file);
            } catch (error) {
                __ISMASTER && (think.log(fileName, error), console.log('   ' + (fileName as any).error));
            }
        }
    });
    
    /**
     * 将文件名转换为一个变量名
     * 将.-去除, 并使首字母大写, 
     * 如 a.min.js 转换为 aMin
     * a-min.js 也转换为 aMin
     * @param fileName 文件名称
     */
    function getFileName(fileName: string): string {
        fileName = fileName.slice(0, -3);
        let fileSlice: string[] = fileName.split(/\.|-/);
        let startText: string = fileSlice.shift();
        fileSlice = fileSlice.map((text: string) => {
            return text[0].toUpperCase() + text.slice(1);
        });
        return startText + fileSlice.join('');
    }
}
