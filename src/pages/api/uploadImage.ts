/* import type { NextApiRequest, NextApiResponse } from 'next'; */
import { fireStorage } from '../../configs/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import fs from 'fs';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

type ProcessedFiles = Array<[string, File]>;

async function uploadFile(file: any, filename: any) {
  const storageRef = ref(fireStorage, new Date().toLocaleDateString('sv-SE') + '/' + filename);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  console.log('url: ', url);

  return url;
}

const handler = async (req: any, res: any) => {
  let status = 200,
    resultBody = { status: 'ok', message: 'Files were uploaded successfully', url: '' };

  /* Get files using formidable */
  const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    const files: ProcessedFiles = [];
    form.on('file', function (field, file) {
      files.push([field, file]);
    });
    form.on('end', () => resolve(files));
    form.on('error', err => reject(err));
    form.parse(req, () => {
      //
    });
  }).catch(e => {
    console.log(e);
    status = 500;
    resultBody = {
      status: 'fail',
      message: 'Upload error',
      url: ''
    };
  });

  if (files?.length) {
    for (const file of files) {
      const formFile = file[1];
      const fileRef = fs.readFileSync(formFile.filepath);
      const url = await uploadFile(fileRef, formFile.originalFilename);
      console.log('uploadRes:', url);
      resultBody.url = url;
      fs.rmSync(formFile.filepath);
    }
  }

  res.status(status).json(resultBody);
};

export default handler;
