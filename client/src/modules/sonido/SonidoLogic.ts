import {
  addSonidoApi,
  downloadSonidoApi,
  getSonidosApi,
  playSonidoApi,
} from '@/services/api.service';
import { useState } from 'react';

export function useSonidoLogic() {
  const [sonidos, setSonidos] = useState<any[]>([]);
  const [sonidosFiltered, setSonidosFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  // Reproducir/Descargar
  const sonidoCache = new Map();
  let currentAudio: HTMLAudioElement | null = null;

  // Obtener sonidos del servidor
  const fetchSonidos = async () => {
    try {
      const response = await getSonidosApi();
      setSonidos(response.data);
      setSonidosFiltered(response.data);
    } catch (error) {
      console.error('Error al recuperar los audios:', error);
    }
  };

  // Añadir audio
  const handleAddSonido = async (formData: any) => {
    try {
      await addSonidoApi(formData);
      fetchSonidos();
    } catch (error) {
      console.error('Error al añadir el sonido: ', error);
    }
  };

  // Buscar sonidos
  const handleSearchSonido = (str: string) => {
    setSearch(str);
    setSonidosFiltered(
      sonidos.filter((audio) => audio.nombre.toLowerCase().includes(str.toLowerCase()))
    );
  };

  // Reproducir sonido
  const handlePlayClick = async (idSonido: any) => {
    await playSonidoApi(idSonido);
  };

  // Descargar o reproduce sonido
  const handleDownloadSonido = async (idSonido: number, nombreArchivo?: string) => {
    try {
      let blob: Blob;
      let format: string;

      // Recuperar sonido de la caché
      if (sonidoCache.has(idSonido)) {
        blob = sonidoCache.get(idSonido).blob;
        format = sonidoCache.get(idSonido).format;
      }

      // Guardar sonido en la caché
      else {
        const res = await downloadSonidoApi(idSonido);
        format = res.headers['content-type'].split('/').pop();
        blob = new Blob([res.data], { type: `${format}` });
        sonidoCache.set(idSonido, { blob, format: format });
      }

      // Crear objeto URL
      const url = URL.createObjectURL(blob);

      // Descargar sonido
      if (nombreArchivo) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreArchivo}.${format === 'mpeg' ? 'mp3' : format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Reproducir sonido
      else {
        if (currentAudio) {
          currentAudio.pause();
        }

        const audio = new Audio(url);
        currentAudio = audio;

        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (currentAudio === audio) {
            currentAudio = null;
          }
        };
      }
    } catch (error) {
      console.error('Error al descargar/reproducir el sonido:', error);
    }
  };

  return {
    // Mostrar sonidos
    sonidos,
    fetchSonidos,

    // Búsqueda
    search,
    handleSearchSonido,
    sonidosFiltered,

    // Añadir sonidos
    handleAddSonido,

    // Reproducir sonido
    handlePlayClick,

    // Descargar sonido
    handleDownloadSonido,
  };
}
