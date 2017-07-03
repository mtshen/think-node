const path = require('path');

// 设置编码方式
Think.header('Content-Type:text/html; charset=utf-8');

// 设置时区(UTC, GMT)
Think.timeZone('UTC');

// 定义文件号
Think.define('APP_VERSION', () => +new Date);

// 设置语言, 中文在命令行下可能出现乱码
Think.lang('en');

// ==定义配置文件, 大小写不敏感==

// 端口号
Think.opt('PORT', 80);

// 服务器地址
Think.opt('IP', '0.0.0.0');

// 网站根路径
Think.opt('PATH', path.join(Think.DIR, 'www'));

// 网站首页
Think.opt('DEFAULT', ['index.html', 'index.htm']);

// 可请求文件限制
Think.opt('STATICRESOURCE', ['**/*.*']);

// 日志目录
Think.opt('LOG_PATH', path.join(Think.DIR, 'log'));

// 日志自动存储间隔
Think.opt('LOG_TIME', 0);

// 是否自动存储日志
Think.opt('LOG_AUTO', false);

// 每个日志文件最多储存的日期范围
Think.opt('LOG_FILETIME', 3600000);

// NODE文件目录
Think.opt('USER_PATH', path.join(Think.DIR, 'user'));

// node默认执行文件
Think.opt('USER_DEFAULT', []);

// debugger模式
Think.opt('DEBUGGER', false);

// 是否开启子域
Think.opt('OFFSPRDOMAIN', true);

// host
Think.opt('HOST', 'www');
// ==完成配置信息==