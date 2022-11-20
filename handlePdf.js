import pdfParse from 'pdf-parse';
import { exportImages } from 'pdf-export-images';
import * as fs from 'fs';
import * as utils from './utils.js';
const pdf1 = './pdfs/ANGIE NAVARRETE (3rd copy).pdf';
const pdf2 =
  './pdfs/Consular Electronic Application Center - Print Applicationema.pdf';

export const getContent = async (pdf) => {
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
export async function esDigno(pdf) {
  const contenido = await getContent(pdf);
  if (contenido.includes('Application - Sensitive But Unclassified(SBU)')) {
    return true;
  } else {
    return false;
  }
}
export const nombreDeArchivo = (datos) => {
  let guionesbajos = datos.name.split(' ').join('_');
  const nombre = `usol-${utils.fechaDDMMAAAA(datos.date)}-${guionesbajos}-${
    datos.idNumber
  }-${datos.phone}-${datos.passport}.pdf`;
  return nombre;
};
export async function datos(pdf) {
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
  const content = await getContent(pdf);
  let datos = {};

  datos.date = (() => {
    let datePieces = content[0].split('/');
    datePieces[2] = parseInt(datePieces[2]) + 2000;
    return new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
  })();

  await Promise.all(
    Object.keys(datosBusqueda).map((key) => {
      datos[key] = (() => {
        for (let i = 0; i <= content.length; i++) {
          if (content[i] == datosBusqueda[key]) {
            return content[i + 1];
          }
        }
      })();
    })
  );
  datos.file = nombreDeArchivo(datos);
  if (datos.issued !== 'NO') {
    datos.estado = 'proceso';
  }
  return datos;
}
(async () => {
  // console.log((await datos(pdf1)).name);
})();
