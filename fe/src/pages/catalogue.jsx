import { useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";
import "../index.css";

function Catalogue() {
  const [state, setState] = useState({
    loading: false,
    dresses: [],
    filteredDresses: [],
    dress: {
      categoryId: "",
      topicId: "",
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
        console.log(state.colores, state.precios, state.tallas);
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
    function filterBySize(include) {
      theDresses = state.dresses.filter((dress) => {
        return dress.talla.includes(include) || include === ""; // Filter dresses by including the selected size or if include is empty
      });
    }
    function filterByColor(include) {
      theDresses = state.dresses.filter((dress) => {
        return dress.color === include || include === "";
      });
    }

    function filterByPrice(include) {
      theDresses = state.dresses.filter((dress) => {
        return dress.precio.toString() === include || include === "";
      });
    }
    let theDresses;

    if (event.target.name === "talla") {
      filterBySize(event.target.value);
      setState({
        ...state,
        filteredDresses: theDresses,
      });
    } else if (event.target.name === "color") {
      filterByColor(event.target.value);
      setState({
        ...state,
        filteredDresses: theDresses,
      });
    } else if (event.target.name === "precio") {
      filterByPrice(event.target.value);
      setState({
        ...state,
        filteredDresses: theDresses,
      });
    }
  };

  return (
    <>
      <div className="mb-2">
        <select
          name="talla"
          value={state.dress.talla}
          onChange={updateInput}
          className="form-control"
        >
          <option value="">Select a size (Optional)</option>
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
      <div className="mb-2">
        <select
          name="color"
          value={state.dress.color}
          onChange={updateInput}
          className="form-control"
        >
          <option value="">Select a color (Optional)</option>
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
      <div className="mb-2">
        <select
          name="precio"
          value={state.dress.precio}
          onChange={updateInput}
          className="form-control"
        >
          <option value="">Select a price (Optional)</option>
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
      <h1>Catalogo</h1>
      <div className="card-container">
        {/* Render dress data */}
        {state.filteredDresses.map((dress) => (
          <div
            key={dress._id}
            className="card"
            style={{ background: "#FFF8F7" }}
          >
            <div className="card-body">
              <img
                className="card-img-top"
                src={dress.fotoPrincipal}
                alt="Dress"
              />
              <div className="card-details">
                <div className="card-detail">
                  <i className="fas fa-ruler icon" title="talla"></i>
                  <span className="icon-value">{dress.talla.join(", ")}</span>
                </div>
                <div className="card-detail">
                  <i className="fas fa-palette icon" title="color"></i>
                  <span className="icon-value">{dress.color}</span>
                </div>
                <div className="card-detail">
                  <i
                    className="fas fa-dollar-sign icon"
                    title="precio en pesos"
                  ></i>
                  <span className="icon-value">{dress.precio}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Catalogue;
