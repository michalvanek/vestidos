import { useState, useContext, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { LoginContext } from "../context/loginContext";
import { DressService } from "../../dao/dressService";

function NewRent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [typeOfEventData, setTypeOfEventData] = useState({});

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

  const { isLoggedIn, getAccessTokenHeader } = useContext(LoginContext);

  useEffect(() => {
    // Fetch the list of events and update the typeOfEventData state
    const fetchEvents = async () => {
      try {
        const response = await DressService.getAllEvents(
          getAccessTokenHeader()
        );
        const events = response.data;

        // Create an object with event IDs as keys and event names as values
        const eventsData = {};
        events.forEach((event) => {
          eventsData[event._id] = event.NameOfEvent;
        });

        setTypeOfEventData(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Handle the error as needed
      }
    };

    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

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
      console.error("Error editing the client:", error);
      setBackendError(
        `${error.message} - ${JSON.stringify(error.response.data, null, 2)}`
      );
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
      console.error("Error creating a new client:", error);
      // Handle the error and set the backendError state
      setBackendError(
        `${error.message} - ${JSON.stringify(error.response.data, null, 2)}`
      );
    }
  };

  return (
    <div className="container">
      <div className="row">
        <h1>Nueva renta</h1>
      </div>
      <div className="row">
        <Form.Group controlId="searchQuery">
          <Form.Label>Search for a client:</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter client name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch} className="ms-2">
              Search
            </Button>
          </div>
        </Form.Group>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>Search Results</h2>
            <select
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
              <option value="">Select a client</option>
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
              <i className="fa fa-plus-circle me-2" /> New Client
            </Button>
            <Button
              variant="primary"
              onClick={handleShowEditClientModal}
              className="btn btn-primary my-1 mx-1"
            >
              <i className="fa fa-pen" /> Edit Client
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
          <Modal.Title>Create a New Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {backendError && <Alert variant="danger">{backendError}</Alert>}
          <Form.Group controlId="newClientFirstName">
            <Form.Label>First Name:</Form.Label>
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
              First Name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="newClientLastName">
            <Form.Label>Last Name:</Form.Label>
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
              Last Name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="newClientPhoneNumber">
            <Form.Label>Phone Number:</Form.Label>
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
              Phone Number is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="newClientEmail">
            <Form.Label>Email:</Form.Label>
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
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateNewClient}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for editing a client */}
      <Modal
        show={showEditClientModal}
        onHide={() => setShowEditClientModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {backendError && <Alert variant="danger">{backendError}</Alert>}
          {editClientData && (
            <>
              <Form.Group controlId="editClientFirstName">
                <Form.Label>First Name:</Form.Label>
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
                  First Name is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="editClientLastName">
                <Form.Label>Last Name:</Form.Label>
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
                  Last Name is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="editClientPhoneNumber">
                <Form.Label>Phone Number:</Form.Label>
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
                  Phone Number is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="editClientEmail">
                <Form.Label>Email:</Form.Label>
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
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditClient}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Form.Group controlId="newClientName">
          <Form.Label>Clienta:</Form.Label>
          <Form.Control
            type="text"
            value={getClientFirstAndLastName(clients, newRent.clientId) || ""}
            readOnly
          />
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
            Date of Booking is required.
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
            Pick up date is required.
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
            Booking amount is required.
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
            Remaining amount is required.
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
          >
            <option value="">Select an event</option>
            {Object.entries(typeOfEventData).map(([eventId, eventName]) => (
              <option key={eventId} value={eventId}>
                {eventName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="dressId">
          <Form.Label>Vestido:</Form.Label>
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
          <Form.Control.Feedback type="invalid">
            Email is required.
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          // onClick={handleShowNewClientModal}
          className="btn btn-success my-1 mx-1"
        >
          <i className="fa fa-plus-circle me-2" /> New Rent
        </Button>
      </div>
    </div>
  );
}

export default NewRent;
