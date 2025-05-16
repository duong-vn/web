import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface IProps {
  show: boolean;
  setShow: (isOpen: boolean) => void;
  user : User;
  setUser: (user: User | null) => void;

}



const ModalDeleteUser = ( props:IProps) => {
 const { show, setShow,user,setUser } = props;

  const handleClose = () => setShow(false);
 const handleComfirm = () => {
    console.log("confirm delete user",user.user_id);
 }


useEffect(() => {
  console.log("check user>>>",user);
}
, [user]);


  return (
    <>
      

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>DELETE USER</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the user. Are you sure you want to proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="Danger" onClick={handleComfirm}>Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteUser;