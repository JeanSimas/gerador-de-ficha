const path = require('path')
const xlsx = require('node-xlsx')
const fs = require('fs')
const puppeteer = require('puppeteer')

const {parseExcelDate} = require('./utils');

function parseExcelFile(date) {
  const assetsPath = path.join(__dirname, 'assets')
  const data = xlsx.parse(path.join(assetsPath, 'problemas-validadores.xlsx'))
  const dataWithoutHeader = data[0].data.filter(element => element[0] !== 'Numero')
  
  const datesData = dataWithoutHeader.filter(element => parseExcelDate(element[2], '-') == date)

  const validadores = datesData.map(element => ({serialN: element[0], falha: element[1], data: parseExcelDate(element[2], '/'), fileName: `${element[0]}-${parseExcelDate(element[2], '')}`}))

  return validadores

}

function createTempHtml(data, nSerie, falha, filename){
  const templatePath = path.join(__dirname, 'assets', 'template.html')
  const tempPath = path.join(__dirname, 'temp')
  const templateHtml = fs.readFileSync(templatePath).toString()

  let newHtml = templateHtml.replace('{data}', data)
  newHtml = newHtml.replace('{n-serie}', nSerie,)
  newHtml = newHtml.replace('{falha}', falha)
  
  fs.writeFileSync(path.join(tempPath, filename+'.html'), newHtml)

  return path.join(tempPath, filename+'.html')
}

async function generatePdfFromHtmlPage(htmlPath, outPath, filename) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath);
  
  await page.pdf( {
    path: path.join(outPath, filename+'.pdf'),
    format: 'A4',
    pageRanges: '1'
  })


  await browser.close();
}

function deleteTempFile(filePath) {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    
  }  
}
module.exports = {
  parseExcelFile,
  generatePdfFromHtmlPage,
  createTempHtml,
  deleteTempFile
}
