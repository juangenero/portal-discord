import prisma from '../../config/prisma.config';

// Obtener todos los sonidos
export async function getSonidos() {
  try {
    const result = await prisma.sonido.findMany({
      select: { id: true, nombre: true, emoji: true },
      take: 30,
    });
    return result;
  } catch (error) {
    throw new Error(`getSonidos -> ${error}`);
  }
}

// Obtener sonido por ID
export async function getSonidoById(id: any) {
  try {
    const result = await prisma.sonido.findUnique({
      where: {
        id: id,
      },
    });

    return result;
  } catch (error) {
    throw new Error(`getSonidoById -> ${error}`);
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

// Actualizar sonido
// export async function updateSonido(sonido) {
//   try {
//     const result = await prisma.sonido.update({
//       where: {
//         id: sonido.id,
//       },
//       data: sonido,
//     });
//     return result;
//   } catch (error) {
//     throw new Error(`updateSonido -> ${error}`);
//   }
// }

// Eliminar sonido
export async function deleteSonidoDB(id: any) {
  try {
    const result = await prisma.sonido.delete({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`deleteSonido -> ${error}`);
  }
}
