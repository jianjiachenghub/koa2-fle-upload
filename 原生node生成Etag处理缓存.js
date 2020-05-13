let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let crypto = require('crypto');

http.createServer(function (req, res) {
    let {pathname} = url.parse(req.url);
    let filepath = path.join(__dirname,'/public',pathname);
    console.log(filepath);
    // 获取文件信息的函数
    fs.stat(filepath,function (err, stat) {
        if (err) {
            return sendError(req,res)
        } else {
            let ifNoneMatch = req.headers['if-none-match'];
            // 用流来解决,可以节约内存
            let out = fs.createReadStream(filepath);
            let md5 = crypto.createHash('md5');
            var start = new Date().getTime();
            out.on('data',function (data) {
                md5.update(data)
            });
            out.on('end',function () {
                // md5算法的特点 1. 相同的输入相同的输出 2.不同的输入不通的输出 3.不能根据输出反推输入 4.任意的输入长度输出长度是相同的
                let etag = md5.digest('hex');
                console.log('文件:'+pathname+',MD5签名为:'+etag+'.耗时:'+(new Date().getTime()-start)/1000.00+"秒");
                if (ifNoneMatch == etag) {
                    res.writeHead('304');
                    res.end('')
                } else {
                    return send(req,res,filepath,stat, etag)
                }
            });
            
            // 二、再次请求的时候会问服务器自从上次修改之后有没有改过
            // fs.readFile(filepath,function (err, content) {
            //     let etag = crypto.createHash('md5').update(content).digest('hex');
            //     // md5算法的特点 1. 相同的输入相同的输出 2.不同的输入不通的输出 3.不能根据输出反推输入 4.任意的输入长度输出长度是相同的
            //     if (ifNoneMatch == etag) {
            //         res.writeHead('304');
            //         res.end('')
            //     } else {
            //         return send(req,res,filepath,stat, etag)
            //     }
            // };
            // 但是上面的一方案也不是太好，读一点缓存一点，文件非常大的话需要好长时间，而且我们的node不适合cup密集型，即不适合来做大量的运算，所以说还有好多其他的算法
            // 三、通过文件的修改时间减去文件的大小
            // let etag = `${stat.ctime}-${stat.size}`; // 这个也不是太好
            // if (ifNoneMatch == etag) {
            //     res.writeHead('304');
            //     res.end('')
            // } else {
            //     return send(req,res,filepath,stat, etag)
            // }
        }
    })

}).listen(8080, function () {
    console.log("服务器运行中.");
    console.log("正在监听 8080 端口:");
  })

function send(req,res,filepath,stat, etag) {
    res.setHeader('Content-Type', mime.getType(filepath));
    // 第一次服务器返回的时候，会把文件的内容算出来一个标示发送给客户端
    //客户端看到etag之后，也会把此标识符保存在客户端，下次再访问服务器的时候，发给服务器
    res.setHeader('Etag', etag);
    fs.createReadStream(filepath).pipe(res)
}

function sendError(req,res) {
    res.end('Not Found')
}
