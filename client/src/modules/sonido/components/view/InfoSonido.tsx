import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react';

const InfoSonido = (props: any) => {
  const { sonido, openModalInfo, setOpenModalInfo } = props;

  function handleCloseModal() {
    setOpenModalInfo(false);
  }

  return (
    <Drawer isOpen={openModalInfo} onClose={handleCloseModal} placement="bottom">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">Detalles</DrawerHeader>
        <DrawerBody>
          <p>Nombre: {sonido?.nombre}</p>
          <p>
            Fecha de creación:{' '}
            {sonido.createdAt ? new Date(sonido.createdAt).toLocaleString() : '—'}
          </p>
          <p>Autor: xneoxz</p>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};

export default InfoSonido;
