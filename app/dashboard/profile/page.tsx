import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUser } from "../../helpers/data";
import NetworkStatus from "../components/NetworkStatus";
import NavBar from "../components/NavBar";
import Form from "./components/Form";

export const metadata: Metadata = {
  title: "Profile | Shoryuken",
  description: "Manage your user profile data.",
};

const ProfilePage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="h-screen bg-white md:bg-slate-50 flex flex-col">
      <NavBar />

      <main className="py-12 w-80 mx-auto flex flex-col md:w-96">
        <Form />
        <NetworkStatus />
      </main>
    </div>
  );
};

export default ProfilePage;
