import { Form, Button, Collapse } from "react-bootstrap";
import { useState } from "react";

const DressDependencyManagemen = ({
  state,
  updateInput,
  submitForm,
  submitDelete,
  submitEdditedForm,
  typeOf,
}) => {
  const [showText, setShowText] = useState(false);

  const handleEditButtonClick = () => {
    setShowText((prevShowText) => !prevShowText);
  };

  return (
    <>
      <div className="container">
        <Form.Group controlId={typeOf + "Nueva"}>
          <Form.Label>Agregar marca:</Form.Label>
          <div className="row align-items-center">
            <div className="col-md-8 pe-1">
              <Form.Control
                type="text"
                name={typeOf + "Nueva"}
                value={state.addBrandTextField.marca}
                onChange={updateInput}
                required
                placeholder="Enter a brand name"
              />
            </div>

            <div className="col-md-4 ps-1">
              <Button
                onClick={() => submitForm(state.addBrandTextField)}
                className="btn btn-success my-1 mx-1"
              >
                <i className="fa fa-plus-circle me-2" />
                Nueva marca
              </Button>
            </div>
          </div>
        </Form.Group>
        <br />
        {/* Display the list of brands */}
        <Form.Group controlId={typeOf + "Seleccionada"}>
          <Form.Label>Marcas existentes:</Form.Label>

          <Form.Control
            as="select"
            name={typeOf + "Seleccionada"}
            value={state.selectedBrandId}
            onChange={updateInput}
            required
          >
            <option value="">Select a brand</option>
            {state.brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.marca}
              </option>
            ))}
          </Form.Control>

          <Button
            className="btn btn-primary my-1 mx-1"
            onClick={handleEditButtonClick}
            // onClick={() => editBrand(state.selectedBrandId)}
          >
            <i className="fa fa-pen"></i>
          </Button>
          <Button
            className="btn btn-danger my-1 mx-1"
            onClick={() => submitDelete(state.selectedBrandId)}
          >
            <i className="fa fa-trash"></i>
          </Button>
          <Collapse in={showText}>
            <div id="collapse">
              <div className="card card-body">
                <Form.Label>Nuevo nombre de marca:</Form.Label>
                <div className="row align-items-center">
                  <div className="col-md-8 pe-1">
                    <Form.Control
                      type="text"
                      name={typeOf + "Editada"}
                      value={state.editBrandTextField.marca}
                      onChange={updateInput}
                      required
                      placeholder="Enter a brand name"
                    />
                  </div>

                  <div className="col-md-4 ps-1">
                    <Button
                      onClick={() =>
                        submitEdditedForm(
                          state.editBrandTextField,
                          state.selectedBrandId
                        )
                      }
                      className="btn btn-primary my-1 mx-1"
                    >
                      <i className="fa-regular fa-circle-check" /> Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </Form.Group>
      </div>
    </>
  );
};

export default DressDependencyManagemen;
