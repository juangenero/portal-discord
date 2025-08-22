import { createContext, ReactNode, useContext } from 'react'; // Agregamos ReactNode para tipar children
import { useSonidoLogic } from './SonidoLogic';

// 1. Define la interfaz para el tipo de contexto
export type SonidoContextType = {
  // Listar sonidos
  sonidos: any[];
  fetchSonidos: () => Promise<void>;

  // Buscar sonidos
  search: string;
  handleSearchSonido: (str: string) => void;
  sonidosFiltered: any[];

  // Añadir sonidos
  handleAddSonido: (formData: any) => Promise<void>;

  // Reproducir sonidos
  handlePlayClick: (idSonido: any) => void;

  // Descargar sonido
  handleDownloadSonido: (idSonido: any, nameSonido?: string) => void;
};

// 2. Crea el contexto con un tipo inicial de null o el tipo definido
const SonidoContext = createContext<SonidoContextType | null>(null);

// 3. Tipa las props del proveedor
export const SonidoProvider = ({ children }: { children: ReactNode }) => {
  return <SonidoContext.Provider value={useSonidoLogic()}>{children}</SonidoContext.Provider>;
};

export const useSonido = () => {
  const context = useContext(SonidoContext);
  if (!context) {
    throw new Error('useSonido debe usarse dentro de SonidoProvider');
  }
  return context;
};
