import pdfParse from 'pdf-parse';
import { exportImages } from 'pdf-export-images';
const pdfPrueba = './usol-pdfs/ANA BESSY MEJIA.pdf';
export const getContent = async (pdf) => {
  try {
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
  } catch (error) {
    throw new Error(error);
  }
};

// exportImages(pdfPrueba, 'photos')
//   .then((images) => console.log('Exported', images.length, 'images'))
//   .catch(console.error);

export function esDigno(contenido) {
  if (contenido.includes('Application - Sensitive But Unclassified(SBU)')) {
    return true;
  } else {
    return false;
  }
}

export function datosPDF(content) {
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

  let datos = {};
  datos.fecha = fechaPDF(content[0]);
  Object.keys(datosBusqueda).map((key) => {
    datos[key] = (() => {
      for (let i = 0; i <= content.length; i++) {
        if (content[i] == datosBusqueda[key]) {
          return content[i + 1];
        }
      }
    })();
  });
  if (datos.issued !== 'NO') {
    datos.estado = 'proceso';
  }
  return datos;
}
export const fechaPDF = (fechita) => {
  let rta;
  try {
    if (fechita == 'Online Nonimmigrant Visa Application (DS-160)') {
      rta = null;
    }
    let datePieces = fechita.split('/');
    datePieces[2] = parseInt(datePieces[2]) + 2000;
    rta = new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
  } catch (error) {
    rta = null;
  }
  return rta;
};
export function nombrePDF(datos) {
  const fecha =
    datos.fecha == null
      ? 'null'
      : datos.fecha.getDate() + '-' + datos.fecha.getMonth();
  return datos.idNumber + '-' + datos.passport + '-' + fecha;
}
