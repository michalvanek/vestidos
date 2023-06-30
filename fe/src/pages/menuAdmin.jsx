import { useContext, useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";
import "../index.css";
import CardComponent from "../components/cardComponent/cardComponent";
import { LoginContext } from "../context/loginContext";

function menuAdmin() {
  const { isLoggedIn } = useContext(LoginContext);
  const [state, setState] = useState({
    loading: false,
    dresses: [],
    filteredDresses: [],
    dress: {
      sizeActualSelector: "",
      colorActualSelector: "",
      priceActualSelector: "",
    },
    tallas: ["CH", "M", "G", "XG", "Adolescente"],
    colores: [],
    precios: [],
    errorMessage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ ...state, loading: true });
        const dressesResponse = await DressService.getAllDresses();
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();

        setState({
          ...state,
          loading: false,
          dresses: dressesResponse.data,
          filteredDresses: dressesResponse.data,
          colores: colorsResponse.data.map((color) => color.color),
          precios: pricesResponse.data.map((price) => price.value),
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
  }, []);

  let updateInput = (event) => {
    const { name, value } = event.target;

    const filterBySize = (include) => {
      return state.dresses.filter((dress) => {
        return dress.talla.includes(include) || include === "";
      });
    };

    const filterByColor = (include) => {
      return state.dresses.filter((dress) => {
        return dress.color === include || include === "";
      });
    };

    const filterByPrice = (include) => {
      return state.dresses.filter((dress) => {
        return dress.precio.toString() === include || include === "";
      });
    };

    let updatedDress = {};

    if (name === "talla") {
      const filteredDresses = filterBySize(value);
      updatedDress = {
        sizeActualSelector: value,
        colorActualSelector: "",
        priceActualSelector: "",
      };
      setState({
        ...state,
        filteredDresses,
        dress: {
          ...state.dress,
          ...updatedDress,
        },
      });
    } else if (name === "color") {
      const filteredDresses = filterByColor(value);
      updatedDress = {
        sizeActualSelector: "",
        colorActualSelector: value,
        priceActualSelector: "",
      };
      setState({
        ...state,
        filteredDresses,
        dress: {
          ...state.dress,
          ...updatedDress,
        },
      });
    } else if (name === "precio") {
      const filteredDresses = filterByPrice(value);
      updatedDress = {
        sizeActualSelector: "",
        colorActualSelector: "",
        priceActualSelector: value,
      };
      setState({
        ...state,
        filteredDresses,
        dress: {
          ...state.dress,
          ...updatedDress,
        },
      });
    }

    // Reset the select field values
    setState((prevState) => ({
      ...prevState,
      dress: {
        ...prevState.dress,
        ...updatedDress,
      },
    }));
  };

  return (
    <>
      <h2>admin page</h2>
      {isLoggedIn ? (
        <>
          <h1>Catálogo</h1>

          <div className="row">
            <div className="col-md-8">
              <form className="row border border-3 rounded-3">
                <i className="fa-solid fa-magnifying-glass"></i>
                <div className="col">
                  <div className="mb-2">
                    <select
                      name="talla"
                      value={state.dress.sizeActualSelector}
                      onChange={updateInput}
                      className="form-control"
                    >
                      <option value="">Talla</option>
                      {state.tallas.length > 0 &&
                        state.tallas.map((talla) => {
                          return (
                            <option key={talla} value={talla}>
                              {talla}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-2">
                    <select
                      name="color"
                      value={state.dress.colorActualSelector}
                      onChange={updateInput}
                      className="form-control"
                    >
                      <option value="">Color</option>
                      {state.colores.length > 0 &&
                        state.colores.map((color) => {
                          return (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-2">
                    <select
                      name="precio"
                      value={state.dress.priceActualSelector}
                      onChange={updateInput}
                      className="form-control"
                    >
                      <option value="">Precio</option>
                      {state.precios.length > 0 &&
                        state.precios.map((price) => {
                          return (
                            <option key={price} value={price}>
                              {price}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <br />

          <div className="card-container">
            {/* Render dress data */}
            {state.filteredDresses.map((dress) => (
              <CardComponent key={dress._id} dress={dress} /> // Use the CardComponent here
            ))}
          </div>
        </>
      ) : (
        <h2>Not allowed</h2>
      )}
    </>
  );
}

export default menuAdmin;
