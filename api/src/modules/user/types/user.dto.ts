export interface UserDto {
  id: string;
  username: string;
  avatarHash: string;
  fechaCreacion?: Date | null;
  fechaActualizacion?: Date | null;
}
