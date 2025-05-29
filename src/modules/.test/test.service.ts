import { NextFunction, Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function getLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logPath = join(process.cwd(), 'logs', 'app.log');
    const content = await readFile(logPath, 'utf-8');

    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    next(error);
  }
}

export async function getHeader(req: Request, res: Response, next: NextFunction) {
  res.status(200).json(req.headers);
}
