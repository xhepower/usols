const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const fs = require('fs');
const { get } = require('http');
const docvacio =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationmai.pdf';
const doc = './pdf/xzxz/garcia2.pdf';

async function getContent(pdf) {
  //en esta funcion se obtiene todo el texto de un pdf, de todas sus paginas
  //se eliminan las lienas vacias
  //
  contenido = [];
  const doc = await pdfjs.getDocument(pdf).promise;
  const numPages = await doc._pdfInfo.numPages;
  for (let i = 1; i <= numPages; i++) {
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

async function pdfFechaToDate(fecha) {
  let dateComponents = await fecha.split(',');
  let datePieces = await dateComponents[0].split('/');
  let timePieces = await dateComponents[1].split(':');
  datePieces[2] = parseInt(datePieces[2]) + 2000;
  return new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
}

async function esDigno(pdf) {
  getContent(pdf).then((p) => console.log(p));
}

function buscarEnContenido(dato, contenido) {
  for (let i = 0; i <= contenido.length; i++) {
    if (contenido[i] == dato) {
      return contenido[i + 1];
    }
  }
}

async function datos(pdf, content) {
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
  //contenido = await getContent(pdf);
  //extraer fecha
  losdatos = {};
  losdatos.date = await pdfFechaToDate(content[0]);
  for (const property in datosBusqueda) {
    //console.log(`${property}: ${object[property]}`);
    losdatos[property] = buscarEnContenido(
      datosBusqueda[property],
      await contenido
    );
  }
  return losdatos;
}
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
aja = [];
(async () => {
  return await Promise.all(
    listaPDF.map(async (pdf) => {
      return await getContent(pdf);
    })
  );
})().then((w) => fs.writeFileSync('./puto.txt', JSON.stringify(w)));

module.exports = { esDigno, getContent, datos };
