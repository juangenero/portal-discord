import { FileUpload } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid2,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useAlert } from '../../context/Alert.context.js';
import EmojiPickerModal from './EmojiPickerModal.js';

function AddSonido({ handleAddAudio }) {
  const { showAlert } = useAlert();

  const [openModal, setOpenModal] = useState(false);
  const [openModalEmoji, setOpenModalEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    audioName: '',
    audioFile: null,
    nombre: '',
    icono: {
      id: '',
      emoji: '',
    },
  });
  const [formErrors, setFormErrors] = useState({
    audioFile: false,
    nombre: false,
    emoji: false,
  });

  const fileInputRef = React.useRef(null); // Referencia input archivo
  const emojiInputRef = React.useRef(null); // Referencia input emoji
  const minLengthNombre = 3; // Validaciones
  const maxLengthNombre = 24;
  const maxFileSize = 1048576;

  // MODAL
  const openModalFn = () => {
    setOpenModal(true);
  };

  const closeModalFn = () => {
    cleanValuesForm();
    cleanErrorsForm();
    setOpenModal(false);
    setLoading(false);
  };

  // Botón Guardar
  async function handleSubmit(event) {
    event.preventDefault();

    const formValid = validateForm();
    if (!formValid) return;

    // Lógica para añadir el audio
    const formData = new FormData();
    formData.append('nombre', formValues.nombre);
    formData.append('audio', formValues.audioFile);
    formData.append('emoji', formValues.icono.id);

    setLoading(true);

    // Enviar formdata al backend
    try {
      await handleAddAudio(formData);
      setLoading(false);
      closeModalFn();
      showAlert('Audio subido correctamente', 'success');
    } catch (err) {
      setLoading(false);
      closeModalFn();
      showAlert('Error al subir el audio', 'error');
    }
  }

  // VALIDACIONES
  function validateForm() {
    const audioValido = validateFile(formValues.audioFile);
    const nombreValido = validateNombre(formValues.nombre);
    const emojiValido = validateEmoji(formValues.icono.id);
    setFormErrors({
      ...formErrors,
      audioFile: !audioValido,
      nombre: !nombreValido,
      emoji: !emojiValido,
    });
    return audioValido && nombreValido && emojiValido;
  }

  const validateFile = (file) => {
    let fileExists = file && file.name.length > 0;
    let fileSize = file && file.size < maxFileSize;

    return fileExists && fileSize;
  };

  const validateNombre = (nombre) => {
    let cleanedNombre = nombre.trim();
    let minNombre = cleanedNombre.length >= minLengthNombre;
    let maxNombre = cleanedNombre.length <= maxLengthNombre;

    return minNombre && maxNombre;
  };

  const validateEmoji = (idEmoji) => {
    let emoji = idEmoji.length > 0;
    return emoji;
  };

  // Botón explorar
  function handleFileSelect(event) {
    if (event.target.files.length > 0) {
      setFormValues({
        ...formValues,
        audioFile: event.target.files[0],
        audioName: event.target.files[0]?.name || '',
      });
    }
  }

  // Handle emoji
  function handleClickEmoji(ev) {
    setFormValues({ ...formValues, icono: { id: ev?.unified, emoji: ev?.emoji } });
    setOpenModalEmoji(false);
  }

  // Limpiar valores form
  function cleanValuesForm() {
    setFormValues({
      audioName: '',
      audioFile: null,
      nombre: '',
      icono: {
        id: '',
        emoji: '',
      },
    });
  }

  // Limpiar errores form
  function cleanErrorsForm() {
    const cleanErrors = Object.keys(formErrors).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    setFormErrors(cleanErrors);
  }

  return (
    <Box>
      <Fab color="primary" aria-label="añadir" onClick={openModalFn}>
        <AddIcon />
      </Fab>

      <Dialog open={openModal} onClose={closeModalFn}>
        <DialogTitle>Subir un audio</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={1}>
            {/* 1 - Input / button archivo de audio */}
            <Grid2 size={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                margin="dense"
                placeholder="Elige un audio *"
                error={formErrors.audioFile}
                helperText={formErrors.audioFile && `Elige un audio (1 MB máximo)`}
                value={formValues.audioName}
                fullWidth
                variant="outlined"
                slotProps={{ input: { readOnly: true } }}
                onClick={() => fileInputRef.current?.click()}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<FileUpload />}
                sx={{ ml: 1 }}
              >
                Explorar
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e)}
                  hidden
                />
              </Button>
            </Grid2>

            {/* 2 - Nombre del audio */}
            <Grid2 size={8}>
              <TextField
                margin="dense"
                label="Nombre del audio"
                error={formErrors.nombre}
                helperText={
                  formErrors.nombre && `El nombre debe tener al menos ${minLengthNombre} carácteres`
                }
                fullWidth
                value={formValues.nombre}
                required
                slotProps={{ htmlInput: { maxLength: maxLengthNombre } }}
                onChange={(e) => {
                  setFormValues({ ...formValues, nombre: e.target.value });
                }}
              />
            </Grid2>

            {/* 3 - Icono */}
            <Grid2 size={4}>
              <TextField
                margin="dense"
                label="Emoji"
                fullWidth
                required
                value={formValues.icono?.emoji}
                error={formErrors.emoji}
                helperText={formErrors.emoji && `Selecciona un icono`}
                slotProps={{
                  input: { readOnly: true },
                  inputLabel: { shrink: formValues.icono?.emoji !== '' },
                }}
                ref={emojiInputRef}
                onClick={() => {
                  setOpenModalEmoji(true);
                }}
                onChange={(e) => handleClickEmoji(e)}
              />
              <EmojiPickerModal
                openModalEmoji={openModalEmoji}
                setOpenModalEmoji={setOpenModalEmoji}
                handleClickEmoji={handleClickEmoji}
              />
            </Grid2>

            {/* 4 - Volumen del audio */}
            <Grid2 size={0}></Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModalFn}
            color="danger"
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Cancelar
          </Button>

          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddSonido;
