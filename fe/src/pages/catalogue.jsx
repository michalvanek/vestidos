import { useContext, useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";
import "../index.css";
import CardComponent from "../components/cardComponent/cardComponent";
import SearchBar from "../components/searchBar";
import { LoginContext } from "../context/loginContext";
import { Link } from "react-router-dom";
import CreateDressModal from "../components/modalWindows/createDressModal";

function Catalogue() {
  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);
  const [dressChanged, setDressChanged] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    currentPage: 1,
    dressesPerPage: 10,
  });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = (props) => {
    setModalIsOpen(false);
    props === 1 && setDressChanged((prevDressChanged) => prevDressChanged + 1);
  };

  const deleteDress = async (dressId) => {
    if (window.confirm("Are you sure?")) {
      try {
        // Call the DressService to delete the dress with the given dressId
        await DressService.deleteDress(dressId, getAccessTokenHeader());
        setDressChanged((prevDressChanged) => prevDressChanged + 1);

        // Log a success message if the dress is deleted successfully
        console.log("Dress deleted successfully.");
      } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error("Error deleting dress:", error.message);
      }
    }
  };

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
  }, [dressChanged]);

  const indexOfLastDress = state.currentPage * state.dressesPerPage;
  const indexOfFirstDress = indexOfLastDress - state.dressesPerPage;
  const currentDresses = state.filteredDresses.slice(
    indexOfFirstDress,
    indexOfLastDress
  );
  const handlePageChange = (pageNumber) => {
    // Scroll to the top of the page when the page is turned
    window.scrollTo(0, 0);
    setState({ ...state, currentPage: pageNumber });
  };

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
      <h1>Catálogo</h1>
      <SearchBar state={state} updateInput={updateInput} />
      <br />
      {/* Add the button to open the CreateDressModal */}
      {isLoggedIn && (
        <>
          <Link onClick={openModal} className="btn btn-success my-1 mx-1">
            <i className="fa fa-plus-circle me-2" /> Nuevo vestido
          </Link>
          <CreateDressModal
            isOpen={modalIsOpen}
            closeModal={closeModal}
            getAccessTokenHeader={getAccessTokenHeader}
          />
        </>
      )}
      {state.loading ? (
        <Spinner />
      ) : (
        <>
          {/* Bootstrap Pagination at the top */}
          <nav aria-label="Page navigation" className="pagination-container">
            <ul className="pagination justify-content-center">
              {state.filteredDresses.length > state.dressesPerPage &&
                Array.from({
                  length: Math.ceil(
                    state.filteredDresses.length / state.dressesPerPage
                  ),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === state.currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="card-container">
            {/* Render dress data for the current page */}
            {currentDresses.map((dress) => (
              <CardComponent
                key={dress._id}
                dress={dress}
                onDelete={() => deleteDress(dress._id)}
              />
            ))}
          </div>
          <br />
          {/* Bootstrap Pagination */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              {state.filteredDresses.length > state.dressesPerPage &&
                Array.from({
                  length: Math.ceil(
                    state.filteredDresses.length / state.dressesPerPage
                  ),
                }).map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      index + 1 === state.currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}

export default Catalogue;
