import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const elpath = (archivo) => {
  return path.join(__dirname, archivo);
};
console.log(elpath('authApi.json'));
export { elpath };
