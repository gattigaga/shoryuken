import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import { getUser } from "../helpers/data";

export const metadata: Metadata = {
  title: "Dashboard | Shoryuken",
  description: "Manage your boards easily.",
};

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <Content />;
};

export default DashboardPage;
