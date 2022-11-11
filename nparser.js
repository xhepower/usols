/*const pdfParse = require('pdf-parse');
const fs = require('fs');
const { sacarImagen } = require('./sacar-imagen-pdf.mjs');*/
import pdfParse from 'pdf-parse';
import { exportImages } from 'pdf-export-images';
import * as fs from 'fs';
//import { sacarImagenPdf } from './sacar-imagen-pdf.js';
const elpdf =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationdanie2.pdf';
const otropdf =
  './pdf/zxzxzx/Consular Electronic Application Center - Print Applicationmede.pdf';

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

async function esDigno(pdf) {
  const contenido = await getContent(pdf);
  if (contenido.includes('Application - Sensitive But Unclassified(SBU)')) {
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
const sacarImagen = async (pdf, tipo) => {
  await exportImages(pdf, 'images');
  const photo = fs.readFileSync('./images/img_p0_2.png', {
    encoding: 'base64',
  });
  const barcode = fs.readFileSync('./images/img_p0_3.png', {
    encoding: 'base64',
  });
  if ((tipo = 'photo')) {
    return photo;
  } else {
    return barcode;
  }
};
const fechaDDMMAAAA = (fecha) => {
  let day = fecha.getDate();
  let month = fecha.getMonth() + 1;
  let year = fecha.getFullYear();

  if (month < 10) {
    return `${day}0${month}${year}`;
  } else {
    return `${day}${month}${year}`;
  }
};
const nombreDeArchivo = (datos) => {
  let guionesbajos = datos.name.split(' ').join('_');
  const nombre = `usol-${fechaDDMMAAAA(datos.date)}-${guionesbajos}-${
    datos.idNumber
  }`;
  return nombre;
};
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
  const content = await getContent(pdf);
  let datos = {};
  datos.date = pdfFechaToDate(content[0]);
  // datos.photo = await sacarImagen(pdf, 'photo');
  // datos.barcode = await sacarImagen(pdf, 'barcode');

  await Promise.all(
    Object.keys(datosBusqueda).map(async (key) => {
      datos[key] = await buscarEnContenido(datosBusqueda[key], content);
    })
  );
  datos.file = nombreDeArchivo(datos);
  if (datos.issued !== 'NO') {
    datos.estado = 'proceso';
  }
  return datos;

  //return content;
}
(async () => {})();
export { getContent, esDigno, datos, nombreDeArchivo };
