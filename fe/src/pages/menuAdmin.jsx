import { useContext, useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner";
import { DressService } from "../../dao/dressService";
import { LoginContext } from "../context/loginContext";
import DressDependencyManagement from "../components/dressDependencyManagement/dressDependencyManagement";

function MenuAdmin() {
  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);
  const [dressChanged, setDressChanged] = useState(0);

  const [state, setState] = useState({
    loading: false,
    brands: [],
    addBrandTextField: { marca: "" },
    editBrandTextField: { marca: "" },
    selectedBrandId: "",
    colors: [],
    addColorTextField: { color: "" },
    editColorTextField: { color: "" },
    selectedColorId: "",
    prices: [],
    editPriceTextField: { precio: "" },
    selectedPriceId: "",
    errorMessage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const brandsResponse = await DressService.getAllBrands(
          getAccessTokenHeader()
        );
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();

        setState((prevState) => ({
          ...prevState,
          loading: false,
          brands: brandsResponse.data.map((brand) => ({
            _id: brand._id,
            marca: brand.marca,
          })),
          colors: colorsResponse.data.map((color) => ({
            _id: color._id,
            color: color.color,
          })),
          prices: pricesResponse.data.map((price) => ({
            _id: price._id,
            value: price.value,
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
  }, [getAccessTokenHeader, dressChanged]);

  const updateInput = (event) => {
    const { name, value } = event.target;

    // Check if the field is "talla" and handle it as an array of selected options
    if (name === "marcaNueva") {
      setState({
        ...state,
        addBrandTextField: {
          ...state.addBrandTextField,
          marca: value,
        },
      });
    } else if (name === "marcaSeleccionada") {
      setState({
        ...state,
        selectedBrandId: value,
      });
    } else if (name === "marcaEditada") {
      setState({
        ...state,
        editBrandTextField: {
          ...state.editBrandTextField,
          marca: value,
        },
      });
    } else if (name === "colorNueva") {
      setState({
        ...state,
        addColorTextField: {
          ...state.addColorTextField,
          color: value,
        },
      });
    } else if (name === "colorSeleccionada") {
      setState({
        ...state,
        selectedColorId: value,
      });
    } else if (name === "colorEditada") {
      setState({
        ...state,
        editColorTextField: {
          ...state.editColorTextField,
          color: value,
        },
      });
    } else if (name === "precioSeleccionada") {
      setState({
        ...state,
        selectedPriceId: value,
      });
    } else if (name === "precioEditada") {
      setState({
        ...state,
        editPriceTextField: {
          ...state.editPriceTextField,
          precio: Number(value), // Convert value to a number
        },
      });
    }
  };

  const submitDelete = async (id, submitMethod) => {
    if (id === "" || id === undefined) {
      return alert("Primero selecciona un valor.");
    } else if (submitMethod !== "marca" && submitMethod !== "color") {
      return alert(`invalid submitMethod, submit method is: ${submitMethod}`);
    }

    if (window.confirm("Are you sure?")) {
      try {
        setState({ ...state, loading: true });
        if (submitMethod === "marca") {
          await DressService.deleteBrand(id, getAccessTokenHeader());
          setState({
            ...state,
            loading: false,
            selectedBrandId: "",
          });
        } else if (submitMethod === "color") {
          await DressService.deleteColor(id, getAccessTokenHeader());
          setState({
            ...state,
            loading: false,
            selectedColorId: "",
          });
        }

        setDressChanged((prevDressChanged) => prevDressChanged + 1);
      } catch (error) {
        alert(error);
        setState({
          ...state,
          loading: false,
          errorMessage: error.message,
        });
      }
    }
  };

  const submitForm = async (data, submitMethod) => {
    if (submitMethod !== "marca" && submitMethod !== "color") {
      return alert(`invalid submitMethod, submit method is: ${submitMethod}`);
    }
    try {
      setState({ ...state, loading: true });
      if (submitMethod === "marca") {
        await DressService.createBrand(data, getAccessTokenHeader());
        setState({
          ...state,
          loading: false,
          addBrandTextField: { marca: "" },
        });
      } else if (submitMethod === "color") {
        await DressService.createColor(data, getAccessTokenHeader());
        setState({
          ...state,
          loading: false,
          addColorTextField: { color: "" },
        });
      } // Clear the text field
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
  const submitEdditedForm = async (data, id, submitMethod) => {
    if (id === "" || id === undefined) {
      return alert("Primero selecciona un valor.");
    } else if (
      submitMethod !== "marca" &&
      submitMethod !== "color" &&
      submitMethod !== "precio"
    ) {
      return alert(`invalid submitMethod, submit method is: ${submitMethod}`);
    }
    try {
      if (submitMethod === "marca") {
        setState({ ...state, loading: true });
        await DressService.editBrand(data, id, getAccessTokenHeader());
        setState({
          ...state,
          loading: false,
          editBrandTextField: { marca: "" },
          selectedBrandId: "",
        });
      } else if (submitMethod === "color") {
        setState({ ...state, loading: true });
        await DressService.editColor(data, id, getAccessTokenHeader());
        setState({
          ...state,
          loading: false,
          editColorTextField: { color: "" },
          selectedColorId: "",
        });
      } else if (submitMethod === "precio") {
        setState({ ...state, loading: true });
        await DressService.editPrice(data, id, getAccessTokenHeader());
        setState({
          ...state,
          loading: false,
          editPriceTextField: { precio: "" },
          selectedPriceId: "",
        });
      }
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
      <h1>admin page</h1>
      {isLoggedIn ? (
        <>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="container border">
                {/* Use the new component here */}

                <DressDependencyManagement
                  state={state}
                  updateInput={updateInput}
                  submitForm={submitForm}
                  submitDelete={submitDelete}
                  submitEdditedForm={submitEdditedForm}
                  typeOf="marca"
                />

                <DressDependencyManagement
                  state={state}
                  updateInput={updateInput}
                  submitForm={submitForm}
                  submitDelete={submitDelete}
                  submitEdditedForm={submitEdditedForm}
                  typeOf="color"
                />
                <DressDependencyManagement
                  state={state}
                  updateInput={updateInput}
                  submitForm={submitForm}
                  submitDelete={submitDelete}
                  submitEdditedForm={submitEdditedForm}
                  typeOf="precio"
                />
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
