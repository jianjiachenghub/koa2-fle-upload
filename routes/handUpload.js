const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const koaBody = require("koa-body");
const port = process.env.PORT || "3001";
const uploadHost = `http://localhost:${port}/uploads/`;

router.post('/handupload',koaBody({
    formidable: {
      //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
      // uploadDir: path.resolve(__dirname, "../uploads"),
      // keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      hash: true,
    },
    multipart: true, // 支持文件上传
    json: true,
  }),async (ctx)=>{
    console.log('handupload',ctx.request.files)
    let file = ctx.request.files.f1;	// 获取上传文件
    if(!file)return ctx.body = '上传失败'
    file = Array.isArray(file)?file:[file]


    file.forEach((file)=>{
        const reader = fs.createReadStream(file.path);	// 创建可读流
        const ext = file.name.split('.').pop();		// 获取上传文件扩展名
        const dir = path.resolve(__dirname, "../uploads")
        const upStream = fs.createWriteStream(`${dir}/${Math.random().toString()}.${ext}`);		// 创建可写流
        reader.pipe(upStream);	// 可读流通过管道写入可写流
    })
	
	return ctx.body = '上传成功';
})

module.exports = router