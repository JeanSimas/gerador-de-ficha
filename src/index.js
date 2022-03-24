'use strict'
const path = require('path');
const { parseExcelFile, generatePDF, createTempHtml, generatePdfFromHtmlPage, deleteTempFile } = require('./functions');
const fs = require('fs')

require('events').EventEmitter.defaultMaxListeners = 15;

//read date argument
const dateToSearch = process.argv[2]

//extract date's problems from excel
const validadores = parseExcelFile(dateToSearch)

try {
  fs.mkdirSync(path.join(__dirname, 'assets'))
  fs.mkdirSync(path.join(__dirname, 'outDir'))
  fs.mkdirSync(path.join(__dirname, 'temp'))
} catch (error) {
  
}
if(validadores.length === 0) console.log('Não existe registro nessa data');

else {
  
  //render template in puppeteer
  const outDirPath = path.join(__dirname, 'outDir', dateToSearch)

  try {
    fs.mkdirSync(outDirPath)
  } catch (error) {
    
  }

  try {
    (async () => {
      validadores.forEach(validador => {
        const tempHtml = createTempHtml(validador.data, validador.serialN, validador.falha, validador.fileName)
        generatePdfFromHtmlPage(tempHtml, outDirPath, validador.fileName).then(() => {
          console.log(`Arquivo ${validador.fileName} criado com êxito`);
          deleteTempFile(tempHtml)
    
        })
    
      })
    })().then(() => {
      require('child_process').exec(`start "" "${outDirPath}"`);
    })
  
  } catch (error) {
    console.log(error.toString())
  }


}      