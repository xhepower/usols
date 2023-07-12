export const fechaDDMMAAAA = (fecha) => {
  let day = fecha.getDate();
  let month = fecha.getMonth() + 1;
  let year = fecha.getFullYear();

  if (month < 10) {
    return `${day}0${month}${year}`;
  } else {
    return `${day}${month}${year}`;
  }
};
export const partirArray = async (array, longitud) => {
  let arregloDeArreglos = [];
  for (let i = 0; i < array.length; i += longitud) {
    let pedazo = array.slice(i, i + longitud);
    arregloDeArreglos.push(pedazo);
  }
  return arregloDeArreglos;
};
