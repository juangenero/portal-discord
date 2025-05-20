import { PayloadJwt } from '../modules/session/session.dto';

declare global {
  namespace Express {
    export interface Request {
      payload?: PayloadJwt;
    }
  }
}

export {};
