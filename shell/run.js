const fs =  require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = {
    name: 'run',
    description: 'run thinkNode',
    callback: function (yargs) {
        // 检查代码完整性 bin/think.js, bin/server.js
        let thatUrl = process.cwd();
        let thinkExists = fs.existsSync(path.join(thatUrl, 'bin/think.js'));
        let serverExists = fs.existsSync(path.join(thatUrl, 'bin/server.js'));
        let nodeModule = fs.existsSync(path.join(thatUrl, 'node_modules'));
        if (thinkExists && serverExists) {
            runShell('node', [`${thatUrl.replace(/\\/g, '/')}/bin/server`]);
        } else {
            console.log('Please make sure that you are in the folder created by think'.red);
        }
    }
};

function runShell(shell, parameter) {
    free = spawn(shell, parameter || []);
    
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function (data) { 
        console.log(data.toString()); 
    }); 

    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function (data) { 
        console.log('error output:\n' + data.toString()); 
    }); 

    // 注册子进程关闭事件 
    free.on('exit', function (code, signal) { 
        console.log('\r\nexit;'); 
    });
};