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

  const [colorChanged, setColorChanged] = useState(0);
  const [colorState, setColorState] = useState({
    loading: false,
    colors: [],
    addColorTextField: { color: "" },
    editColorTextField: { color: "" },
    selectedColorId: "",
    errorMessage: "",
  });

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setColorState({ ...colorState, loading: true });
        const colorsResponse = await DressService.getAllColors(
          getAccessTokenHeader()
        );

        setColorState({
          ...colorState,
          loading: false,
          colors: colorsResponse.data.map((color) => ({
            _id: color._id,
            color: color.color,
          })),
        });
      } catch (error) {
        setColorState({
          ...colorState,
          loading: false,
          errorMessage: error.message,
        });
      }
    };

    fetchColors();
    return () => {
      // Cleanup
    };
  }, [colorChanged]);

  const updateColorInput = (event) => {
    const { name, value } = event.target;

    if (name === "colorNueva") {
      setColorState({
        ...colorState,
        addColorTextField: {
          ...colorState.addColorTextField,
          color: value,
        },
      });
    } else if (name === "colorSeleccionado") {
      setColorState({
        ...colorState,
        selectedColorId: value,
      });
    } else if (name === "colorEditado") {
      setColorState({
        ...colorState,
        editColorTextField: {
          ...colorState.editColorTextField,
          color: value,
        },
      });
    }
  };

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
    }
  };

  const submitDelete = async (brandId) => {
    if (brandId === "") {
      return alert("Primero selecciona un valor.");
    }
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

  const submitForm = async (data) => {
    try {
      setState({ ...state, loading: true });
      await DressService.createBrand(data, getAccessTokenHeader());
      setState({ ...state, loading: false, addBrandTextField: { marca: "" } }); // Clear the text field
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
  const submitEdditedForm = async (data, id) => {
    if (id === "") {
      return alert("Primero selecciona un valor.");
    }
    try {
      setState({ ...state, loading: true });
      await DressService.editBrand(data, id, getAccessTokenHeader());
      setState({
        ...state,
        loading: false,
        editBrandTextField: { marca: "" },
        selectedBrandId: "",
      }); // Clear the text field
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
              {/* Use the new component here */}
              <DressDependencyManagement
                state={state}
                updateInput={updateInput}
                submitForm={submitForm}
                submitDelete={submitDelete}
                submitEdditedForm={submitEdditedForm}
                typeOf="marca"
              />
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
