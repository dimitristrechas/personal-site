import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <div className="navbar pt-5 pb-3">
      <div className="container justify-content-center">
        <div className="row">
          <div className="col footer">{`Copyright © ${new Date().getFullYear()} Dimitris Trechas`}</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
