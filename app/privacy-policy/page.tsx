import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Content from "./components/Content";
import { getUser } from "../helpers/data";

export const metadata: Metadata = {
  title: "Privacy Policy | Shoryuken",
  description: "Privacy Policy for Shoryuken. Keep your data safe.",
};

const PrivacyPolicyPage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <Header isFloatingByDefault={true} />

      <main className="px-4 py-32 w-full bg-slate-50 md:px-16 md:py-48 xl:px-32">
        <Content />
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
