/*TODO LIST **QUE JODE ESA TITI**

-elimine todos los datos que no sean carpeta
-Que lea las carpetas (si las puede crear con los usuarios mucho mejor aun)
-Que por cada carpeta lea los archivos
-que elimine los que nos son pdf
-que lea los pdf que no estan renombrados
-de los no renombrados que elimine los que no son aptos
-de los aptos que los renombre y guarde en una lista
- que lea la lista de pdf en el servidor
-compare ambas listas y elimine los que ya estan en el servidor
-guarde la lista una por una en la base de datos
-suba los pdf con ese nombre

*/

const fs = require('fs');
const path = require('path');
const pdfPath = './pdf/';

const borrarArchivos = (file) => {
  fs.unlinkSync(file);
};
const carpetas = (() => {
  const archivos = fs.readdirSync(pdfPath);
  const directorios = [];
  archivos.map((item) => {
    const stat = fs.statSync(`${pdfPath}/${item}`);
    if (stat.isDirectory()) {
      directorios.push(item);
    } else {
      borrarArchivos(`${pdfPath}/${item}`);
    }
  });
  return directorios;
})();
//console.log(carpetas);

const leerArchivosServer = async (carpeta) => {
  const archivos = fs.readdirSync(carpeta);
  return archivos;
};

(async () => {
  await carpetas.map(async (carpeta) => {
    const archivos = await leerArchivosServer(`${pdfPath}/${carpeta}`);
    console.log(archivos);
  });
})();
