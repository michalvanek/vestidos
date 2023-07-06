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
      <p>{(state.selectedBrandId, state.addBrandTextField.marca)}</p>
      <div className="row align-items-center">
        <div className="container-sm pb-2">
          <Form.Label>
            <h3>{`${typeOf.charAt(0).toUpperCase() + typeOf.slice(1)}`}</h3>
          </Form.Label>
          {typeOf !== "precio" && (
            <>
              <Form.Group controlId={typeOf + "Nueva"}>
                <div className="row align-items-center">
                  <div className="col col-lg-4 pe-1">
                    <Form.Control
                      type="text"
                      name={typeOf + "Nueva"}
                      value={
                        typeOf === "marca"
                          ? state.addBrandTextField.marca
                          : typeOf === "color"
                          ? state.addColorTextField.color
                          : ""
                      }
                      onChange={updateInput}
                      required
                      placeholder={`Escribe nombre de ${typeOf}`}
                    />
                  </div>

                  <div className="col-md-auto ps-1">
                    <Button
                      onClick={() => {
                        let data;
                        if (typeOf === "marca") {
                          data = state.addBrandTextField;
                        } else if (typeOf === "color") {
                          data = state.addColorTextField;
                        } else {
                          return alert("typeOf should be marca o color");
                        }
                        submitForm(data, typeOf);
                      }}
                      className="btn btn-success my-1 mx-1"
                    >
                      <i className="fa fa-plus-circle me-2" />
                      {`${typeOf}`}
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </>
          )}

          {/* Display the list of brands */}
          <Form.Group controlId={typeOf + "Seleccionada"}>
            <div className="row align-items-center">
              <div className="col pe-1">
                <Form.Control
                  as="select"
                  name={typeOf + "Seleccionada"}
                  value={
                    typeOf === "marca"
                      ? state.selectedBrandId
                      : typeOf === "color"
                      ? state.selectedColorId
                      : typeOf === "precio"
                      ? state.selectedPriceId
                      : ""
                  }
                  onChange={updateInput}
                  required
                >
                  <option value="">{`Selecciona ${typeOf}`}</option>
                  {typeOf === "marca" ? (
                    state.brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.marca}
                      </option>
                    ))
                  ) : typeOf === "color" ? (
                    state.colors.map((color) => (
                      <option key={color._id} value={color._id}>
                        {color.color}
                      </option>
                    ))
                  ) : typeOf === "precio" ? (
                    state.prices.map((precio) => (
                      <option key={precio._id} value={precio._id}>
                        {precio.value}
                      </option>
                    ))
                  ) : (
                    <option value="">Invalid typeOf value</option>
                  )}
                </Form.Control>
              </div>
              <div className="col-md-auto ps-1">
                <Button
                  className="btn btn-primary my-1 mx-1"
                  onClick={handleEditButtonClick}
                  // onClick={() => editBrand(state.selectedBrandId)}
                >
                  <i className="fa fa-pen"></i>
                </Button>
                {typeOf !== "precio" && (
                  <>
                    <Button
                      className="btn btn-danger my-1 mx-1"
                      onClick={() => {
                        let id;
                        if (typeOf === "marca") {
                          id = state.selectedBrandId;
                        } else if (typeOf === "color") {
                          id = state.selectedColorId;
                        } else {
                          return alert(
                            "typeOf should be marca o color o precio"
                          );
                        }
                        submitDelete(id, typeOf);
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Collapse in={showText}>
              <div id="collapse">
                <div className="card card-body">
                  <div className="row align-items-center">
                    <div className="col pe-1">
                      <Form.Control
                        type="text"
                        name={typeOf + "Editada"}
                        value={
                          typeOf === "marca"
                            ? state.editBrandTextField.marca
                            : typeOf === "color"
                            ? state.editColorTextField.color
                            : typeOf === "precio"
                            ? state.editPriceTextField.precio
                            : ""
                        }
                        onChange={updateInput}
                        required
                        placeholder={`Escribe ${typeOf}`}
                      />
                    </div>

                    <div className="col-md-auto ps-1">
                      <Button
                        onClick={() => {
                          let data;
                          let id;
                          if (typeOf === "marca") {
                            (data = state.editBrandTextField),
                              (id = state.selectedBrandId);
                          } else if (typeOf === "color") {
                            (data = state.editColorTextField),
                              (id = state.selectedColorId);
                          } else if (typeOf === "precio") {
                            const { precio } = state.editPriceTextField; // Get the value of "precio" from state.editPriceTextField
                            data = { value: precio }; // Create a new object with property "valor" having the value of "precio"
                            id = state.selectedPriceId;
                          } else {
                            return alert(
                              "typeOf should be marca o color o precio"
                            );
                          }
                          submitEdditedForm(data, id, typeOf);
                        }}
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
      </div>
    </>
  );
};

export default DressDependencyManagemen;
