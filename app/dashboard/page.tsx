import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import { getUser } from "../helpers/data";
import NetworkStatus from "./components/NetworkStatus";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "Dashboard | Shoryuken",
  description: "Manage your boards easily.",
};

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <NavBar />

      <main className="flex-1 overflow-auto flex flex-col">
        <Content />
        <NetworkStatus />
      </main>
    </div>
  );
};

export default DashboardPage;
