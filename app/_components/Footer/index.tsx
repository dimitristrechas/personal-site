import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="m-4 mx-auto">
      <div>{`Copyright © ${new Date().getFullYear()} Dimitris Trechas`}</div>
    </footer>
  );
};

export default Footer;
