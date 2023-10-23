import { useState, useContext, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { LoginContext } from "../context/loginContext";
import { DressService } from "../../dao/dressService";
import { Toast } from "react-bootstrap";

function NewRent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [typeOfEventData, setTypeOfEventData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [editClientData, setEditClientData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [backendError, setBackendError] = useState(null);
  const [newRent, setNewRent] = useState({
    dateOfBooking: "",
    bookingAmount: "",
    remainingAmount: "",
    pickUpDate: "",
    dressId: "",
    clientId: "",
    eventId: "",
  });
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
  });
  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);

  useEffect(() => {
    // Fetch the list of events and update the typeOfEventData state
    const fetchEvents = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const dressesResponse = await DressService.getAllDresses();
        const colorsResponse = await DressService.getAllColors();
        const eventsResponse = await DressService.getAllEvents(
          getAccessTokenHeader()
        );
        const events = eventsResponse.data;

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dresses: dressesResponse.data,
          colores: colorsResponse.data.map((color) => color.color),
        }));

        // Create an object with event IDs as keys and event names as values
        const eventsData = {};
        events.forEach((event) => {
          eventsData[event._id] = event.NameOfEvent;
        });

        setTypeOfEventData(eventsData);
      } catch (error) {
        handleApiError(error);
      }
    };

    if (isLoggedIn) {
      fetchEvents();
    }
  }, [getAccessTokenHeader, isLoggedIn]);

  let updateInput = (event) => {
    const { name, value } = event.target;

    const filterByColor = (include) => {
      return state.dresses.filter((dress) => {
        return dress.color === include || include === "";
      });
    };

    let updatedDress = {};

    if (name === "color") {
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
  const handleCardClick = (card) => {
    setNewRent((prevState) => ({
      ...prevState,
      dressId: card,
    }));
  };

  const handleApiError = (error) => {
    console.error("API error:", error);

    if (error.response) {
      setBackendError(
        `${error.message} - ${JSON.stringify(error.response.data, null, 2)}`
      );
    } else {
      setBackendError("An error occurred. Please try again later.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await DressService.getAllClients(
        searchQuery,
        getAccessTokenHeader()
      );
      setClients(response.data);
    } catch (error) {
      console.error("Error searching for clients:", error);
      setBackendError("An error occurred while searching for clients.");
    }
  };

  const handleShowNewClientModal = () => {
    setShowNewClientModal(true);
  };

  const handleShowEditClientModal = () => {
    setShowEditClientModal(true);
    const selectedClient = clients.find(
      (client) => client._id === newRent.clientId
    );
    setEditClientData(selectedClient);
  };

  const handleEditClient = async () => {
    setValidationErrors({});
    setBackendError(null);

    if (
      !editClientData.firstName ||
      !editClientData.lastName ||
      !editClientData.phoneNumber
    ) {
      setValidationErrors({
        firstName: !editClientData.firstName,
        lastName: !editClientData.lastName,
        phoneNumber: !editClientData.phoneNumber,
      });
      return;
    }

    try {
      await DressService.editClient(
        editClientData,
        newRent.clientId,
        getAccessTokenHeader()
      );

      // Update the client in the clients state
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === newRent.clientId ? editClientData : client
        )
      );

      setShowEditClientModal(false);
      setEditClientData(null);
      // You can also refresh the client list here if needed.
    } catch (error) {
      handleApiError(error);
    }
  };

  function getClientFirstAndLastName(clients, targetClientId) {
    const targetClient = clients.find(
      (client) => client._id === targetClientId
    );
    return targetClient
      ? `${targetClient.firstName} ${targetClient.lastName}`
      : null;
  }

  const handleCreateNewClient = async () => {
    // Reset previous errors
    setValidationErrors({});
    setBackendError(null);

    // Validation
    if (
      !newClientData.firstName ||
      !newClientData.lastName ||
      !newClientData.phoneNumber
    ) {
      setValidationErrors({
        firstName: !newClientData.firstName,
        lastName: !newClientData.lastName,
        phoneNumber: !newClientData.phoneNumber,
      });
      return;
    }

    try {
      const createdClient = await DressService.createClient(
        newClientData,
        getAccessTokenHeader()
      );

      // Update the clients state by adding the newly created client
      setClients([...clients, createdClient.data]);
      // Update the newRent state with the created client's ID
      setNewRent({ ...newRent, clientId: createdClient.data._id });

      // Close the modal after successful creation
      setShowNewClientModal(false);

      // Clear the new client data
      setNewClientData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      });
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCreateNewRent = async () => {
    setValidationErrors({});
    setBackendError(null);

    // Validate the form data before creating a new rent
    if (
      !newRent.clientId ||
      !newRent.dateOfBooking ||
      !newRent.pickUpDate ||
      !newRent.bookingAmount ||
      !newRent.remainingAmount ||
      !newRent.eventId ||
      !newRent.dressId
    ) {
      setValidationErrors({
        clientId: !newRent.clientId,
        dateOfBooking: !newRent.dateOfBooking,
        pickUpDate: !newRent.pickUpDate,
        bookingAmount: !newRent.bookingAmount,
        remainingAmount: !newRent.remainingAmount,
        eventId: !newRent.eventId,
        dressId: !newRent.dressId,
      });
      return;
    }

    try {
      // Create a new rent by calling the createRent method from DressService
      await DressService.createRent(newRent, getAccessTokenHeader());

      // You may want to handle success or redirect to a different page here

      // Clear the form or perform other actions as needed
      setNewRent({
        dateOfBooking: "",
        bookingAmount: "",
        remainingAmount: "",
        pickUpDate: "",
        dressId: "",
        clientId: "",
        eventId: "",
      });

      // Scroll to the top
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShowToast(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <div className="row">
        <h1>Nueva renta</h1>
      </div>
      <div className="container">
        <div>
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 9999 }}
          >
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              id="liveToast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <Toast.Header>
                {/* <img src="..." className="rounded me-2" alt="..." /> */}
                <strong className="me-auto">✅</strong>
                <small>Éxito</small>
              </Toast.Header>
              <Toast.Body>La renta se ha creado con éxito.</Toast.Body>
            </Toast>
          </div>
        </div>
        <div>
          {/* Display backend errors if present */}
          {backendError && <Alert variant="danger">{backendError}</Alert>}
        </div>

        <div className="row">
          <Form.Group controlId="searchQuery">
            <Form.Label>Encuentra clienta existente:</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Escribe apellido(s) de clienta"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" onClick={handleSearch} className="ms-2">
                Buscar
              </Button>
            </div>
          </Form.Group>
        </div>
        <div className="container">
          <div className="row">
            <div className="col">
              <Form.Label htmlFor="listOfClients">
                Resultados de búsqueda:
              </Form.Label>
              <select
                id={"listOfClients"}
                className="form-select"
                aria-label="Select a client"
                onChange={(e) =>
                  setNewRent((prevState) => ({
                    ...prevState,
                    clientId: e.target.value,
                  }))
                }
                size="5"
                value={newRent.clientId || ""}
              >
                <option value="">Selecciona clienta</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName} {client.phoneNumber}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                onClick={handleShowNewClientModal}
                className="btn btn-success my-1 mx-1"
              >
                <i className="fa fa-plus-circle me-2" /> Nueva clienta
              </Button>
              <Button
                variant="primary"
                onClick={handleShowEditClientModal}
                className="btn btn-primary my-1 mx-1"
              >
                <i className="fa fa-pen" /> Editar clienta
              </Button>
            </div>
          </div>
        </div>
        {/* Modal for creating a new client */}
        <Modal
          show={showNewClientModal}
          onHide={() => setShowNewClientModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Crear clienta nueva</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {backendError && <Alert variant="danger">{backendError}</Alert>}
            <Form.Group controlId="newClientFirstName">
              <Form.Label>Nombre(s):</Form.Label>
              <Form.Control
                type="text"
                value={newClientData.firstName}
                onChange={(e) =>
                  setNewClientData({
                    ...newClientData,
                    firstName: e.target.value,
                  })
                }
                isInvalid={validationErrors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                Campo nombre(s) es obligatorio.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="newClientLastName">
              <Form.Label>Apellido(s):</Form.Label>
              <Form.Control
                type="text"
                value={newClientData.lastName}
                onChange={(e) =>
                  setNewClientData({
                    ...newClientData,
                    lastName: e.target.value,
                  })
                }
                isInvalid={validationErrors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                Campo apellido(s) es obligatorio.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="newClientPhoneNumber">
              <Form.Label>Número de teléfono:</Form.Label>
              <Form.Control
                type="text"
                value={newClientData.phoneNumber}
                onChange={(e) =>
                  setNewClientData({
                    ...newClientData,
                    phoneNumber: e.target.value,
                  })
                }
                isInvalid={validationErrors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                Campo número de teléfono es obligatorio.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="newClientEmail">
              <Form.Label>Correo electrónico:</Form.Label>
              <Form.Control
                type="email"
                value={newClientData.email}
                onChange={(e) =>
                  setNewClientData({
                    ...newClientData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowNewClientModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateNewClient}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for editing a client */}
        <Modal
          show={showEditClientModal}
          onHide={() => setShowEditClientModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Editar clienta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {backendError && <Alert variant="danger">{backendError}</Alert>}
            {editClientData && (
              <>
                <Form.Group controlId="editClientFirstName">
                  <Form.Label>Nombre(s):</Form.Label>
                  <Form.Control
                    type="text"
                    value={editClientData.firstName}
                    onChange={(e) =>
                      setEditClientData({
                        ...editClientData,
                        firstName: e.target.value,
                      })
                    }
                    isInvalid={validationErrors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    Campo nombre(s) es obligatorio.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="editClientLastName">
                  <Form.Label>Apellido(s):</Form.Label>
                  <Form.Control
                    type="text"
                    value={editClientData.lastName}
                    onChange={(e) =>
                      setEditClientData({
                        ...editClientData,
                        lastName: e.target.value,
                      })
                    }
                    isInvalid={validationErrors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    Campo apellido(s) es obligatorio.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="editClientPhoneNumber">
                  <Form.Label>Número de teléfono:</Form.Label>
                  <Form.Control
                    type="text"
                    value={editClientData.phoneNumber}
                    onChange={(e) =>
                      setEditClientData({
                        ...editClientData,
                        phoneNumber: e.target.value,
                      })
                    }
                    isInvalid={validationErrors.phoneNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    Campo número de teléfono es obligatorio.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="editClientEmail">
                  <Form.Label>Correo electrónico:</Form.Label>
                  <Form.Control
                    type="email"
                    value={editClientData.email}
                    onChange={(e) =>
                      setEditClientData({
                        ...editClientData,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditClientModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleEditClient}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
          <Form.Group controlId="newClientName">
            <Form.Label>
              Clienta (selecciona existente o crea nueva):
            </Form.Label>
            <Form.Control
              type="text"
              value={getClientFirstAndLastName(clients, newRent.clientId) || ""}
              readOnly
              isInvalid={validationErrors.clientId}
            />
            <Form.Control.Feedback type="invalid">
              Campo clienta es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="dateOfBooking">
            <Form.Label>Fecha de apartado:</Form.Label>
            <Form.Control
              type="date"
              value={newRent.dateOfBooking}
              onChange={(e) =>
                setNewRent({
                  ...newRent,
                  dateOfBooking: e.target.value,
                })
              }
              isInvalid={validationErrors.dateOfBooking}
            />
            <Form.Control.Feedback type="invalid">
              Campo fecha de apartado es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="pickUpDate">
            <Form.Label>Fecha de recolección:</Form.Label>
            <Form.Control
              type="date"
              value={newRent.pickUpDate}
              onChange={(e) =>
                setNewRent({
                  ...newRent,
                  pickUpDate: e.target.value,
                })
              }
              isInvalid={validationErrors.pickUpDate}
            />
            <Form.Control.Feedback type="invalid">
              Campo fecha de recolección es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="bookingAmount">
            <Form.Label>Cantidad de apartado:</Form.Label>
            <Form.Control
              type="number"
              value={newRent.bookingAmount}
              onChange={(e) =>
                setNewRent({
                  ...newRent,
                  bookingAmount: e.target.value,
                })
              }
              isInvalid={validationErrors.bookingAmount}
            />
            <Form.Control.Feedback type="invalid">
              Campo cantidad de apartado es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="remainingAmount">
            <Form.Label>Cantidad restante:</Form.Label>
            <Form.Control
              type="number"
              value={newRent.remainingAmount}
              onChange={(e) =>
                setNewRent({
                  ...newRent,
                  remainingAmount: e.target.value,
                })
              }
              isInvalid={validationErrors.remainingAmount}
            />
            <Form.Control.Feedback type="invalid">
              Campo cantidad restante es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="eventId">
            <Form.Label>Tipo de evento:</Form.Label>
            <Form.Control
              as="select"
              value={newRent.eventId}
              onChange={(e) =>
                setNewRent({
                  ...newRent,
                  eventId: e.target.value,
                })
              }
              isInvalid={validationErrors.eventId}
            >
              <option value="">Select an event</option>
              {Object.entries(typeOfEventData).map(([eventId, eventName]) => (
                <option key={eventId} value={eventId}>
                  {eventName}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Campo tipo de evento es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="dressId">
            <Form.Label>
              Vestido ID (se rellena en automático al seleccionar vestido):
            </Form.Label>
            <Form.Control
              type="text"
              value={newRent.dressId || ""}
              readOnly
              isInvalid={validationErrors.dressId}
            />
            <Form.Control.Feedback type="invalid">
              Campo vestido ID es obligatorio.
            </Form.Control.Feedback>
            <Form.Label>Filtra por color:</Form.Label>
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
            <div className="card-grid">
              {state.filteredDresses.map((card) => (
                <div
                  key={card._id}
                  className={`card card-select ${
                    newRent.dressId === card._id ? "selected-dress" : ""
                  }`}
                  onClick={() => handleCardClick(card._id)}
                >
                  <img src={card.fotoPrincipal} alt={card._id} />
                  <h5>{`${card.talla.join(", ")} ${card.precio}`}</h5>
                  {/* Other card information */}
                </div>
              ))}
            </div>
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleCreateNewRent}
            className="btn btn-success my-1 mx-1"
          >
            Crear renta nueva
          </Button>
        </div>
      </div>
    </>
  );
}

export default NewRent;
