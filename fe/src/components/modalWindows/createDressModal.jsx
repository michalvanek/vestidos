import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { DressService } from "../../../dao/dressService";
import { LoginContext } from "../../context/loginContext";

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
      talla: "",
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
        console.log(getAccessTokenHeader());
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();
        const brandsResponse = await DressService.getAllBrands(
          getAccessTokenHeader()
        );

        setState({
          ...state,
          loading: false,
          colores: colorsResponse.data.map((color) => color.color),
          precios: pricesResponse.data.map((price) => price.value),
          marcas: brandsResponse.data.map((brand) => brand.marca),
        });
      } catch (error) {
        setState({
          ...state,
          loading: false,
          errorMessage: error.message,
        });
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

  const getAccessTokenHeader = () => {
    return localStorage.getItem("accessToken");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      await DressService.createDress(state.formData);
      setState({ ...state, loading: false });
      props.closeModal();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
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
            <Form.Control
              as="select"
              name="talla"
              value={state.formData.talla}
              onChange={handleChange}
              required
            >
              <option value="">Select a size</option>
              {state.tallas.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Control>
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
                <option key={color} value={color}>
                  {color}
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
                <option key={price} value={price}>
                  {price}
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
          </Form.Group>

          <Form.Group controlId="costo">
            <Form.Label>Costo:</Form.Label>
            <Form.Control
              type="text"
              name="costo"
              value={state.formData.costo}
              onChange={handleChange}
              required
            />
          </Form.Group> */}

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
                <option key={brand} value={brand}>
                  {brand}
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
