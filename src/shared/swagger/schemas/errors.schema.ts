export const Error500Schema = {
  type: 'object',
  properties: {
    error: {
      type: 'boolean',
      description: 'Indica si ha ocurrido un error',
      example: true,
    },
    status: {
      type: 'integer',
      description: 'Código de estado HTTP de la respuesta de error',
      example: 500,
    },
    message: {
      type: 'string',
      description: 'Mensaje de error general',
      example: 'Error interno del servidor',
    },
    details: {
      type: 'string',
      nullable: true,
      description: 'Detalles adicionales sobre el error, si los hay',
      example: null,
    },
    id: {
      type: 'string',
      format: 'nanoid',
      description: 'ID único de la instancia del error para seguimiento',
      example: 'kaJXO2iT9OcYQntSfO6n',
    },
  },
  required: ['error', 'status', 'message', 'id'],
};

export const Error400Schema = {
  type: 'object',
  properties: {
    error: {
      type: 'boolean',
      description: 'Indica si ha ocurrido un error',
      example: true,
    },
    status: {
      type: 'integer',
      description: 'Código de estado HTTP de la respuesta de error',
      example: 400,
    },
    message: {
      type: 'string',
      description: 'Mensaje de error de validación',
      example: 'Error al validar los parámetros de la solicitud',
    },
    details: {
      type: 'string',
      nullable: true,
      description: 'Detalles adicionales sobre el error, si los hay',
      example: 'El parámetro X es requerido',
    },
    id: {
      type: 'string',
      format: 'nanoid',
      description: 'ID único de la instancia del error para seguimiento',
      example: 'kaJXO2iT9OcYQntSfO6n',
    },
  },
  required: ['error', 'status', 'message', 'id'],
};

export const Error401Schema = {
  type: 'object',
  properties: {
    error: {
      type: 'boolean',
      description: 'Indica si ha ocurrido un error',
      example: true,
    },
    status: {
      type: 'integer',
      description: 'Código de estado HTTP de la respuesta de error',
      example: 401,
    },
    message: {
      type: 'string',
      description: 'Mensaje de error de no autenticado',
      example: 'No autorizado',
    },
    details: {
      type: 'string',
      nullable: true,
      description: 'Detalles adicionales sobre el error, si los hay',
      example: null,
    },
    id: {
      type: 'string',
      format: 'nanoid',
      description: 'ID único de la instancia del error para seguimiento',
      example: 'kaJXO2iT9OcYQntSfO6n',
    },
  },
  required: ['error', 'status', 'message', 'id'],
};

export const Error429Schema = {
  type: 'object',
  properties: {
    error: {
      type: 'boolean',
      description: 'Indica si ha ocurrido un error',
      example: true,
    },
    status: {
      type: 'integer',
      description: 'Código de estado HTTP de la respuesta de error',
      example: 429,
    },
    message: {
      type: 'string',
      description: 'Mensaje de error de rate limit',
      example: 'Rate limit superado',
    },
    details: {
      type: 'string',
      nullable: true,
      description: 'Detalles adicionales sobre el error, si los hay',
      example: 'Demasiadas solicitudes consecutivas a la API',
    },
    id: {
      type: 'string',
      format: 'nanoid',
      description: 'ID único de la instancia del error para seguimiento',
      example: 'kaJXO2iT9OcYQntSfO6n',
    },
  },
  required: ['error', 'status', 'message', 'id'],
};
