## think-node 与硬件通信
think-node中包含了一个与ruff/web的socket通信封装, 如果你还不了解什么是ruff, 可以点击[这里](https://ruff.io/zh-cn/)访问ruff官网, 在这里

## ruff-server & web-server
如果你想使用 think-node 快速搭建物联网通信, 你还需要
- 在web端使用 [web-server库]() 来发送/接受socket请求
- 在ruff端使用 [ruff-server库]() 来发送/接受socket请求

## 引入
整个通信全部由`Jarvis`模块完成, 这个模块非常独立, 如果你想单独使用他, 可以直接在项目中拿出来使用
```js
const { Jarvis } = think;
```

## 建立web链接
```js
const jarvis = new Jarvis(8899); // 创建socket, 监听 8899 断开

// 监听一个socket接口
jarvis.on('getText', function(data) { 
  // 向发送者响应 'hello world'
  return 'hello world';
});

// 发送一个socket信息
jarvis.send('sendText', 'hello world', function(data) {
  // 当响应者收到消息之后的响应
  console.log(data);
});

```

## 建立ruff链接
```js
// 创建socket, 监听 8899 断开
// 第二个参数传入true则视为创建ruffsocket
const jarvis = new Jarvis(8899, true);

// 监听一个socket接口
jarvis.on('getText', function(data) { 
  // 向发送者响应 'hello world'
  return 'hello world';
});

// 发送一个socket信息
jarvis.send('sendText', 'hello world', function(data) {
  // 当响应者收到消息之后的响应
  console.log(data);
});

```

## think-node 如何做到socket监听通信返回消息的
协议

> 标识头(jarvis)*通信ID(ID)*接口(URL)*状态(STATUS):数据集(JSON)

正则表达为:
`/^jarvis\*(\w+)\*([\w\\\/\.]+)\*([0-9]{0,3}):(.{0,})$/`


**jarvis**: 固定值 `jarvis`

**ID**: 每次发送随机生成

**URL**: 传入的url

**STATUS**: 
- 000 发送回应消息  
- 001 发送了一个需要回应的请求  
- 002 发送了一个不需要回应的请求  

**JSON** 传入的数据
