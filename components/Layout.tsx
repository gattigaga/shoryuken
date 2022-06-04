import React from "react";

import NavBar from "./NavBar";
import NetworkStatus from "./NetworkStatus";

type Props = {
  children: any;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <NavBar />

      <main className="flex-1 overflow-auto flex flex-col">
        {children}
        <NetworkStatus />
      </main>
    </div>
  );
};

export default Layout;
