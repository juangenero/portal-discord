// Fichero común a los comandos de "sonidos"

import { obtenerSonidos } from '../../../../../modules/sonido/sonido.service';
import log from '../../../../../shared/utils/log/logger';

let sonidosCache: { id: number; nombre: string; emoji: string | null }[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 60 minutos

export async function getCacheSonidos() {
  const now = Date.now();
  if (sonidosCache.length === 0 || now - cacheTimestamp > CACHE_TTL) {
    sonidosCache = await obtenerSonidos();
    log.debug(`Actualizando caché de sonidos con ${sonidosCache.length} elementos`);
    cacheTimestamp = now;
  }
  return sonidosCache;
}
