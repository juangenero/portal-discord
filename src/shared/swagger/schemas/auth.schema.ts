// Login
export const ResponseLoginSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      example:
        'https://discord.com/api/oauth2/authorize?client_id=123456789012345678&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=identify',
      description: 'URL para iniciar sesión con Discord',
    },
  },
  required: ['url'],
};

// Callback
export const RequestCallbackSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'Código de autorización de Discord',
    },
    code_verifier: {
      type: 'string',
      example: 'QJ2DsX1YZ-WZ8ga8s_s7Vp8jRDtGJmWep7y7mpiQ2Vs',
      description: 'Código que se derivó del code_challenge en /auth/login',
    },
  },
  required: ['code', 'code_verifier'],
};

export const ResponseAccessTokenSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      description: 'Devuelve el access token del usuario',
    },
  },
  required: ['accessToken'],
};

// Refresh token

// Commons
export const SetCookieRefreshToken = {
  type: 'string',
  description: 'Cookie que contiene el refresh token',
  example:
    'refreshToken=885f4c997f6c236d2e371761f607d6bcd39f101054bc971839e69d99aab99591; Path=/auth; HttpOnly; Secure=true; Expires=Tue, 01 Jan 2026 00:00:00 GMT;',
};
