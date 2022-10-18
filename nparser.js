const pdfParse = require('pdf-parse');
const fs = require('fs');
elpdf =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationdanie2.pdf';
otropdf =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationmede.pdf';

/*const getContent = async (rutapdf) => {
  arrayDatos = [];
  texto = (await pdfParse(await rutapdf)).text;
  texto
    .split('\n')
    .map((texto) => {
      return texto.split(',');
    })
    .flat()
    .map((texto) => texto.split(':'))
    .flat()
    .map((texto) => texto.split('?'))
    .flat()
    .map((texto) => {
      if (texto == '') {
      } else {
        arrayDatos.push(texto);
      }
    });
  return arrayDatos;
};*/
const getContent = async (pdf) => {
  return (await pdfParse(pdf)).text
    .split('\n')
    .toString()
    .split(',')
    .toString()
    .split(',')
    .toString()
    .split(':')
    .toString()
    .split(',')
    .toString()
    .split('?')
    .toString()
    .split(',')
    .filter((item) => item !== '');
};
/*(async () => {
  texto = '';
  (await contenidito(elpdf)).forEach((item) => {
    texto = texto + `${item}\n`;
  });
  console.log(texto);
})();*/
async function esDigno(pdf) {
  contenido = await getContent(pdf);
  if (
    await contenido.includes('Application - Sensitive But Unclassified(SBU)')
  ) {
    return true;
  } else {
    return false;
  }
}
function pdfFechaToDate(fecha) {
  let datePieces = fecha.split('/');
  //let timePieces = dateComponents[1].split(':');
  datePieces[2] = parseInt(datePieces[2]) + 2000;
  return new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
}

async function buscarEnContenido(dato, contenido) {
  for (let i = 0; i <= contenido.length; i++) {
    if (contenido[i] == dato) {
      return contenido[i + 1];
    }
  }
}
//aqui empiezan los retornos

async function datos(pdf) {
  const datosBusqueda = {
    name: 'Full Name in Native Language',
    idNumber: 'National Identification Number',
    city: 'City',
    address: 'Home Address',
    phone: 'Primary Phone Number',
    email: 'Email Address',
    passport: 'Passport/Travel Document Number',
    purpose: 'Purpose of Trip to the U.S. (1)',
    issued: 'Have you ever been issued a U.S. visa',
  };
  content = await getContent(pdf);
  return content;
}
(async () => {})();
module.exports = { getContent, esDigno, datos };
