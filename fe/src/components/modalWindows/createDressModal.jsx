import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DressService } from "../../../dao/dressService";
import { LoginContext } from "../../context/loginContext";
import Select from "react-select";

function CreateDressModal(props) {
  const { isLoggedIn, refreshAccessToken } = useContext(LoginContext);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(props.getAccessTokenHeader());
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();
        const brandsResponse = await DressService.getAllBrands(
          props.getAccessTokenHeader()
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
  }, []);

  useEffect(() => {
    // This effect will run whenever the isLoggedIn state changes
    if (isLoggedIn) {
      refreshAccessToken();
    }
  }, [isLoggedIn]);

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

  const handleSubmit = async (e) => {
    console.log(state.formData);
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
        <Modal.Title>Create Dress</Modal.Title>
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

export default CreateDressModal;
