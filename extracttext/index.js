const FS  = require('fs');
const PDFJS = require('pdfjs-dist');

/**
 * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
 *
 * @param {Integer} pageNum Specifies the number of the page
 * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
 **/
function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";
                var lines=[];
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];
                    /*item=  {
                            "str": "VIA: (WBE/SDL)*(WB/KOET)",
                            "dir": "ltr",
                            "width": 133.01999999999998,
                            "height": 10,
                            "transform": [
                              10,
                              0,
                              0,
                              10,
                              88.01576999999999,
                              670.7002799999999
                            ],
                            "fontName": "Helvetica"
                          }*/
                    let y = Math.floor(item.transform[5]);
                    if(lines[y]){
                      lines[y]+=' '+item.str
                    }else{
                      lines[y]=item.str;
                    }
                }
                var finalLines=[];
                for(let idx in lines){
                  finalLines.push(lines[idx]);
                }
                // Solve promise with the text retrieve from the page
                resolve(finalLines);
            });
        });
    });
}

module.exports.handler = (event, context, callback) => {
  console.log('event');
  console.log(JSON.stringify(event,null,2));
  console.log('context');
  console.log(JSON.stringify(context,null,2));

  let url = event.file;
  PDFJS.getDocument(url).then(function (PDFDocumentInstance) {

    var totalPages = PDFDocumentInstance.pdfInfo.numPages;
    var pageNumber = 1;

    // Extract the text
    getPageText(pageNumber , PDFDocumentInstance).then(function(lines){

      let result ={};
      result.content=lines.join('\n');
      console.log(JSON.stringify(result,null,2));
      callback(null,[result]);
    });

}, function (reason) {
    // PDF loading error
    console.error(reason);
    callback(reason);
});
};
