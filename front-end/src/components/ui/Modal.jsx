import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import GroupDropdown from './GroupDropdown';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function ModalCreate({ dropdownGroupList, dropdownUserList }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}

      >
        <Box sx={style}>
          <div>
            <p>Select a Group</p>
            <GroupDropdown groupList={dropdownGroupList} />
          </div>
          <div>
            <p>Select a User</p>
            <GroupDropdown groupList={dropdownUserList} />
          </div>


        </Box>
      </Modal>
    </div>
  );
}
export default ModalCreate;
