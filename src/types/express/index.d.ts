import { PayloadJwt } from '../modules/session/session.dto';

declare global {
  namespace Express {
    export interface Request {
      payloadJwt?: PayloadJwt;
    }
  }
}

export {};
