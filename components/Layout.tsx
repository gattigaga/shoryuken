import React from "react";
import NavBar from "./NavBar";

type Props = {
  children: any;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <NavBar />

      <main className="flex-1 overflow-auto flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
