const PDFImage = require("pdf-image").PDFImage;
const FS = require("fs");

exports.handler = (event, context, callback) => {
  console.log('event');
  console.log(JSON.stringify(event,null,2));
  console.log('context');
  console.log(JSON.stringify(context,null,2));

  FS.writeFileSync("/tmp/tmp.pdf", event.base64 , 'base64');
  let pdfImage = new PDFImage("/tmp/tmp.pdf");

  pdfImage.convertPage(0).then((paths)=>{
    let buf = FS.readFileSync(paths);
    let result = {image: buf.toString('base64')};
    callback(null,result);
  });
}