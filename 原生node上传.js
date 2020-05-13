var http = require("http");
var fs = require("fs");
// formidable是nodejs中用来上传图片的模块
var formidable = require("formidable");
// path是路径模块
var path = require("path");

http
  .createServer(function (req, res) {
    // 如果请求的方法为post (在form中的method='post')
    if (req.method.toLowerCase() == "post") {
      var form = formidable.IncomingForm();
      // 设置上传之后图片的地址 这个文件夹要提前创好,否则报错
      form.uploadDir = "./uploadImg";
      form.parse(req, function (err, fields, files) {
        // 图片的所有信息都在这个 files 中,console.log可以查看
        // console.log(files)
        if (err) {
          throw err;
        }
        // 原名字
        // __dirname 是node的一个全局变量，获得当前文件所在目录的完整目录名
        var oldpath = __dirname + "/" + files.pic.path;
        // 时间戳
        var time = +new Date();
        // 随机数
        var random = parseInt(Math.random() * 10000);
        // 图片拓展名 .JPG .png
        var extname = path.extname(files.pic.name);
        // 新的文件名=__dirname+存放上传图片的文件夹地址+时间戳+随机数+后缀名
        var newpath = __dirname + "/uploadImg/" + time + random + extname;
        console.log(newpath);
        fs.rename(oldpath, newpath, function (err) {
          if (err) {
            throw Error("false");
          }
          res.end("success");
        });
      });
    }
  })
  .listen(3000, "127.0.0.1");
