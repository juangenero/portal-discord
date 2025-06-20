import { Dialog } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

function EmojiPickerModal(props) {
  const { openModalEmoji, setOpenModalEmoji, handleClickEmoji } = props;

  // MODAL
  function closeModalEmojiFn() {
    setOpenModalEmoji(false);
  }

  return (
    <>
      <Dialog open={openModalEmoji} onClose={closeModalEmojiFn} maxWidth="lg">
        <EmojiPicker
          open={true}
          emojiStyle="twitter"
          skinTonesDisabled={true}
          lazyLoadEmojis={true}
          width={600}
          height={600}
          onEmojiClick={(ev) => {
            handleClickEmoji(ev);
          }}
        />
      </Dialog>
    </>
  );
}

export default EmojiPickerModal;
