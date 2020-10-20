import React from "react";

const Footer = () => {
  return (
    <div className="navbar py-3" sticky="bottom" expand="lg">
      <div className="container justify-content-center">
        <div className="row">
          <div className="col footer">{`Copyright © 2020 Dimitris Trechas`}</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
