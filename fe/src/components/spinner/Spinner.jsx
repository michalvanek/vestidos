import React from "react";
import "./spinner.css";

let Spinner = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="container align-items-center d-flex justify-content-around">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Spinner;
