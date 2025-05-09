export interface TokenDiscordResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string; // scopes separados por espacio
}

export interface UsuarioDiscord {
  id: string;
  username: string;
  avatar: string;
}
