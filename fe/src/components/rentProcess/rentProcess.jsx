import React from "react";

const RentProcess = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2>Proceso de renta</h2>
        <div className="col-md-3 mb-4">
          <div
            className="card  text-black"
            style={{
              backgroundColor: "pink",
            }}
          >
            <div className="card-header">1.</div>
            <div className="card-body">
              <h5 className="card-title">Cita</h5>
              <p className="card-text">
                <a
                  href="https://wa.me/524811105225"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ☎️
                </a>{" "}
                Avisanos cuándo gustarías pasar.
                <br /> 👁 Te recomendamos mínimo una semana antes de tu evento.{" "}
                <a
                  href="https://wa.me/524811105225"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/public/WhatsAppButtonWhiteSmall.png"
                    alt="WhatsApp"
                    style={{ width: "100px", height: "auto" }}
                  />
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-black" style={{ backgroundColor: "pink" }}>
            <div className="card-header">2.</div>
            <div className="card-body">
              <h5 className="card-title">Primera visita</h5>
              <p className="card-text">
                ✅ Sin compromiso puedes medirte nuestros vestidos 👗.
                <br />
                👁 Te recomendamos venir con zapatillas que usarás en tu evento.{" "}
                <br />
                💘 Cuándo decides por un vestido, te tomamos medidas para hacer
                ajustes y pediremos apartado de $300.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-black" style={{ backgroundColor: "pink" }}>
            <div className="card-header">3.</div>
            <div className="card-body">
              <h5 className="card-title">Recoger vestido</h5>
              <p className="card-text">
                🎉 Tu evento se está acercando!
                <br />
                📅 En fecha acordada pasa por tu vestido con tu INE y el resto
                del costo de la renta. <br />
                🤩 Tienes incluidos 3 días de renta, ajustes y tintorería.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-black" style={{ backgroundColor: "pink" }}>
            <div className="card-header">4.</div>
            <div className="card-body">
              <h5 className="card-title">Regreso de vestido</h5>
              <p className="card-text">
                📅 En fecha acordada vienes a regresar el vestido, se te regresa
                tu INE y listo! 🤝
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentProcess;
