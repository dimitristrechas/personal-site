import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="py-2 mx-auto">
      <div>{`Copyright © ${new Date().getFullYear()} Dimitris Trechas`}</div>
    </footer>
  );
};

export default Footer;
