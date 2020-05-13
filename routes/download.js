const router = require("koa-router")();
const send = require("koa-send");

router.post("/download/:name", async (ctx) => {
  const name = ctx.params.name;
  const path = `upload/${name}`;
  ctx.attachment(path);
  await send(ctx, path);
});

const archiver = require("archiver");

router.post("/downloadAll", async (ctx) => {
  // 将要打包的文件列表
  const list = [{ name: "1.txt" }, { name: "2.txt" }];
  const zipName = "1.zip";
  const zipStream = fs.createWriteStream(zipName);
  const zip = archiver("zip");
  zip.pipe(zipStream);
  for (let i = 0; i < list.length; i++) {
    // 添加单个文件到压缩包
    zip.append(fs.createReadStream(list[i].name), { name: list[i].name });
  }
  await zip.finalize();
  ctx.attachment(zipName);
  await send(ctx, zipName);
});

router.post("/downloadDir", async (ctx) => {
  const zipStream = fs.createWriteStream("1.zip");
  const zip = archiver("zip");
  zip.pipe(zipStream);
  // 添加整个文件夹到压缩包
  zip.directory("upload/");
  zip.finalize();
});
module.exports = router;
