import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Form from "./components/Form";
import { getUser } from "../../helpers/auth";

export const metadata: Metadata = {
  title: "Account Details | Shoryuken",
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
      <main className="py-12">
        <div className="w-80 mx-auto md:w-96">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/images/logo-with-text.svg"
                alt="Shoryuken logo"
                width={240}
                height={64}
              />
            </Link>
          </div>
          <div className="md:rounded md:bg-white md:shadow-lg md:p-8">
            <h1 className="font-semibold text-center text-slate-600 mb-6">
              Fill up your account details
            </h1>

            <Form defaultValues={user} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountDetailsPage;
