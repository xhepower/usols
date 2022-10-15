/*TODO LIST **QUE JODE ESA TITI**

-!!!! elimine todos los datos que no sean carpeta
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
const pdfPath = './pdf';
const { esDigno, datos } = require('./parser');
const borrarArchivo = (path) => {
  fs.unlinkSync(path);
};
const borrarCarpeta = (path) => {
  fs.rmdirSync(path);
};
const nombreDeArchivo = async (datos) => {
  //return datos;
  return `usol-${datos.date}-${datos.name}-${datos.id}-${datos.city}-${datos.phone}`;
};
const purgar = async () => {
  //-elimine todos los datos que no sean carpeta

  files = fs.readdirSync(pdfPath);
  const carpetas = [];
  files.map((f) => {
    if (fs.statSync(`${pdfPath}/${f}`).isDirectory()) {
      carpetas.push(f);
    } else {
      borrarArchivo(`${pdfPath}/${f}`);
    }
  });
  //eliminar todas las carpetas que esten dentro de la carpeta de usuarios
  const pdfNuevosConRuta = [];
  carpetas.map((c) => {
    files = fs.readdirSync(`${pdfPath}/${c}`);
    files.map((f) => {
      if (fs.statSync(`${pdfPath}/${c}/${f}`).isDirectory()) {
        borrarCarpeta(`${pdfPath}/${c}/${f}`);
      } else {
        if (
          path.extname(f) == '.pdf' &&
          fs.statSync(`${pdfPath}/${c}/${f}`).size > 0
        ) {
          if (f.substr(0, 4) == 'usol') {
          } else {
            pdfNuevosConRuta.push(`${pdfPath}/${c}/${f}`);
          }
        } else {
          borrarArchivo(`${pdfPath}/${c}/${f}`);
        }
      }
    });
  });
  pdfDignos = (async () => {
    return await Promise.all(
      pdfNuevosConRuta.map(async (pdf) => {
        dignidad = await esDigno(pdf);
        if (dignidad == true) {
          return await datos(pdf);
        } else {
          borrarArchivo(pdf);
        }
      })
    );
  })();
  console.log(
    await Promise.all(
      (
        await pdfDignos
      ).map(async (p) => {
        return await nombreDeArchivo(p);
      })
    )
  );
};
(trabajo = async () => {
  await purgar();
})();

module.exports = trabajo;
