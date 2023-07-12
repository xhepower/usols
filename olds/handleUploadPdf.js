import { google } from 'googleapis';
import * as fs from 'fs';
import readline from 'readline';
import { elpath } from './absolutePath.js';
const path = './pdfs';
//const file = 'usol-1072022-JUANIRA_ESMERALDA-0301199401113.pdf';
import pdfParse from 'pdf-parse';
class Gdrive {
  constructor() {}
}
async function upload(file) {
  const SCOPES = ['https://www.googleapis.com/auth/drive', 'profile'];
  const auth = new google.auth.GoogleAuth({
    keyFile: elpath('usolb-368100-4c1fc40a5f43.json'),
    scopes: SCOPES,
  });
  let fileID;
  const driveService = new google.drive({ version: 'v3', auth });
  let fileMetadata = {
    name: `${file}`,
    parents: ['1jq6y_MFyGGqVnXlNnAaEa--8Sk8ABmO0'],
  };

  let media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(`${path}/${file}`),
  };
  let response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
  switch (response.status) {
    case 200:
      let file = response.result;
      fileID = response.data.id;
      await driveService.permissions.create({
        fileId: fileID,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      const result = await driveService.files.get({
        fileId: fileID,
        fields: 'webViewLink, webContentLink',
      });
      console.log('Created File Id: ', response.data.id);
      console.log(result.data);
      break;
    default:
      console.error('Error creating the file, ' + response.errors);
      break;
  }

  return fileID;
}
async function uploadFile(file) {
  setTimeout(await upload(file), 500);
}
(async () => {})();
export { uploadFile };
