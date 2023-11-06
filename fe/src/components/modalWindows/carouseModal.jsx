/* eslint-disable react/prop-types */
import { Modal, Button, Carousel } from "react-bootstrap"; // Import Bootstrap components
import PropTypes from "prop-types";

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
              className="d-block mx-auto"
              src={props.fotoPrincipal}
              alt="First slide"
            />
          </Carousel.Item>
          {props.fotos.map((foto, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block mx-auto"
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

CarouseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  props: PropTypes.shape({
    fotos: PropTypes.arrayOf(PropTypes.string),
    fotoPrincipal: PropTypes.string,
  }).isRequired,
};
export default CarouseModal;
