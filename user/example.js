answer({
    url: '/hello',
    callback: function(data) {
        return {
            status: 1,
            data: 'hello thinkNode!',
            info: '请求成功'
        }
    }
});