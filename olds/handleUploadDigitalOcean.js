import AWS from 'aws-sdk';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
const path = './pdfs';
// Your imports above
// This will load all your environment variables from env file into your process
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});
async function uploadFile(archivo) {
  const file = fs.readFileSync(`${path}/${archivo}`);
  const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  s3.putObject(
    {
      Bucket: process.env.DO_SPACES_NAME,
      Key: archivo,
      Body: file,
      ACL: 'public-read',
    },
    (err, data) => {
      if (err) return console.log(err);
      //console.log('Your file has been uploaded successfully!', data);
    }
  );
}

export { uploadFile };
