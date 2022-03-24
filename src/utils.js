const { format, addDays } = require("date-fns");

function parseExcelDate(date, char_) {
  try {
    var utc_days = Math.floor(date - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);
  console.log(date_info.toString());
  return format(addDays(date_info, 1), `dd${char_}MM${char_}yyyy`)      
  } catch (error) {
    console.error(date)
  }

}


function removeBarra(data) {
  return data.replace('/', '').replace('/', '')
}
module.exports = {
  parseExcelDate,
  removeBarra
}