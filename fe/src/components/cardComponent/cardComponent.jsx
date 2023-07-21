import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../context/loginContext";
import EditDress from "../../pages/editDress";

const CardComponent = ({
  dress,
  onDelete,
  onOpenEditModal,
  onCloseEditModal,
  isOpen,
  getAccessTokenHeader,
  dressChanged,
}) => {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <div className="card border rounded" style={{ background: "#FFF8F7" }}>
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
          <div>
            <Link to={`/`} className="btn btn-warning my-1 mx-1">
              <i className="fa fa-eye"></i>
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to={`/${dress._id}`}
                  className="btn btn-primary my-1 mx-1"
                >
                  <i className="fa fa-pen"></i>
                </Link>
                {/* <EditDress
                  getAccessTokenHeader={getAccessTokenHeader}
                  dress={dress}
                  dressChanged={dressChanged}
                /> */}
                <button
                  className="btn btn-danger my-1 mx-1"
                  onClick={() => onDelete()}
                  //   onClick={() => clickDelete(video.id)}
                >
                  <i className="fa fa-trash"></i>
                </button>{" "}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
