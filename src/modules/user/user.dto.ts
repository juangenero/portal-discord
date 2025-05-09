export interface UsuarioDto {
  idDiscord: string;
  nombre: string;
  avatarUrl: string;
  accessTokenDiscord?: string | null;
  refreshTokenDiscord?: string | null;
  accessTokenExpire?: Date | null;
}
