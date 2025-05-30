export const ResponseListSessionSchema = {
  type: 'array',
  items: {
    $ref: '#/components/schemas/ResponseSession',
  },
  description: 'Una lista de sesiones de usuario',
  example: [
    {
      id: 'de80dbd3-bdbd-4302-a39b-6c70d073b52e',
      idUser: '3914567890986835',
      fechaActualizacion: '2025-05-29T19:57:44.718Z',
      deviceInfo: {
        ip: '84.122.225.10',
        pais: 'Spain',
        ciudad: 'Sevilla',
        region: 'Andalusia',
        sistemaOperativo: 'Windows',
        navegador: 'Chrome',
        tipoDispositivo: 'Mobile',
      },
    },
    {
      id: '54f9bb25-163d-4356-a101-388c1f9e46f9',
      idUser: '1234567890986765',
      fechaActualizacion: '2025-05-22T10:16:55.709Z',
      deviceInfo: {
        ip: '84.122.225.11',
        pais: 'Spain',
        ciudad: 'Alcalá de Guadaira',
        region: 'Andalusia',
        sistemaOperativo: 'Windows',
        navegador: 'Mozilla',
      },
    },
  ],
};

export const ResponseSessionSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Identificador único de la sesión',
      example: 'de80dbd3-bdbd-4302-a39b-6c70d073b52e',
    },
    idUser: {
      type: 'string',
      description: 'Identificador del usuario asociado a la sesión',
      example: '12345678901234',
    },
    fechaActualizacion: {
      type: 'string',
      format: 'date-time',
      description: 'Fecha y hora de la última actualización de la sesión',
      example: '2025-05-29T19:57:44.718Z',
    },
    deviceInfo: {
      $ref: '#/components/schemas/ResponseDeviceInfo',
    },
  },
  required: ['id', 'idUser', 'fechaActualizacion', 'deviceInfo'],
  description: 'Representa una sesión de usuario individual con su información de dispositivo',
};

export const ResponseDeviceInfoSchema = {
  type: 'object',
  properties: {
    ip: {
      type: 'string',
      description: 'Dirección IP del cliente',
      example: '84.122.225.10',
    },
    pais: {
      type: 'string',
      description: 'País desde donde se realizó la petición',
      example: 'Spain',
    },
    ciudad: {
      type: 'string',
      description: 'Ciudad desde donde se realizó la petición',
      example: 'Alcalá de Guadaira',
    },
    region: {
      type: 'string',
      description: 'Región o estado desde donde se realizó la petición',
      example: 'Andalusia',
    },
    sistemaOperativo: {
      type: 'string',
      description: 'Sistema operativo del dispositivo',
      example: 'Windows',
    },
    navegador: {
      type: 'string',
      description: 'Navegador utilizado en el dispositivo',
      example: 'Chrome',
    },
    tipoDispositivo: {
      type: 'string',
      description: 'Tipo de dispositivo utilizado',
      example: 'Mobile',
    },
  },
  required: ['ip'],
  description:
    'Contiene información detallada sobre el dispositivo desde el que se inició la sesión',
};
