answer({
    url: '/hello',
    callback: (data = {}, think) => {
        return {
            status: 1,
            data: `hello ${data.info || ''}!`,
            info: '请求成功'
        }
    }
});