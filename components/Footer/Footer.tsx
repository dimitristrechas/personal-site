import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="navbar py-3">
      <div className="container justify-content-center">
        <div className="row">
          <div className="col footer">{`Copyright © 2020 Dimitris Trechas`}</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
