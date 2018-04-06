const path = require('path');
const fs = require('fs');
const thinkOption = require('./../package.json');
const version = thinkOption.version;
// 目录
const form = path.join(__dirname, '../build');
const src = path.join(__dirname, '../src');
const list = [
    'bin/console.json',
    'bin/defaultOption.json',
    'bin/tool/contentType.json',
    'bin/log/timeZone.json',
    'bin/language/zh.json',
    'bin/language/en.json'
];

module.exports = {
    name: 'create',
    description: 'create thinkNode',
    callback: function (yargs) {
        // 起始目录与终止目录
        const fileName = yargs.argv._[1] || 'thinkNode-' + version;
        const to = path.join(process.cwd(), fileName);
        const exists = fs.existsSync(to);

        // 不存在
        if (exists) {
            return console.log('The folders already exist!'.red);
        }

        fs.mkdirSync(to);

        // 创建 package.json
        let {dependencies, devDependencies, bundledDependencies} = thinkOption;
        let package = { name: fileName, dependencies, devDependencies, bundledDependencies};
        fs.writeFileSync(path.join(to, 'package.json'), JSON.stringify(package));

        // 移动文件
        copy(form, to, function () {
            // 成功

            // 复制剩余的配置文件
            list.forEach(listName => {
                let srcPath = path.join(src, listName),
                    dstPath = path.join(to, listName);
                let readable, writable;
                readable = fs.createReadStream(srcPath);//创建读取流
                writable = fs.createWriteStream(dstPath);//创建写入流
                readable.pipe(writable);
            });

            // 载入demo
            let demoWwwPath = path.join(__dirname, '../www');
            let demoUsePath = path.join(__dirname, '../user');
            fs.mkdirSync(path.join(to, 'www'));
            fs.mkdirSync(path.join(to, 'user'));
            copy(demoWwwPath, path.join(to, 'www'));
            copy(demoUsePath, path.join(to, 'user'));

            // 成功信息
            console.log(say(fileName));
        });
    }
}

function copy(fromPath, toPath, callback) {
    let files = fs.readdirSync(fromPath);
    const fileLength = files.length - 1;

    files.forEach(fileName => {
        let srcPath = path.join(fromPath, fileName),
            dstPath = path.join(toPath, fileName);
        let readable, writable, index = 0, st = fs.statSync(srcPath);

        if (st.isFile()) {
            readable = fs.createReadStream(srcPath);//创建读取流
            writable = fs.createWriteStream(dstPath);//创建写入流
            readable.pipe(writable);
            index++;

        } else if (st.isDirectory()) {
            //测试某个路径下文件是否存在
            let exists = fs.existsSync(dstPath);

            // 不存在
            if (!exists) {
                fs.mkdirSync(dstPath);
            }

            copy(srcPath, dstPath);
        }
    });

    callback && callback();
};

function say(fileName) {
    return `
+-------+
| Think | Node |
        +------+
${'create success!'.green}

Execute a command
    ${'cd'.yellow} ${fileName.yellow}
    ${'npm i'.yellow}
    ${'think run'.yellow}
    
start !`
}