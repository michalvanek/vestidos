import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DressService } from "../../../dao/dressService";
import Select from "react-select";
import PropTypes from "prop-types";

function CreateDressModal(props) {
  const [showOriginalSize, setShowOriginalSize] = useState(false);
  const [photoLink, setPhotoLink] = useState(""); // State to store the current photo link input
  const [state, setState] = useState({
    loading: false,
    dressSelectors: {
      sizeActualSelector: "",
      colorActualSelector: "",
      priceActualSelector: "",
    },
    tallas: ["CH", "M", "G", "XG", "Adolescente"],
    colores: [],
    precios: [],
    marcas: [],
    errorMessage: "",
    formData: {
      talla: [],
      color: "",
      piedras: false,
      precio: "",
      fotoPrincipal: "",
      fotos: [],
      costo: "",
      marca: "",
    },
  });

  const { getAccessTokenHeader } = props;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();
        const brandsResponse = await DressService.getAllBrands(
          getAccessTokenHeader()
        );

        setState((prevState) => ({
          ...prevState,
          loading: false,
          colores: colorsResponse.data.map((color) => ({
            _id: color._id,
            color: color.color,
          })),
          precios: pricesResponse.data.map((price) => ({
            _id: price._id,
            value: price.value,
          })),
          marcas: brandsResponse.data.map((brand) => ({
            _id: brand._id,
            marca: brand.marca,
          })),
        }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          errorMessage: error.message,
        }));
      }
    };
    fetchData();
  }, [getAccessTokenHeader]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Check if the field is "talla" and handle it as an array of selected options
    if (name === "talla") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: selectedOptions,
        },
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    }
  };

  // Function to handle adding a new photo link to the formData state
  const handleAddPhotoLink = () => {
    if (photoLink.trim() !== "") {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          fotos: [...prevState.formData.fotos, photoLink.trim()],
        },
      }));
      setPhotoLink(""); // Reset the input field after adding the link
    }
  };

  // Function to handle removing a photo link from the formData state
  const handleRemovePhotoLink = (index) => {
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        fotos: prevState.formData.fotos.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      await DressService.createDress(
        state.formData,
        props.getAccessTokenHeader()
      );
      setState({ ...state, loading: false });
      props.closeModal(1);
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
  };
  const handleTallaChange = (selectedOptions) => {
    // For multi-select, the selectedOptions will be an array of selected values
    const selectedTallas = selectedOptions.map((option) => option.value);
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        talla: selectedTallas,
      },
    }));
  };

  return (
    <Modal show={props.isOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear vestido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="talla">
            <Form.Label>Talla:</Form.Label>
            <Select
              name="talla"
              value={state.formData.talla.map((size) => ({
                value: size,
                label: size,
              }))}
              onChange={handleTallaChange}
              isMulti // Add the isMulti prop to enable multi-select
              options={state.tallas.map((size) => ({
                value: size,
                label: size,
              }))}
              required
            />
          </Form.Group>

          <Form.Group controlId="color">
            <Form.Label>Color:</Form.Label>
            <Form.Control
              as="select"
              name="color"
              value={state.formData.color}
              onChange={handleChange}
              required
            >
              <option value="">Select a color</option>
              {state.colores.map((color) => (
                <option key={color._id} value={color._id}>
                  {color.color}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="piedras">
            <Form.Check
              type="checkbox"
              label="Piedras"
              name="piedras"
              checked={state.formData.piedras}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="precio">
            <Form.Label>Precio:</Form.Label>
            <Form.Control
              as="select"
              name="precio"
              value={state.formData.precio}
              onChange={handleChange}
              required
            >
              <option value="">Select a price</option>
              {state.precios.map((price) => (
                <option key={price._id} value={price._id}>
                  {price.value}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="fotoPrincipal">
            <Form.Label>Foto Principal:</Form.Label>
            <Form.Control
              type="text"
              name="fotoPrincipal"
              value={state.formData.fotoPrincipal}
              onChange={handleChange}
              required
            />
            {state.formData.fotoPrincipal && (
              <img
                src={state.formData.fotoPrincipal}
                alt="Principal Preview"
                className={`preview-image ${
                  showOriginalSize ? "original-size" : ""
                }`}
                onClick={() => setShowOriginalSize(!showOriginalSize)}
              />
            )}
          </Form.Group>
          <Form.Group controlId="fotos">
            <Form.Label>Fotos:</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Enter photo link"
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
              />
              <Button
                variant="success"
                size="sm"
                onClick={handleAddPhotoLink}
                disabled={photoLink.trim() === ""}
                style={{ marginLeft: "10px" }}
              >
                <i className="fa fa-plus-circle" />
              </Button>
              <br />
            </div>
            {state.formData.fotos.map((link, index) => (
              <div key={index} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={link}
                  readOnly
                  style={{ marginRight: "10px" }}
                />
                <img
                  src={link}
                  alt={`Preview ${index + 1}`}
                  className={`preview-image-sm`}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemovePhotoLink(index)}
                >
                  <i className="fa fa-trash"></i>
                </Button>
              </div>
            ))}
          </Form.Group>
          {/* Add more form fields for other properties in the dress schema here */}
          {/* For example, to add photos and cost fields: */}
          {/* <Form.Group controlId="fotos">
            <Form.Label>Fotos:</Form.Label>
            <Form.Control
              type="text"
              name="fotos"
              value={state.formData.fotos.join(", ")}
              onChange={handleChange}
              required
            />
          </Form.Group> */}

          <Form.Group controlId="costo">
            <Form.Label>Costo:</Form.Label>
            <Form.Control
              type="text"
              name="costo"
              value={state.formData.costo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="marca">
            <Form.Label>Marca:</Form.Label>
            <Form.Control
              as="select"
              name="marca"
              value={state.formData.marca}
              onChange={handleChange}
              required
            >
              <option value="">Select a brand</option>
              {/* Assuming you have a method to get all brands from DressService */}
              {state.marcas.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.marca}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={state.loading}>
            {state.loading ? "Creating..." : "Create Dress"}
          </Button>
        </Form>

        {state.errorMessage && <p>{state.errorMessage}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
CreateDressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  getAccessTokenHeader: PropTypes.func.isRequired,
};

export default CreateDressModal;
