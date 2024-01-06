import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Form from "./components/Form";
import { getUser } from "../../helpers/data";

export const metadata: Metadata = {
  title: "Account Details | Shoryuken",
  description: "Update your account details while onboarding.",
};

const AccountDetailsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.username && user.fullname) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen md:bg-slate-50">
      <main className="pt-12 w-80 mx-auto flex flex-col md:w-96">
        <Link className="self-center mb-6" href="/">
          <Image
            src="/images/logo-with-text.svg"
            alt="Shoryuken logo"
            width={240}
            height={64}
          />
        </Link>

        <Form defaultValues={user} />
      </main>
    </div>
  );
};

export default AccountDetailsPage;
