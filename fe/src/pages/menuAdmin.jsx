import { useContext, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Spinner from "../components/spinner/Spinner";
import { DressService } from "../../dao/dressService";
import { LoginContext } from "../context/loginContext";

function MenuAdmin() {
  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);
  const [dressChanged, setDressChanged] = useState(0);
  const [state, setState] = useState({
    loading: false,
    brands: [],
    newBrand: { marca: "" },
    editOrDeleteBrand: "",
    errorMessage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ ...state, loading: true });
        const brandsResponse = await DressService.getAllBrands(
          getAccessTokenHeader()
        );

        setState({
          ...state,
          loading: false,
          brands: brandsResponse.data.map((brand) => ({
            _id: brand._id,
            marca: brand.marca,
          })),
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
    return () => {
      // This now gets called when the component unmounts
    };
  }, [dressChanged]);

  const updateInput = (event) => {
    const { name, value } = event.target;

    // Check if the field is "talla" and handle it as an array of selected options
    if (name === "marcaNueva") {
      setState({
        ...state,
        newBrand: {
          ...state.newBrand,
          marca: value,
        },
      });
    } else if (name === "marca") {
      setState({
        ...state,
        editOrDeleteBrand: value,
      });
    }
  };

  const deleteBrand = async (brandId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await DressService.deleteBrand(brandId, getAccessTokenHeader());
        setDressChanged((prevDressChanged) => prevDressChanged + 1);
        console.log("Brand deleted successfully.");
      } catch (error) {
        alert(error);
        console.error("Error deleting brand:", error.message);
      }
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      setState({ ...state, loading: true });
      await DressService.createBrand(state.newBrand, getAccessTokenHeader());
      setState({ ...state, loading: false });
      setDressChanged((prevDressChanged) => prevDressChanged + 1);
    } catch (error) {
      alert(error);
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
  };

  let { loading, errorMessage } = state;

  return (
    <>
      <h2>admin page</h2>
      {isLoggedIn ? (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="container">
                <Form.Group controlId="marcaNueva">
                  <Form.Label>Agregar marca:</Form.Label>
                  <div className="row align-items-center">
                    <div className="col-md-8 pe-1">
                      <Form.Control
                        type="text"
                        name="marcaNueva"
                        value={state.newBrand.marca}
                        onChange={updateInput}
                        required
                        placeholder="Enter a brand name"
                      />
                    </div>

                    <div className="col-md-4 ps-1">
                      <Button
                        onClick={submitForm}
                        className="btn btn-success my-1 mx-1"
                      >
                        <i className="fa fa-plus-circle me-2" />
                        Nueva marca
                      </Button>
                    </div>
                  </div>
                </Form.Group>
                <br />
                {/* Display the list of brands */}
                <Form.Group controlId="marca">
                  <Form.Label>Marcas existentes:</Form.Label>

                  <Form.Control
                    as="select"
                    name="marca"
                    value={state.editOrDeleteBrand}
                    onChange={updateInput}
                    required
                  >
                    <option value="">Select a brand</option>
                    {state.brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.marca}
                      </option>
                    ))}
                  </Form.Control>

                  <Button
                    className="btn btn-danger my-1 mx-1"
                    onClick={() => deleteBrand(state.editOrDeleteBrand)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </Form.Group>
              </div>
            </>
          )}
        </>
      ) : (
        <h2>Not allowed</h2>
      )}
    </>
  );
}

export default MenuAdmin;
