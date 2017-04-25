# ThinkNode[![npm version](https://img.shields.io/npm/v/think-node.svg?style=flat)](https://badge.fury.io/js/think-node)
	ThinkNode是一个免费开源的，快速、简单的面向对象的轻量级Node开发框架

### 适用人群

 1. 需要快速搭建本地站点
 2. 研究node路由人员
 3. 想要封装Node框架
 4. 测试使用

### 快速入门

 1. 下载项目, 并放置在合适的路径中
 2. 在项目根目录执行 node bin/server
 3. 打开浏览器转到127.0.0.1 如果打开页面中提示 hello ThinkNode 则安装成功
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
 
## Thank!
