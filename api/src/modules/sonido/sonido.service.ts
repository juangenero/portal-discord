import fs from 'fs';
import path from 'path';
import { AppError } from '../../shared/errors/error-factory';
import { JwtPayloadData } from '../../shared/utils/token/types/token.types';
import { playSoundDiscord } from '../discord/discord.service';
import {
  createSonido,
  getFileByIdBD,
  getMetadataSonidoByIdBD,
  getSonidos,
} from '../sonido/sonido.repository';

// Obtener lista de sonidos
export async function obtenerSonidos() {
  try {
    const result = await getSonidos();
    return result;
  } catch (error: any) {
    throw new AppError(error);
  }
}

// Crear sonido
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
    throw new AppError(error);
  }
}

// Reproducir sonido
export async function reproducirSonido(id: number, payload: JwtPayloadData) {
  try {
    const metadataSonido = await getMetadataSonidoByIdBD(id);
    const filePath = await checkAudioFileSystem(metadataSonido);
    const result = await playSoundDiscord(payload, metadataSonido, filePath);

    return result;
  } catch (error: any) {
    throw new AppError(error);
  }
}

// Check si el archivo existe en el sistema de archivos
async function checkAudioFileSystem(metadataSonido: any) {
  // Definir ruta local
  const uploads = `${__dirname}/../../../uploads/`;
  const filePath = path.join(uploads, metadataSonido.filename);

  // Si el archivo no existe, lo crea en la ruta local
  try {
    await fs.promises.access(filePath);
  } catch (error) {
    try {
      const sonido = await getFileByIdBD(metadataSonido.id);
      await fs.promises.writeFile(filePath, sonido.file);
      console.log(`Sonido '${metadataSonido.nombre}' descargado en '${filePath}'`);
    } catch (error) {
      throw new AppError('Error al guardar el sonido en el sistema de archivos');
    }
  }

  return filePath;
}
