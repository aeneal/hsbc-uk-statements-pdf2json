let fs = require('fs'),
PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {

  let pages = pdfData.formImage.Pages
  let output ="";
  
    for(let p =0; p < pages.length; p++) {
        let data = pdfData.formImage.Pages[p].Texts;
        let line = {}
        let index = 1;
        for(let i =0; i < data.length; i ++) {
            
                
                let item = decodeURI(data[i].R[0].T).split('%26').join('&').split('%2F').join('/').split('%2C').join('').split('  ').join('')//.replace(/[^a-zA-Z0-9\s]/g, '-')
                if (data[i].x <29) {

                    line[index] = item
                    index ++
                } else {
                    line[index] = parseFloat(item)
                    index++
                }

            if (data[i].x >29) {
                
                if(index >5 && index < 10) {
                    let d = ""
                    d += '"'+line['1'].split(' ').join('-')+'-'+line['2']+'"'
                    d += ','
                    d += '"'+line['3'].split(' ').join('-')+'-'+line['4']+'"'
                    d += ','
                    if(line['7']) {
                        d += '"'+line['5']+' '+line['6']+'","'+line['7']+'"'
                    } else {
                        d += '"'+line['5']+'","'+line['6']+'"'
                    }
                    d += '\n'

                    output += d;
                }
                line ={}
                index = 1
            }
            
        }
    }
fs.writeFileSync("hsbc.csv", output);


});

pdfParser.loadPDF(process.argv[2]);