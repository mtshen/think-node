// node模块
const path = require('path');
const fs = require('fs');

__ISMASTER && console.log(ThinkInfo('loadTool'));

// 为Think挂载tool
global.Think.tool = {};

// 装载插件, 同步装载
let toolPath = path.join(Think.frontPath(__dirname), 'tool');
let stat = fs.readdirSync(toolPath);

stat.forEach((file) => {
    if (file === 'tool.js') return;
    let fileName = path.join(toolPath, file);
    let stats = fs.statSync(fileName);
    if (stats.isFile() && /\.js$/.test(fileName)) {
        require(fileName.replace(/\.js$/, ''));
        __ISMASTER && console.log('   ' + fileName.file);
    }
});
