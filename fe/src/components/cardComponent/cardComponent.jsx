import React from "react";

const CardComponent = ({ dress }) => {
  return (
    <div className="card" style={{ background: "#FFF8F7" }}>
      <div className="card-body">
        <img className="card-img-top" src={dress.fotoPrincipal} alt="Dress" />
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
            <i className="fas fa-dollar-sign icon" title="precio en pesos"></i>
            <span className="icon-value">{dress.precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
