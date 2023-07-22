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
export const pdfSinExtension = (pdf) => {
  return pdf.substring(0, pdf.length - 4);
};
export async function Imagenes(pdf) {
  const photo = (
    await fs.promises.readFile(`./images/${pdf}/img_p0_2.png`)
  ).toString('base64');
  const barcode = (
    await fs.promises.readFile(`./images/${pdf}/img_p0_3.png`)
  ).toString('base64');
  return { photo, barcode };
}
export function escribirJSONBorrarDatos(datos) {
  //esta funcion culera va a borrar los archivos que ya esten en la carpeta y añadira los que no esten ene l json
  const archivosEnDatos = datos.map((dato) => dato.pdf);
  const filesInFolder = fs.readdirSync('./pdfs/');
  const archivos = JSON.parse(fs.readFileSync('./datos.json', 'utf8'));

  console.log(
    'archivos',
    archivos,
    'files',
    filesInFolder,
    'enDatos',
    archivosEnDatos
  );
}
export { isPDF };
