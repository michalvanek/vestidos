import { useState, useEffect } from "react";
import "../scss/main.scss";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";

function Catalogue() {
  const [query, setQuery] = useState({
    text: "",
  });

  const [state, setState] = useState({
    loading: false,
    dresses: [], // Renamed 'videos' to 'dresses'
    filteredDresses: [], // Renamed 'filteredVideos' to 'filteredDresses'
    dress: {
      categoryId: "",
      topicId: "",
    },
    errorMessage: "",
  });

  useEffect(() => {
    const getDresses = async () => {
      // Renamed 'getVideos' to 'getDresses'
      try {
        setState({ ...state, loading: true });
        const response = await DressService.getAllDresses();
        setState({
          ...state,
          loading: false,
          dresses: response.data, // Renamed 'videos' to 'dresses'
          filteredDresses: response.data, // Renamed 'filteredVideos' to 'filteredDresses'
        });
      } catch (error) {
        setState({
          ...state,
          loading: false,
          errorMessage: error.message,
        });
      }
    };

    getDresses();

    return () => {
      // This now gets called when the component unmounts
    };
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      {/* Render dress data */}
      {state.dresses.map((dress) => (
        <div key={dress._id}>
          <h2>{dress.marca}</h2>
          <p>Talla: {dress.talla}</p>
          <p>Color: {dress.color}</p>
          <p>Piedras: {dress.piedras ? "Yes" : "No"}</p>
          <p>Precio: {dress.precio}</p>
          {/* Add logic to display photos */}
          <img src={dress.fotoPrincipal} alt="Dress" />
          {dress.fotos.map((foto) => (
            <img key={foto} src={foto} alt="Dress" />
          ))}
          <hr />
        </div>
      ))}
    </>
  );
}

export default Catalogue;
