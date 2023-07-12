import * as fs from 'fs';
import * as dpath from 'path';

const isPDF = (file) => {
  if (
    fs.statSync(`${file}`).isDirectory() ||
    dpath.extname(file).toLowerCase() !== '.pdf'
  ) {
    return false;
  } else {
    return true;
  }
};
export function moverPDF(rutaArchivo, nuevoNombre) {
  const carpetaPdf = fs.readdirSync('./pdfs');
  // datos.pdf = `${nombrePDF(datos)}.pdf`;

  //para moverlo a la carpeta pdf si no existe
  //if (!carpetaPdf.includes(`${nombrePDF(datos)}.pdf`)) {
  if (!carpetaPdf.includes(nuevoNombre)) {
    //console.log(nombrePDF(datos));
    // fs.renameSync(`${path}/${datos.archivo}`, `./pdfs/${nombrePDF(datos)}.pdf`);
    fs.renameSync(rutaArchivo, `./pdfs/${nuevoNombre}`);
  }
}
export { isPDF };
