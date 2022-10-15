const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const fs = require('fs');
const { json } = require('express');

const listaPDF = [
  './pdf/xzxz/Consular Electronic Application Center.pdf',
  './pdf/xzxz/garcia2.pdf',
  './pdf/xzxz/HERMENCIA BENITEZ CONFIRMACION.pdf',
  './pdf/xzxz/IZAGUIRRE BENITEZ, JOSE LUIS CONFIRMACION.pdf',
  './pdf/xzxz/MARTINEZ SOTO, IVETH ALEXANDRA CONFIRMACION.pdf',
  './pdf/xzxz/Nonimmigrant Visa - Confirmation Pagedarey2 - copia.pdf',
  './pdf/xzxz/Nonimmigrant Visa - Confirmation Pagedarey2.pdf',
  './pdf/xzxz/rajo.pdf',
];

//aquie empiezan las functions
async function getContent(pdf) {
  const doc = await pdfjs.getDocument(pdf).promise;
  const numPages = await doc._pdfInfo.numPages;
  contenido = [];
  for (i = 1; i <= numPages; i++) {
    let page = await doc.getPage(i);
    let pageText = await page.getTextContent();
    pageText.items.map((item) => {
      if (item.str != ' ' && item.str != '') {
        contenido.push(item.str);
      }
    });
  }
  return contenido;
}
async function esDigno(pdf) {
  contenido = await getContent(pdf);
  if (contenido.includes('Sensitive But Unclassified(SBU)')) {
    return true;
  } else {
    return false;
  }
}
function pdfFechaToDate(fecha) {
  let dateComponents = fecha.split(',');
  let datePieces = dateComponents[0].split('/');
  //let timePieces = dateComponents[1].split(':');
  datePieces[2] = parseInt(datePieces[2]) + 2000;
  return new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
}

function buscarEnContenido(dato, contenido) {
  for (let i = 0; i <= contenido.length; i++) {
    if (contenido[i] == dato) {
      return contenido[i + 1];
    }
  }
}
//aqui empiezan los retornos

async function datos(pdf) {
  content = await getContent(pdf);
  const datosBusqueda = {
    name: 'Full Name in Native Language:',
    id: 'National Identification Number:',
    city: 'City:',
    address: 'Home Address:',
    phone: 'Primary Phone Number:',
    email: 'Email Address:',
    passport: 'Passport/Travel Document Number:',
    purpose: 'Purpose of Trip to the U.S. (1):',
    issued: 'Have you ever been issued a U.S. visa?',
    refused:
      'Have you ever been refused a U.S. Visa, or been refused admission to',
  };
  //extraer fecha
  losdatos = {};
  losdatos.date = pdfFechaToDate(content[0]);
  for (const property in datosBusqueda) {
    //console.log(`${property}: ${object[property]}`);
    losdatos[property] = buscarEnContenido(datosBusqueda[property], content);
  }
  return losdatos;
}
//datos(listaPDF).then((p) => fs.writeFileSync('./puto.txt', JSON.stringify(p)));
//datos(listaPDF).then((p) => console.log(p));
//console.log(new Date('Tue Jun 28 2022 00:00:00 GMT-0600'));
module.exports = { getContent, esDigno, datos };
