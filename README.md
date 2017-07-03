# ThinkNode[![npm version](https://img.shields.io/npm/v/think-node.svg?style=flat)](https://badge.fury.io/js/think-node)
	ThinkNode是一个免费开源的，快速、简单的面向对象的轻量级Node开发框架

## ThinkNode更新说明
 - 修改option.json 为option.js
 - 新增子域名系统, 快速生成子域
 - 隐藏了log的记录, 进行重做
 - 修改了注释, 新增了国际化提示
 - 新增了一些参数

### 适用人群

 1. 需要快速搭建本地站点
 2. 研究node路由人员
 3. 想要封装Node框架
 4. 测试使用

### 快速入门

 1. 下载项目, 并放置在合适的路径中
 2. 执行 shell: npm install
 3. 执行 shell: node bin/server
 4. 打开浏览器转到127.0.0.1 如果打开页面中提示 hello ThinkNode 则安装成功
 > 也可以使用 npm install think-node 进行安装

### 配置文件
 文件位置 : ./option.json
 
 ##### 配置文件中可以使用的变量:
  - ${PATH} : ThinkNode根目录

 1. port: 网站端口号, 默认 `80`
 2. path: 网站地址路径, 默认 `${PATH}\\www\\`
 3. default: 首页地址, 默认 `index.html`
 4. staticResource: 静态资源地址, 可以使用glob匹配, 默认`["**/*.*"]`
 5. log: 日志相关配置
 
 	- path: 日志存储位置, 默认 `${PATH}\\log\\`
  	- time: 日志自动存储间隔(如果auto为true, 则该参数无效)
  	- auto: 是否实时保存日志, 默认 `true`
  	- fileTime: 每个文件的时间分割(ms), 默认 3600000
 
 6. user: 用户路由相关配置
  	- path: 用户路由目录, 默认`${PATH}\\user\\`
 7. debugger: 是否是调试模式, 默认`false`
 	- 如果是false, 文件将加入到缓存, 页面不会再实时更新, 但是效率将大大提高
	- 如果是true, 文件的更新将能够被捕捉, 用户测试使用

 8. offsprDomain: 是否开启子域名解析, 开启子域名解析之后, 将会自定把子域名解析为路径

### 自定义接口
如果配置的用户路由(user.path)参数, 在此目录下创建一个js
例如设置为
```
	"user": {
		"path": "${PATH}\\js\\"
	}
```

在根目录下的js文件夹下新建一个js(命名没有限制), 使用 answer 函数来定义接口
- `url` : 接口名
- `ContentType` : 文件的ContentType, 可不写, 会自动识别
- `callback` : 该接口接收到请求后的回调函数

```
	answer({
		url: '/abc',
		callback: (data = {}, think) => {
			return {
				status: 1,
				data: `hello ${data.info || ''}!`,
				info: '请求成功!'
			}
		}
	});
```

也可以这样写
```
	answer('/abc', undefined, (data = {}, think) => {
		return {
			status: 1,
			data: `hello ${data.info || ''}!`,
			info: '请求成功!'
		}
	});
```

如果不需要返回值可以在callback中返回 `END`
```
return END;
```

如果需要返回一个404错误可以在callback中返回 `NODATA`
```
return NODATA;
```

## Thank!
