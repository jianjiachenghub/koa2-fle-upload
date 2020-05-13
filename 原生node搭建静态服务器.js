var mime = require("mime");
var path = require("path");
var fs = require("fs");
var http = require("http");
var url = require('url');


function readStaticFile(res, filePathname) {
  var ext = path.parse(filePathname).ext;
  var mimeType = mime.getType(ext);

  // 判断路径是否有后缀, 有的话则说明客户端要请求的是一个文件
  if (ext) {
    // 根据传入的目标文件路径来读取对应文件
    fs.readFile(filePathname, (err, data) => {
      // 错误处理
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 - NOT FOUND");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": mimeType });
        res.write(data);
        res.end();
      }
    });
    // 返回 false 表示, 客户端想要的 是 静态文件
    return true;
  } else {
    // 返回 false 表示, 客户端想要的 不是 静态文件
    return false;
  }
}

var server = http.createServer(function (req, res) {
  var urlObj = url.parse(req.url);
  var urlPathname = urlObj.pathname;
  var filePathname = path.join(__dirname, "/public", urlPathname);

  // 读取静态文件
  readStaticFile(res, filePathname);
});

// 在 3000 端口监听请求
server.listen(3000, function () {
  console.log("服务器运行中.");
  console.log("正在监听 3000 端口:");
});



// 压缩
function gzip(src) {
    fs.createReadStream(src)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(src + ".gz"));
  }
  
  // 解压
  function gunzip(src) {
    fs.createReadStream(src)
      .pipe(zlib.createGunzip())
      .pipe(
        fs.createWriteStream(path.join(__dirname, path.basename(src, ".gz")))
      );
  }
  
  // 缓存处理
  function getFileFromCache(req,res,statObj){
      let ifModifiedSince = req.headers['if-modified-since'];
      let isNoneMatch = req.headers['if-none-match'];
      res.setHeader('Cache-Control','private,max-age=60');
      res.setHeader('Expires',new Date(Date.now() + 60*1000).toUTCString());
      let etag = crypto.createHash('sha1').update(statObj.ctime.toUTCString() + statObj.size).digest('hex');
      let lastModified = statObj.ctime.toGMTString();
      res.setHeader('ETag', etag);
      res.setHeader('Last-Modified', lastModified);
      if (isNoneMatch && isNoneMatch != etag) {
          return false;
      }
      if (ifModifiedSince && ifModifiedSince != lastModified) {
          return false;
      }
      if (isNoneMatch || ifModifiedSince) {
          res.statusCode = 304;
          res.end('');
          return true;
      } else {
          return false;
      }
  }
  