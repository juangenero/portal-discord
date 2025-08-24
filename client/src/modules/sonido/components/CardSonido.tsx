import { Download, Info, PopupMenu, Reproducir } from '@/shared/components/Icons.js';
import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from '@heroui/react';
import { useState } from 'react';
import { useSonido } from '../SonidoContext.js';
import InfoSonido from './view/InfoSonido.js';

const CardSonido = ({ sonido }: { sonido: any }) => {
  const { handlePlayClick, handleDownloadSonido } = useSonido();
  const urlEmojis: string = `https://cdn.jsdelivr.net/npm/emoji-datasource-twitter/img/twitter/64/${sonido.emoji}.png`;

  const [isDisabled, setIsDisabled] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true);
    handlePlayClick(sonido.id);

    // Deshabilitar 2 segundos la card cuando se haga click para reproducir un sonido
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <div className="relative w-64">
      {/* Card */}
      <div
        onClick={handleClick}
        className={`relative duration-200 hover:scale-105
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <Card>
          <CardHeader className="flex items-center justify-center">
            <Image alt="Emoji" src={urlEmojis} width={48} />
          </CardHeader>
          <CardBody className="flex items-center justify-center">
            <p className="uppercase font-bold">{sonido.nombre}</p>
          </CardBody>
        </Card>
      </div>

      {/* Menu Card */}
      <Dropdown placement="right">
        <DropdownTrigger>
          <div className="absolute z-10 top-2 right-2 cursor-pointer">
            <PopupMenu color="gray" />
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key="play"
            startContent={<Reproducir size={20} />}
            onPress={() => {
              handleDownloadSonido(sonido.id);
            }}
          >
            Reproducir (para mi)
          </DropdownItem>
          <DropdownItem
            key="download"
            startContent={<Download size={20} />}
            onPress={() => {
              handleDownloadSonido(sonido.id, sonido.nombre);
            }}
          >
            Descargar
          </DropdownItem>
          <DropdownItem
            key="info"
            startContent={<Info />}
            onPress={() => {
              setOpenModalInfo(true);
            }}
          >
            Ver detalles
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Modal info sonido */}
      <InfoSonido
        openModalInfo={openModalInfo}
        setOpenModalInfo={setOpenModalInfo}
        sonido={sonido}
      />
    </div>
  );
};

export default CardSonido;
