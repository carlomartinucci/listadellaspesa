import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const GenericModal = ({ children, isOpen, toggle, title, onSubmit }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    {title && <ModalHeader toggle={toggle}>{title}</ModalHeader>}
    {children && <ModalBody>{children}</ModalBody>}
    <ModalFooter>
      <Button color="secondary" onClick={toggle}>
        Chiudi
      </Button>
      <Button color="primary" onClick={onSubmit}>
        Conferma
      </Button>
    </ModalFooter>
  </Modal>
);

export default GenericModal;
