import { addSonidoApi, getSonidosApi, playSonidoApi } from '@/services/api.service';
import { useState } from 'react';

export function useSonidoLogic() {
  const [sonidos, setSonidos] = useState<any[]>([]);
  const [sonidosFiltered, setSonidosFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

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
  };
}
