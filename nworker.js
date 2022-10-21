const { execFileSync } = require('child_process');
const fs = require('fs');
var rimraf = require('rimraf');
const service = require('./service');
const { get } = require('request');
const dpath = require('path');
const { esDigno, getContent, datos, nombreDeArchivo } = require('./nparser');

const path = './pdfs';
const nombreSinRuta = (nombre) => {
  pos = 0;
  for (i = nombre.length; i >= 0; i--) {
    if (nombre.substring(i) == '/') {
      pos = i;
    }
  }
  return nombre.substring(i, nombre.length);
};

const purgar = () => {
  ArchivosBorrados = 0;
  totalArchivos = fs.readdirSync(path).length;
  fs.readdirSync(path).map((file) => {
    if (
      fs.statSync(`${path}/${file}`).isDirectory() ||
      dpath.extname(file).toLowerCase() !== '.pdf'
    ) {
      rimraf.sync(`${path}/${file}`);
      ArchivosBorrados++;
    }
  });
  console.log(`Total de archivos en la carpeta: ${totalArchivos}`);
  console.log(
    `Carpetas y archivos que no son pdf borrados: ${ArchivosBorrados}`
  );
};

listapdfs = (async () => {
  purgar();
  archivoFromato = 0;
  archivosProcesados = 0;
  aja = await Promise.all(
    fs
      .readdirSync(path)
      .filter((pdf) => {
        //console.log(nombreSinRuta(pdf));
        if (pdf.substring(0, 4) == 'usol') {
          archivosProcesados++;
          return false;
        } else {
          return true;
        }
      })
      .map((pdf) => `${path}/${pdf}`)
      .map(async (pdf) => {
        if ((await esDigno(pdf)) == false) {
          archivoFromato++;
          borrarArchivo(pdf);
        } else {
          return pdf;
        }
      })
  );
  console.log(
    `Archivos PDF que no cumplen el formato borrados: ${archivoFromato}`
  );
  console.log(`Archivos que ya fueron procesados: ${archivosProcesados}`);
  console.log(`Archivos PDF a trabajar: ${aja.length - archivoFromato}`);
  return aja.filter((pdf) => pdf !== undefined);
})();

const borrarArchivo = async (path) => {
  fs.unlinkSync(path);
};

const renombrar = async (archivo) => {
  const adatos = await datos(archivo);
  const anombre = await nombreDeArchivo(adatos);
  nuevoNombre = `${path}/${anombre}.pdf`;
  fs.renameSync(archivo, nuevoNombre);
  return nuevoNombre;
};

const partirArray = async (array) => {
  arregloDeArreglos = []; // Aquí almacenamos los nuevos arreglos
  const LONGITUD_PEDAZOS = 20; // Partir en arreglo de 3
  for (let i = 0; i < array.length; i += LONGITUD_PEDAZOS) {
    let pedazo = array.slice(i, i + LONGITUD_PEDAZOS);
    arregloDeArreglos.push(pedazo);
  }
  return arregloDeArreglos;
};
const guardarArchivo = async (datos) => {
  //return datos;
  //datos.file = await nombreDeArchivo(datos);
  await service.create(datos);
};
const subirArchivo = async (pdf) => {
  service.uploadPDF(pdf);
};
const existe = async (datos) => {
  data = (await service.findByFile(datos.file)).data;
  if (data.length == 0) {
    return false;
  } else {
    return true;
  }
};
const Procesar = async () => {
  array = [];
  archivosRepetidos = 0;
  archivosGuardados = 0;
  lali = await Promise.all(
    (
      await listapdfs
    ).map(async (pdf) => {
      try {
        let dato = await nombreDeArchivo(await datos(pdf));
        if (!array.includes(dato)) {
          array.push(dato);
          return pdf;
        } else {
          borrarArchivo(pdf);
          archivosRepetidos++;
        }
      } catch (error) {
        console.log('pdf:', pdf);
        console.error(error);
      }
    })
  );
  //console.log(array);
  lista = await partirArray(lali);
  const aja = async () => {
    return await Promise.all(
      lista.map(
        async (item) =>
          await Promise.all(
            item.map(async (pdf) => {
              try {
                if ((await existe(await datos(pdf))) == false) {
                  await guardarArchivo(await datos(pdf));
                  nuevoNombre = await renombrar(pdf);
                  //console.log(nuevoNombre);
                  await subirArchivo(nuevoNombre);
                  archivosGuardados++;
                } else {
                  borrarArchivo(pdf);
                  archivosRepetidos++;
                }
              } catch (error) {
                console.log('pdf:', pdf);
                console.error(error);
              }
            })
          )
      )
    );
  };
  await aja();
  console.log('Los archivos repetidos borrados: ' + archivosRepetidos);
  console.log('Los archivos guardados: ' + archivosGuardados);
};
(async () => {
  await Procesar();
  // console.log(await datosAGuardar());
  //fs.writeFileSync('puto.json', JSON.stringify(await Procesar()));
})();
