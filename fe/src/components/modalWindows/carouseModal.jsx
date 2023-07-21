import React, { useState, useContext } from "react";
import { Modal, Button, Carousel } from "react-bootstrap"; // Import Bootstrap components

const CarouseModal = ({ isOpen, closeModal }) => {
  return (
    <Modal show={isOpen} onHide={closeModal} className="my-modal">
      <Modal.Header closeButton>
        <Modal.Title>Carouse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-5">
          <Carousel>
            <Carousel.Item>
              <img
                style={{ maxHeight: "100vh" }}
                className="d-block w-100"
                src="https://i.imgur.com/XIKTtNf.png"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First Slider Image Title</h3>
                <p>First Slide decription.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://i.imgur.com/Cat1waB.png"
                alt="Second slide"
              />

              <Carousel.Caption>
                <h3>Second slide Image </h3>
                <p>Second slide description</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://i.imgur.com/GAdi0ny.png"
                alt="Third slide"
              />

              <Carousel.Caption>
                <h3>Third Slide Image</h3>
                <p>Third Slide Description.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
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
