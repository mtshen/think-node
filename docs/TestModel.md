## 生成测试数据
测试数据的生成依赖于 `think.tool.TestModel`, 如果你只想单独使用这个功能, 可以将其单独引入你的web或node项目中
目录位于 `bin/tool/random.js`

## 引入
think-node中引入
```js
  const TestModel = think.tool.TestModel;
```

单独引入
```js
  import {TestModel} from './random';
```

## 使用TestModel
TestModel非常简单, 只接收2个参数, 并且只有1个常用API    
下面是一个简单的例子
```js
const testModel = new TestModel({text: 'hello world!'});
console.log(testModel.random());
```
这时每次执行 `testModel.random()` 都会生成一个新的数据

## 随机数据限定
如果你想要限定生成的数据范围, 此时需要使用第二个参数
```js
const testModel = new TestModel(
  {text: 'hello world!'},
  {text: ['thinkNode!', 'hello World!']}
);

console.log(testModel.random());
```
此时生成的数据只会限定在`['thinkNode!', 'hello World!']` 中, 此外, 你还可以传入一个 `function` 取值始终是回掉函数return的值, 此时需要你去做随机值

**下面是几个随机数例子**
## 文本随机数
```js
new TestModel(
  {text: 'hello world!'},
  {text: ['thinkNode!', 'hello World!']} // 范围取值
);

new TestModel(
  {text: 'hello world!'},
  {text: 'thinkNode'} // 固定某值
);

new TestModel(
  {text: 'hello world!'},
  {text: () => 'hello world!'} // 回掉取值
);
```

## 数字随机数
```js
new TestModel(
  {num: 1},
  {num: [1, 2, 3, 4, 5]} // 范围取值
);

new TestModel(
  {num: 1},
  {num: {min: 100, max: 200}} // 范围取值
);

new TestModel(
  {num: 1},
  {num: 1} // 固定取值
);

new TestModel(
  {num: 1},
  {num: () => 1} // 回掉取值
);
```

## Boolean/null/undefined类型只能使用2种取值方式
```js
new TestModel(
  {bool: true},
  {bool: true} // 固定取值
);

new TestModel(
  {bool: true},
  {bool: () => true} // 回掉取值
);
```

## array 类型取值
```js
new TestModel(
  {list: ['text']},
  {list: ['hello', 'background', 'world']} // 固定取值
);

new TestModel(
  {list: ['text']},
  {list: () => ['text', 'world']} // 回掉取值
);

new TestModel(
  {list: ['text']},
  {
    list: {  // 范围取值
      minLength: 1,
      maxLength: 3,
      child: ['hello', 'world']
    }
  }
);
```

## object 类型比较特殊, TestModel只会进行递归
```js
new TestModel(
  {
    object: {
      num: 1
    }
  },
  {
    object: {
      num: [1, 2, 3]
    }
  }
);
```
