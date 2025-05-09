import { Usuario } from '../../../prisma/client';
import { UsuarioDto } from './user.dto';
import { upsertUserByDiscordId } from './user.model';

export async function createUpdateUsuario(input: UsuarioDto): Promise<UsuarioDto> {
  const usuario: Usuario = await upsertUserByDiscordId(input);

  // Convertir la entidad a DTO
  const usuarioDto: UsuarioDto = {
    idDiscord: usuario.idDiscord,
    nombre: usuario.nombre,
    avatarUrl: usuario.avatarUrl,
    accessTokenDiscord: usuario.accessTokenDiscord,
    refreshTokenDiscord: usuario.refreshTokenDiscord,
    accessTokenExpire: usuario.accessTokenExpire,
  };

  return usuarioDto;
}
