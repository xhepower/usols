const pdfjs = require('pdfjs-dist/legacy/build/pdf');
const fs = require('fs');
const { json } = require('express');

//aquie empiezan las functions
async function getContent(pdf) {
  const doc = await pdfjs.getDocument(await pdf).promise;
  const numPages = await doc._pdfInfo.numPages;
  contenido = [];
  for (i = 1; i <= (await numPages); i++) {
    let page = await doc.getPage(i);
    let pageText = await page.getTextContent();
    pageText.items.map(async (item) => {
      if (item.str != ' ' && item.str != '') {
        await contenido.push(item.str);
      }
    });
  }
  return contenido;
}
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
  let dateComponents = fecha.split(',');
  let datePieces = dateComponents[0].split('/');
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
    name: 'Full Name in Native Language:',
    idNumber: 'National Identification Number:',
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
  losdatos = {};
  await Promise.all(
    Object.keys(datosBusqueda).map(async (key) => {
      let content = await getContent(pdf);
      losdatos.date = pdfFechaToDate(await content[0]);
      losdatos[key] = await buscarEnContenido(
        datosBusqueda[key],
        await content
      );
    })
  );
  return losdatos;
}
//datos(listaPDF).then((p) => fs.writeFileSync('./puto.txt', JSON.stringify(p)));
//datos(listaPDF).then((p) => console.log(p));
//console.log(new Date('Tue Jun 28 2022 00:00:00 GMT-0600'));
module.exports = { getContent, esDigno, datos };
