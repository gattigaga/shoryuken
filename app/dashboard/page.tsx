import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Content from "./components/Content";
import { getUser } from "../helpers/auth";

export const metadata: Metadata = {
  title: "Dashboard | Shoryuken",
};

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <Content />;
};

export default DashboardPage;
