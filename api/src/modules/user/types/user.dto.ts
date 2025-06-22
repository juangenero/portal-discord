export interface UserDto {
  id: string;
  username: string;
  avatarHash: string | null;
  fechaCreacion?: Date | null;
  fechaActualizacion?: Date | null;
}
