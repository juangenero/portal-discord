import { NextFunction, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import CONFIG from '../../config/env.config';

const { MAX_FILE_SIZE: maxFileSize } = CONFIG;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
}).single('audio');

/** Procesa el archivo, lo almacena en el sistema de archivos
 e incluye en el body el nombre del archivo almacenado y la conversión a base64 */
function fileHandler(req: any, res: Response, next: NextFunction) {
  upload(req, res, function (err) {
    if (err) return res.status(500).json({ error: 'Error al subir el archivo.' });

    // Obtener la ruta del archivo guardado
    const archivoPath = req.file.path;

    // Leer el archivo desde el sistema de archivos y convertirlo a base64
    fs.readFile(archivoPath, (err, data) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: `El archivo es demasiado grande. El tamaño máximo permitido es de ${
              maxFileSize / 1024
            } KB.`,
          });
        }
        return res.status(500).json({ error: 'Error al leer el archivo.' });
      }
      const audioBase64 = data.toString('base64');

      // Agregar el nombre del archivo y el archivo base64 al objeto req.body
      req.body.audioName = req.file.filename;
      req.body.audioBase64 = audioBase64;
      next();
    });
  });
}

export default fileHandler;
