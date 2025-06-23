import fs from 'fs';
import path from 'path';
import { sendMessageDiscord } from '../../integrations/discord/bot/utils';
import { AppError } from '../../shared/errors/error-factory';
import log from '../../shared/utils/log/logger';
import { playSoundDiscord } from '../discord/discord.service';
import {
  createSonido,
  deleteSonidoDB,
  getSonidoById,
  getSonidos,
} from '../sonido/sonido.repository';

const uploads = `${__dirname}/../../../uploads/`;

export async function crearSonido(nombre: any, audioName: any, audioBase64: any, emoji: any) {
  try {
    const result = createSonido({
      nombre: nombre,
      filename: audioName,
      file: audioBase64,
      emoji: emoji,
    });

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Obtener lista de sonidos
export async function obtenerSonidos() {
  try {
    const result = await getSonidos();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function reproducirSonido(id: number, userId: string, username: string) {
  try {
    // TODO - por optimizar ..
    const filename = await checkAudioFileSystem(id);
    const result = await playSoundDiscord(filename, userId);
    const sonido = await getSonidoById(id);

    // Enviar mensaje al canal de discord
    let msg = `**${username}** reprodujo '**${sonido?.nombre}**'`;
    await sendMessageDiscord(msg);

    return result;
  } catch (error: any) {
    throw new AppError(error);
  }
}

export async function deleteSonido(id: any) {
  try {
    deleteSonidoDB(id);
    // eliminarArchivo(path.join(uploads, result.filename));
    return 'ok';
  } catch (error: any) {
    throw new AppError(error);
  }
}

async function getFileNameById(id: any) {
  try {
    const sonido = await getSonidoById(id);
    return sonido?.filename;
  } catch (error: any) {
    throw new AppError(error);
  }
}

// Check si el archivo existe en el sistema de archivos
async function checkAudioFileSystem(id: any) {
  log.debug('INICIO checkAudioFileSystem');
  const filename = await getFileNameById(id);

  if (filename) {
    const filePath = path.join(uploads, filename);

    try {
      // Comprueba si el archivo existe
      await fs.promises.access(filePath, fs.constants.F_OK);
      return filename; // Si el archivo existe, retorna el nombre del archivo
    } catch (err) {
      log.debug(`Descargando ${filename} en el sistema de archivos`);
    }

    try {
      // Si no existe, lo descarga de la BD
      const sonido = await getSonidoById(id);

      if (sonido) {
        await fs.promises.writeFile(filePath, sonido.file);
      }
    } catch (err) {
      log.error(`Error guardando el audio de la BD: ${err}`);
    }

    return filename;
  }
}

// Eliminar archivo del sistema de archivos
function eliminarArchivo(nombreArchivo: any) {
  fs.unlink(nombreArchivo, (err) => {
    if (err) {
      log.error(`Error al eliminar el archivo: ${err.message}`);
      return;
    }
  });
}
