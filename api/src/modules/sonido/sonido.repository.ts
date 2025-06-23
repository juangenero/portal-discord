import prisma from '../../config/prisma.config';
import { AppError } from '../../shared/errors/error-factory';

// Obtener todos los sonidos
export async function getSonidos() {
  try {
    const result = await prisma.sonido.findMany({
      select: { id: true, nombre: true, emoji: true },
      // take: 30,
    });
    return result;
  } catch (error) {
    throw new Error(`getSonidos -> ${error}`);
  }
}

// Obtener sonido por ID
export async function getMetadataSonidoByIdBD(id: number) {
  try {
    const result = await prisma.sonido.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nombre: true,
        filename: true,
      },
    });

    if (!result) throw new AppError(`No existe ningún sonido con ID ${id}`);

    return result;
  } catch (error) {
    throw new Error(`getMetadataSonidoByIdBD -> ${error}`);
  }
}

export async function getFileByIdBD(id: number) {
  try {
    const result = await prisma.sonido.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        file: true,
      },
    });

    if (!result) throw new AppError(`No existe ningún sonido con ID ${id}`);

    return result;
  } catch (error) {
    throw new Error(`getFileByIdBD -> ${error}`);
  }
}

// Crear sonido
export async function createSonido(sonido: any) {
  try {
    const result = await prisma.sonido.create({
      data: sonido,
    });
    return result;
  } catch (error) {
    throw new Error(`createSonido -> ${error}`);
  }
}
