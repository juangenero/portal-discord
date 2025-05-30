export interface ResponseTokenDiscordData {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string; // scopes separados por espacio
}

export interface ResponseUserDiscordData {
  id: string;
  username: string;
  avatar: string;
}
