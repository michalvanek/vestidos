import React from "react";

function SearchBar({ state, updateInput }) {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <form className="row">
          {/* <i className="fa-solid fa-magnifying-glass"></i> */}
          <h5>Filtros:</h5>
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
  );
}

export default SearchBar;
