const { TestModel } = think.tool;

// 设置测试数据及随机种子
var textModel = new TestModel(
    {text: 'think-node'},
    {text: ['think-node', 'hello world']},
);

// 创建一个接口 '/think'
think.answer({
    url: '/think',
    callback: () => textModel.random(),
});