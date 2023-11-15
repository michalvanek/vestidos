import { useContext, useState, useEffect } from "react";
import Spinner from "../components/spinner/Spinner"; //tocici se kolecko kdyz loaduje 100% css
import { DressService } from "../../dao/dressService";
import "../index.css";
import SearchBar from "../components/searchBar";
import { LoginContext } from "../context/loginContext";
import { Link } from "react-router-dom";
import CreateDressModal from "../components/modalWindows/createDressModal";
import CarouseModal from "../components/modalWindows/carouseModal";
import RentProcess from "../components/rentProcess/rentProcess";
import SocialMedia from "../components/socialMedia/socialMedia";
import logo from "../../public/logo-rectangulo.webp";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import logoWhats from "../../public/logoChico.webp";
import { useLocation, useNavigate } from "react-router-dom";

function Catalogue() {
  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);
  const [dressChanged, setDressChanged] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCarouseIsOpen, setModalCarouseIsOpen] = useState(false);
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
    dressesPerPage: 16,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const whatsappSettings = {
    phoneNumber: "+524811538822",
    chatMessage: "Hola! 🤝 \nCómo podemos ayudarte?",
    accountName: "Queens",
    statusMessage: "Normalmente responde dentro de 1 hora",
    placeholder: "Escriba su mensaje",
    allowClickAway: true,
    notificationDelay: 20,
    notificationSound: true,
    avatar: logoWhats,
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = (props) => {
    setModalIsOpen(false);
    props === 1 && setDressChanged((prevDressChanged) => prevDressChanged + 1);
  };
  const openModalCarouse = (dressId) => {
    // Set the modalIsOpen state to true, and also set the dressId as part of the modal ID
    setModalCarouseIsOpen(`carouseModal-${dressId}`);
  };

  const closeModalCarouse = (dressId, props) => {
    // Set the modalIsOpen state to false, and reset the modal ID
    setModalCarouseIsOpen(false);
    if (props === 1) {
      setDressChanged((prevDressChanged) => prevDressChanged + 1);
    }
    navigate(location.pathname);
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
    // Check if there's a dress ID in the URL parameters
    const dressIdParam = new URLSearchParams(location.search).get("dress");

    if (dressIdParam) {
      // Open the modal window for the specified dress ID
      openModalCarouse(dressIdParam);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const dressesResponse = await DressService.getAllDresses();
        const colorsResponse = await DressService.getAllColors();
        const pricesResponse = await DressService.getAllPrices();

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dresses: dressesResponse.data,
          filteredDresses: dressesResponse.data,
          colores: colorsResponse.data.map((color) => color.color),
          precios: pricesResponse.data.map((price) => price.value.toString()),
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
    // Scroll to the #catalogueTop element
    const catalogueTopElement = document.getElementById("catalogueTop");

    if (catalogueTopElement) {
      catalogueTopElement.scrollIntoView({ behavior: "smooth" });
    }

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
        currentPage: 1, // Reset the current page to 1
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
        currentPage: 1, // Reset the current page to 1
      });
    } else if (name === "precio") {
      const filteredDresses = filterByPrice(value);
      updatedDress = {
        sizeActualSelector: "",
        colorActualSelector: "",
        priceActualSelector: value.toString(),
      };
      setState({
        ...state,
        filteredDresses,
        dress: {
          ...state.dress,
          ...updatedDress,
        },
        currentPage: 1, // Reset the current page to 1
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
      {!modalCarouseIsOpen && <FloatingWhatsApp {...whatsappSettings} />}

      {state.errorMessage && (
        <div className="alert alert-danger">{state.errorMessage}</div>
      )}
      <section className="header" id="inicio">
        <div className="container text-center">
          <h1>
            <img
              src={logo}
              alt="Logo de Renta de Vestidos Queens"
              className="img-fluid"
              style={{ width: "400px", maxHeight: "196px" }}
            />
          </h1>
        </div>
      </section>
      <section className="rentProcess">
        <RentProcess />
      </section>
      <section className="catalogue" id="catalogueTop">
        <div className="container">
          <h2>Catálogo</h2>
          <SearchBar state={state} updateInput={updateInput} />

          {isLoggedIn && (
            <>
              <Link onClick={openModal} className="btn btn-success my-1 mx-1">
                <i className="fa fa-plus-circle me-2" /> Nuevo vestido
              </Link>
              <CreateDressModal
                id="dressCreateModal"
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

              <div className="card-container">
                {/* ----CARD COMPONENT----- */}

                {currentDresses.map((dress) => (
                  <div
                    key={dress._id}
                    className="card border rounded"
                    style={{ background: "#FFF8F7" }}
                  >
                    <div className="card-body">
                      <Link
                        to={{
                          pathname: location.pathname,
                          search: `?dress=${dress._id}`,
                        }}
                      >
                        <img
                          className="card-img-top"
                          src={dress.fotoPrincipal}
                          alt="Dress"
                          onClick={() => openModalCarouse(dress._id)}
                        />
                      </Link>
                      <CarouseModal
                        id={`carouseModal-${dress._id}`}
                        isOpen={
                          modalCarouseIsOpen === `carouseModal-${dress._id}`
                        }
                        closeModal={(props) =>
                          closeModalCarouse(dress._id, props)
                        }
                        props={dress}
                      />
                      <div className="card-text">
                        <div className="row row-cols-auto">
                          <div className="col dress-detail">
                            <i className="fas fa-ruler icon" title="talla"></i>
                            <span className="icon-value">
                              {dress.talla.join(",")}
                            </span>
                          </div>
                          {/* <div className="card-detail">
                        <i className="fas fa-palette icon" title="color"></i>
                        <span className="icon-value">{dress.color}</span>
                      </div> */}
                          <div className="col dress-detail">
                            <i
                              className="fas fa-dollar-sign icon"
                              title="precio en pesos"
                            ></i>
                            <span className="icon-value">{dress.precio}</span>
                          </div>
                        </div>

                        {isLoggedIn && (
                          <>
                            {/* <div className="row"> */}
                            <Link
                              to={`/${dress._id}`}
                              className="btn btn-primary my-1 mx-1"
                            >
                              <i className="fa fa-pen"></i>
                            </Link>
                            {/* </div> */}
                            {/* <div className="row"> */}
                            <button
                              className="btn btn-danger my-1 mx-1"
                              onClick={() => deleteDress(dress._id)}
                              //   onClick={() => clickDelete(video.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                            {/* </div> */}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
        </div>
      </section>
      <section className="image image-2"></section>
      <section className="contact" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <h3>Contacto</h3>

              <br />
              <div className="contact-details">
                <p>Dirección: Prolongación Irán #1600, Valle Alto, Cd Valles</p>

                <p>
                  Teléfono: <a href="tel:+524811105225">481 110 5225</a>
                </p>

                <p>Nuestro horario:</p>
                <ul>
                  <li>Lunes - Viernes: 10am - 3pm y 5pm - 9pm</li>
                  <li>S&aacute;bado: 10am - 3pm</li>
                  <li>Domingo: Cerrado</li>
                </ul>

                <SocialMedia />
              </div>
            </div>
            <div className="col-sm">
              {/* Paste the Google Maps embed code here */}
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3699.2391866725648!2d-99.0143871236523!3d22.002144453634426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d612a7e1466d59%3A0x4bd984913f9abd02!2sQueens!5e0!3m2!1ses-419!2sus!4v1689964550522!5m2!1ses-419!2sus"
                width="100%"
                height="400px"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="eager"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Created by{" "}
            <a
              href="https://www.linkedin.com/in/michal-vanek-czmx/?locale=es_ES"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Michal Vanek
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Catalogue;
