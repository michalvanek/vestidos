const RentProcess = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <h2>Proceso de renta</h2>
        <div className="col-lg-3 col-xl-3 mb-4">
          <div className="card  text-black">
            <div className="card-header">1.</div>
            <div className="card-body">
              <h5 className="card-title">Cita</h5>
              <p className="process-card-text">
                <a
                  href="https://wa.me/524811538822"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ☎️
                </a>{" "}
                Avisanos cuándo gustarías pasar.
                <br /> 👁 Te recomendamos hacerlo con al menos una semana de
                anticipación para tu evento.{" "}
                <a
                  href="https://wa.me/524811538822"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://i.imgur.com/fTwYHj3.png"
                    alt="WhatsApp"
                    style={{ width: "100px", height: "auto" }}
                  />
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xl-3 mb-4">
          <div className="card text-black">
            <div className="card-header">2.</div>
            <div className="card-body">
              <h5 className="card-title">Primera visita</h5>
              <p className="process-card-text">
                ✅ Sin compromiso, puedes probarte nuestros vestidos.
                <br />
                👠 Te recomendamos venir con tus zapatillas de evento. <br />
                💘 ¡Decidiste tu vestido, te lo mediremos y solicitaremos un
                apartado de $300! 😊
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xl-3 mb-4">
          <div className="card text-black">
            <div className="card-header">3.</div>
            <div className="card-body">
              <h5 className="card-title">Recoge tu vestido</h5>
              <p className="process-card-text">
                🎉 Tu evento se está acercando!
                <br />
                📅 Ven en la fecha acordada con tu INE y el resto del costo de
                la renta. <br />
                🤩 La renta incluye 3 días, ajustes y tintorería.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-xl-3 mb-4">
          <div className="card text-black">
            <div className="card-header">4.</div>
            <div className="card-body">
              <h5 className="card-title">Devuelve tu vestido</h5>
              <p className="process-card-text">
                📅 En la fecha acordada, devuelve el vestido.
                <br />
                🤝 Te regresamos tu INE. ¡Listo!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentProcess;
