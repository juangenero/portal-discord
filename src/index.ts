import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto 3000 por defecto o el de la variable de entorno

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, Express con TypeScript!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
