import { PayloadJwt } from '../modules/session/session.types';

declare global {
  namespace Express {
    export interface Request {
      payload?: PayloadJwt;
    }
  }
}

export {};
