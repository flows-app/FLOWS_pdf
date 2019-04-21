const FS = require("fs");
const CHILD = require("child_process");

exports.handler = (event, context, callback) => {
  FS.writeFileSync("/tmp/tmp.pdf", event.base64 , 'base64');

  CHILD.execSync("convert -density 300 -append /tmp/tmp.pdf /tmp/tmp.png");
  let buf = FS.readFileSync("/tmp/tmp.png");
  let result = {image: buf.toString('base64')};
  callback(null,result);
}