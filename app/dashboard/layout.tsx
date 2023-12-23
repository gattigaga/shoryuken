import { FC } from "react";

import NavBar from "./components/NavBar";
import NetworkStatus from "./components/NetworkStatus";

type Props = {
  children: JSX.Element;
};

const Layout: FC<Props> = ({ children }) => {
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
