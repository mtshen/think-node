#!/usr/bin/env node
const yargs = require('yargs');
const thinkOption = require('./../package.json');
const version = thinkOption.version;
const colors = require("colors");

// 指令
const create = require('./create');
const run = require('./run');

// 创建命令
yargs.command(create.name, create.description, create.callback);
yargs.command(run.name, run.description, run.callback);

// 执行yargs
yargs.argv;


const say = 
`
+-------+
| Think | Node |
        +------+ 
version: ${version.yellow}

commonly used commands:
        help: ${'think --help'.yellow}
        create: ${'think create demo'.yellow}
        run: ${'think run'.yellow}

quick start:
        ${'think create demo'.yellow}
        ${'think run'.yellow}`

// 如果没有写任何参数, 呼出信息
if (!yargs.argv._.length) {
    console.log(say);
}