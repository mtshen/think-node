# ThinkNode[![npm version](https://img.shields.io/npm/v/think-node.svg?style=flat)](https://badge.fury.io/js/think-node)
	ThinkNode是一个免费开源的，快速、简单的面向对象的轻量级Node开发框架

## ThinkNode 1.0 说明
 #### 适用人群
  1. 快速搭建本地站点
  2. 快速接口调试
  3. 快速搭建多子域的站点
  4. 学习node路由

 #### 示例
  - 项目src中有2个示例作为参考
  - 子域效果可以访问以下地址
	- think.mtshen.xin
	- help.mtshen.xin

 #### 快速入门
  1. 下载项目, 并放置在合适的路径中
  2. 执行 shell: npm install 安装依赖插件
  3. 执行 shell: node bin/server 进入127.0.0.1进行测试

 #### 配置文件
	文件位置 : ./option.js
  1. `Think.header()`: 设置请求头, 默认 `'Content-Type:text/html; charset=utf-8'`, 可多次设置
  2. `Think.timeZone()`: 设置时区, 默认 `'GMT'`
  3. `Think.define()`: 自定义值, 在请求相应文件后会自动替换内容
  4. `Think.lang()`: 国际化提示, 默认 `'zh'`
  5. `Think.load()`: 服务器启动后自动开始执行
  6. `Think.opt()`: 常用配置, 大小写不敏感


optName | optValue
------|------
port	 	| 服务端口, 默认 80
ip	 	| 服务ip地址, 默认 0.0.0.0
path	 	| 网站根路径地址, 默认项目文件夹/www
default	| 网站首页, 必须为数组, 默认['index.html', 'index.htm']
staticReSource | 可请求文件限制, 默认['**/*.*'], 如果限制某些文件将无法被请求到
log_path | 日志存储目录 *暂时不可用
log_auto | 日志是否自动存储 *暂时不可用
log_fileTime | 每个日志文件的最大存储范围 *暂不可用
log_time | 日志自动存储间隔 *暂不可用
user_path| 自定义的node文件地址
debugger | 是否缓存文件, 建议测试的时候改成false
offsprDomain | 是否开启子域, 默认false

 #### staticReSource 请求文件限制
  > 当服务器中有些重要文件不希望公开时使用  
  > 如服务器中有几个文件: a.js ,b.js ,c.js
  > 如果不希望c.js被访问, 则执行Think.opt('staticReSource', ['a.js', 'b.js']);

 #### debugger 缓存
  > 开启缓存后, 加载文件速度将会大幅度提升, 但某个文件需要变动则需要重启服务   
  > 所以建议在测试阶段关闭缓存, 在上线阶段开启缓存

 #### offsprDomain 子域
  - 当你只有ip没有域名时不支持子域

  > 当你的域名是 abc.com 时, 你想要用户访问www.abc.com 和访问 help.abc.com请求内容不同时, 可以开启子域
  
  > 开启子域后, 文件结构也需要发生变化, 此时设置的`path` 路径, 其中的每个文件夹, 会解析成子域文件夹, 每个子域文件夹中也需要进行配置, 需要增加一个文件option.json



  optName | optValue
  -------|---------
  path			| 子域网站地址, 相对路径
  default		| 子域首页文件名, 需要传入数组
  staticresource| 是否继续向下分发子域
  user.path		| node文件位置
  user.default	| 默认执行的node文件位置
  host			| 当staticresource为true时, 如果用户只输入了父级域名时, 自动转向一个子域, 默认为 `www`


 #### 快速设置node接口
  - 使用 Think.answer 快速定义
	```
		Think.answer({
			url: '/hello',
			callback: (data = {}, think) => {
				return {
					status: 1,
					data: `hello ${data.info || ''}!`,
					info: '请求成功!'
				}
			}
		});
	```
   - 可传入的属性
   	   
name | value
-----|-------
url  | 接口地址
type | 指定的请求类型, 不填写则为任意请求类型
callback | 处理接口的回调函数
contentType | 接口处理完成后的请求头 contentType
priority | 接口优先级, 默认为0

  - 如果不需要返回值可以在callback中返回 `Think.END`
	```
	return Think.END;
	```

  - 如果需要返回一个404错误可以在callback中返回 `Think.NODATA`
	```
	return Think.NODATA;
	```

  - callback 返回值 `data, think`
  	- data 为前端返回到接口的数据
	- think think中包含`think.url`, `think.type`, `think.request`, `think.response` 其中`think.request`和`think.response` 参数为node原生参数, 可以通过这些参数来自定义接口返回内容

 #### 语言
  - 设置语言使用Think.lang方法进行设置, 改方法只能在option.js中使用, 其他文件使用不生效
  - 目前只支持`en` 和 `zh`
  - 需要新增语言, 可以在项目`bin\language\`下新建xx.json, 即可
 
 #### Think 插件/模块
  - think中可以自定义插件, 定义的插件放置在`bin\tool\`下, 运行时会自动装载, 调用时执行`Think.tool.xxx`
  
## Thanks!
