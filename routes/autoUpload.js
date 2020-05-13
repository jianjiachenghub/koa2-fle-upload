const router = require("koa-router")();
const koaBody = require("koa-body");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || "3001";
const uploadHost = `http://localhost:${port}/uploads/`;

router.post(
  "/autoupload",
  koaBody({
    formidable: {
      //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
      uploadDir: path.resolve(__dirname, "../uploads"),
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      hash: true,
    },
    multipart: true, // 支持文件上传
    json: true,
  }),
  async (ctx) => {
    console.log(ctx.request.files);

    var files = ctx.request.files ? ctx.request.files.f1 : []; //得到上传文件的数组
    var result = [];
    console.log(files);

    if (!Array.isArray(files)) {
      //单文件上传容错
      files = [files];
    }
    // 开启自动保存后缀就不需要重命名了
    /*     files && files.forEach(item=>{
        var path = item.path;
        var fname = item.name;//原文件名称
        var nextPath = path + fname;
        if (item.size > 0 && path) {
            //得到扩展名
            var extArr = fname.split('.');
            var ext = extArr[extArr.length - 1];
            var nextPath = path + '.' + ext;
            //重命名文件
            fs.renameSync(path, nextPath);
  
            result.push(uploadHost+ nextPath.slice(nextPath.lastIndexOf('/') + 1));
        }
    }); 
    
        ctx.body = `{
        "fileUrl":${JSON.stringify(result)}
    }`;

    */
    /*    需要注意的是，如果是获取上传后文件的信息，则需要在 ctx.request.files 中获取。

   如果是获取其他的表单字段，则需要在 ctx.request.body 中获取，这是由 co-body 决定的（默认情况）。 */
    console.log(ctx.request.files);
    console.log(ctx.request.body);
    ctx.body = ctx.request.files;
  }
);

module.exports = router;
