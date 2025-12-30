import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="mx-auto py-2">
      <div>{`Copyright © ${new Date().getFullYear()} Dimitris Trechas`}</div>
    </footer>
  );
};

export default Footer;
