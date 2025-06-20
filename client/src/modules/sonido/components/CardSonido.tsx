import { Card, CardBody, CardHeader, Image } from '@heroui/react';
import { useState } from 'react';
import { useSonido } from '../SonidoContext.js';

const CardSonido = ({ sonido }: { sonido: any }) => {
  const { handlePlayClick } = useSonido();
  const urlEmojis: string = `https://cdn.jsdelivr.net/npm/emoji-datasource-twitter/img/twitter/64/${sonido.emoji}.png`;

  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true);
    handlePlayClick(sonido.id);

    // Deshabilitar 3 segundos cuando se haga click
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);
  };

  return (
    <div
      onClick={handleClick}
      className={`duration-200 hover:scale-110
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
  );
};

export default CardSonido;
