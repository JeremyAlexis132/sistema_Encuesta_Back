
const definido = (val) => !!val;
const arrayDefinido = (arr) => arr && Array.isArray(arr) && arr.length > 0;
const objetoDefinido = (obj) => obj && Object.keys(obj).length > 0;

const rules = {
    correo: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    numeros: /^(\d+-)*(\d+)$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_,;+<>}{/=¿¡~:-])[A-Za-z\d$@$!%*?&#.$($)$-$_,;+<>}{/=¿¡~:-]{8,15}[^'\s]/,
    rfc: /^[A-Za-zñÑ&]{3,4}\d{6}\w{3}$/,
    curp: /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/
}

function UserException(replyCode, replyText) {
  this.replyCode = replyCode;
  this.replyText = replyText;
}

const validaData = (obj, exclude = []) => {
    let error = false
    for(const [key, value] of Object.entries(obj)){
        if (!exclude.includes(key) && (value === '' || value === null || value === undefined)) {
        error = true
        break
        }
    }
    return error
} 

function getFechaActual() {
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2); // Agregar un cero adelante si es necesario
    let day = ('0' + date.getDate()).slice(-2); // Agregar un cero adelante si es necesario
    let formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

const parseDate = (date, monthNames = false) => {
      if (!date) return '';
      if (date.includes('-')) {
          let [year, month, day] = date.split('-');
          let meses = {
              '01': 'enero',
              '02': 'febrero',
              '03': 'marzo',
              '04': 'abril',
              '05': 'mayo',
              '06': 'junio',
              '07': 'julio',
              '08': 'agosto',
              '09': 'septiembre',
              '10': 'octubre',
              '11': 'noviembre',
              '12': 'diciembre',
          };
          return monthNames ? `${day} de ${meses[month] || ''} de ${year}` : `${day}/${month}/${year}`;
      }
      return date;
}

const formarDate = (date) => {
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`
}

const formateaHora = (numero) => {
    if(numero < 10){
      numero = `0${numero}`
    }else {
      numero = `${numero}`
    }
    return numero
}

const getHoraActual = () => {
    let date = new Date()
    return `${formateaHora(date.getHours())}:${formateaHora(date.getMinutes())}:${formateaHora(date.getSeconds())}`
}

// funcion que suma (operacion == 1) o resta (operacion == 2) dias a una fecha
const operaFecha = (operacion, fecha, dias) => {
    const dateSplitted = fecha.split('-');
    let fechaLimite = ''
    if (operacion === 1)  fechaLimite = new Date(Number(dateSplitted[0]), Number(dateSplitted[1] - 1), Number(dateSplitted[2]) + dias);
    if (operacion === 2)  fechaLimite = new Date(Number(dateSplitted[0]), Number(dateSplitted[1] - 1), Number(dateSplitted[2]) - dias);
    return formarDate(fechaLimite)
}

const parseDinero = (valor, decimal = true) => {
    return  decimal ? 
    `$${parseFloat(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
    `$${parseFloat(valor).toLocaleString('en-US')}` 
}

module.exports = {
  definido,
  arrayDefinido,
  objetoDefinido,
  rules,
  UserException,
  validaData,
  getFechaActual,
  parseDate,
  formarDate,
  formateaHora,
  getHoraActual,
  operaFecha,
  parseDinero
}