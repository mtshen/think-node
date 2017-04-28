answer({
    url: '/hello',
    callback: (data) => {
        return {
            status: 1,
            data: 'hello ThinkNode!',
            info: '请求成功'
        }
    }
});