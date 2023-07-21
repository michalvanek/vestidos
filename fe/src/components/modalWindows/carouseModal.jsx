import React, { useState, useContext } from "react";
import { Modal, Button, Carousel } from "react-bootstrap"; // Import Bootstrap components

const CarouseModal = ({ isOpen, closeModal, props }) => {
  const hasFotos = props.fotos && props.fotos.length > 0;
  return (
    <Modal show={isOpen} onHide={closeModal} className="modal">
      <Modal.Header closeButton>
        <Modal.Title>Detalle</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-bg">
        <Carousel
          className="carousel carousel-dark slide"
          interval={null}
          controls={hasFotos}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={props.fotoPrincipal}
              alt="First slide"
            />
          </Carousel.Item>
          {props.fotos.map((foto, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={foto}
                alt={`foto # ${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CarouseModal;
