let request = require('..')


describe('两次', function() {
    it('两次调用done', function(done) {
        var request = new request('./1.json');
        let n = 0;
        request.done(function(res) {
            n++;
            if (n === 2) done();
        })
        setTimeout(function() {
            request.resolve(1);
            request.resolve(2)
        }, 200);
    });

});

describe('测试get获取数据', function() {
    it('测试各个回调是否完善', function(done) {
        let request = new request;
        let n = 0;
        request.get({
            url: '/data/get',
            data: { a: 1 }
        }).done(function(res, flag) {
            // console.log(res)
            // console.log(flag)
            done();
        }).fail(function(res) {
            console.log(res);
            done();
        }).catch(function(err) {
            console.error(err)
            done()
        });
    });
    it('有缓存调用两次', function(done) {
        let request = new request;
        let n = 0;

        request.get({
            url: '/data/get',
            data: { a: 1 }
        }).done(function(res, flag) {
            n++;
            if (n === 2) done();
        })

    });
});

describe('懒更新测试', function () {
    it('lazy为ture时立即返回', function (done) {
        /**
         * data 参数是请求入参
         * lazy 标记懒更新
         */
        let request = new request;
        let n = 1;
        request.get({
            url: "/data/get",
            data: { uin: 1234 },
            lazy: true
        })
            // 所以有缓存的时候，res应当立刻返回
            // 所以，res应当是上次的数据
            .done(function (res, flag) {
                n--;
                if (n === 0) done()
            })
    })
})

describe('缓存的最大生命是10s', function () {
    it('缓存的最大生命是10s', function (done) {
        let request = new request;
        let n = 1;
        request.get({
            url: "/data/get",
            data: { uin: 1234 },
            maxAge: 10000
        })
        .done(function (res, flag) {
            done()
        })
    })
})

describe('fail逻辑', function () {
    it('res.retcode值为1，调用1次', function (done) {
        storage.setItem('/data/fail','')
        $.mockjax({
            url: "/data/fail",
            responseText: {
                retcode: 1,
                msg: "成功",
                res: {
                    a: 1
                }
            }
        });
        let request = new request;
        let n = 1;
        request.get({
            url: "/data/fail",
            data: { uin: 1234 }
        })
        .fail(function (res) {
            console.log(res)
            done()
        })
    })
})