import { Input } from '@heroui/react';
import { useEffect } from 'react';
import { useSonido } from '../SonidoContext';
import CardSonido from './CardSonido';
import AddSonido from './create/AddSonido';
// import AddAudio from './AddAudio.js';

function Sonidos() {
  const { fetchSonidos, search, handleSearchSonido, sonidosFiltered } = useSonido();

  useEffect(() => {
    fetchSonidos();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Añadir sonido */}
      <div className="mb-3">
        <AddSonido />
      </div>

      {/* Buscador */}
      <div className="w-96 mb-3">
        <Input label="Buscar" value={search} onChange={(e) => handleSearchSonido(e.target.value)} />
      </div>

      {/* Contador de sonidos */}
      <p className="text-xl mb-5">{`Mostrando ${sonidosFiltered.length} sonidos`}</p>

      {/* Lista de sonidos */}
      <div>
        {sonidosFiltered.length < 1 && <p>No se encontraron audios</p>}

        {sonidosFiltered.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {sonidosFiltered.map((sonido: any) => (
              <div key={sonido.id}>
                <CardSonido sonido={sonido} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sonidos;
