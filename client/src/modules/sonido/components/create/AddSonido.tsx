import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useTheme } from '@heroui/use-theme';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useState } from 'react';
import { useSonido } from '../../SonidoContext';

const AddSonido = () => {
  const MAX_SIZE = 524288; // 500 KB

  const { handleAddSonido } = useSonido();
  const { theme } = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [openModalEmoji, setOpenModalEmoji] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    emoji: { id: string; icon: string };
    file?: File;
  }>({
    name: '',
    emoji: {
      id: '',
      icon: '',
    },
  });

  const [errors, setErrors] = useState<{
    name?: string;
    emoji?: string;
    file?: string;
  }>({});

  // ---- MODALS ----
  function handleCloseModal() {
    console.log('Me cierro!');
    setOpenModal(false);
    resetForm();
  }

  // ---- FORMULARIO ----

  // Enviar formulario
  async function handleSubmit() {
    setLoading(true);

    if (validateForm()) {
      // Crear formdata
      const formData = new FormData();
      formData.append('nombre', form.name);
      formData.append('audio', form.file!);
      formData.append('emoji', form.emoji.id);

      // Petición al backend
      try {
        await handleAddSonido(formData);
        addToast({
          title: 'Sonido añadido',
          severity: 'success',
          color: 'success',
        });
      } catch (err) {
        addToast({
          title: 'Error',
          description: 'No se pudo subir el sonido',
          severity: 'danger',
          color: 'danger',
        });
      }

      setOpenModal(false);
      resetForm();
    }

    setLoading(false);
  }

  // Validar formulario
  function validateForm(): boolean {
    // Variables
    const nameError = 'El nombre debe tener entre 3 y 24 carácteres';
    const emojiError = 'Selecciona un icono';
    const fileError = 'Selecciona un archivo';
    const fileErrorSize = `Selecciona un archivo que ocupe menos de 500 KB`;

    // Validar nombre (longitud)
    let nameValid;
    {
      const name = form.name.trim();
      if (name.length < 3 || name.length > 24) {
        setErrors((prev) => ({ ...prev, name: nameError }));
        nameValid = false;
      } else {
        setErrors((prev) => ({ ...prev, name: undefined }));
        nameValid = true;
      }
    }

    // Validar emoji (longitud)
    let emojiValid;
    {
      const emoji = form.emoji.icon.trim();
      if (emoji.length < 1) {
        setErrors((prev) => ({ ...prev, emoji: emojiError }));
        emojiValid = false;
      } else {
        setErrors((prev) => ({ ...prev, emoji: undefined }));
        emojiValid = true;
      }
    }

    // Validar archivo (existencia y tamaño)
    let fileValid;
    {
      if (!form.file) {
        setErrors((prev) => ({ ...prev, file: fileError }));
        fileValid = false;
      } else if (form.file && form.file.size >= MAX_SIZE) {
        setErrors((prev) => ({ ...prev, file: fileErrorSize }));
        fileValid = false;
      } else {
        setErrors((prev) => ({ ...prev, file: undefined }));
        fileValid = true;
      }
    }

    return nameValid && emojiValid && fileValid;
  }

  // Resetear formulario (valores y errores)
  function resetForm(): void {
    setErrors({});

    setForm({
      name: '',
      emoji: {
        id: '',
        icon: '',
      },
    });
  }

  return (
    <>
      {/* Botón "Añadir sonido" */}
      <Button
        color="primary"
        onPress={() => {
          setOpenModal(true);
        }}
      >
        Añadir sonido
      </Button>

      {/* Modal (Formulario) */}
      <Modal
        isOpen={openModal}
        onClose={handleCloseModal}
        size="lg"
        isDismissable={false}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Añadir sonido</ModalHeader>
          <ModalBody>
            <div className="flex gap-3">
              {/* Nombre del sonido */}
              <Input
                label="Nombre"
                onChange={(ev) => {
                  setForm((prev) => ({ ...prev, name: ev.target.value }));
                }}
                maxLength={24}
                className="w-2/3"
                isInvalid={!!errors.name}
                errorMessage={errors.name}
              />

              {/* Selector de emoji */}
              <div
                onClick={() => {
                  setOpenModalEmoji(true);
                }}
                className="w-1/3"
              >
                <Input
                  label="Icono"
                  value={form.emoji.icon}
                  readOnly
                  isInvalid={!!errors.emoji}
                  errorMessage={errors.emoji}
                />
              </div>
            </div>
            {/* Selector de archivo */}
            <Input
              accept="audio/*"
              type="file"
              onChange={(ev) => {
                setForm((prev) => ({ ...prev, file: ev.target.files?.[0] ?? undefined }));
              }}
              isInvalid={errors.file ? true : false}
              errorMessage={errors.file}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleSubmit} isLoading={loading}>
              Aceptar
            </Button>
            <Button color="danger" variant="light" onPress={handleCloseModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Emojis */}
      <Modal
        isOpen={openModalEmoji}
        onClose={() => {
          setOpenModalEmoji(false);
        }}
        size="5xl"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Selecciona un icono</ModalHeader>
          <ModalBody>
            <EmojiPicker
              open={true}
              skinTonesDisabled={true}
              lazyLoadEmojis={true}
              searchDisabled={true}
              width={975}
              height={700}
              theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
              onEmojiClick={(ev) => {
                setForm((prev) => ({ ...prev, emoji: { id: ev.unified, icon: ev.emoji } }));
                setOpenModalEmoji(false);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddSonido;
