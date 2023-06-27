import { useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";
import "../index.css";

function Catalogue() {
  const [query, setQuery] = useState({
    text: "",
  });

  const [state, setState] = useState({
    loading: false,
    dresses: [],
    filteredDresses: [],
    dress: {
      categoryId: "",
      topicId: "",
    },
    errorMessage: "",
  });

  useEffect(() => {
    const getDresses = async () => {
      try {
        setState({ ...state, loading: true });
        const response = await DressService.getAllDresses();
        setState({
          ...state,
          loading: false,
          dresses: response.data,
          filteredDresses: response.data,
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
      <h1>Catalogo</h1>
      <div className="card-container">
        {/* Render dress data */}
        {state.dresses.map((dress) => (
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
                  <span className="icon-value">{dress.talla}</span>
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
