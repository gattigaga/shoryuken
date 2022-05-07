import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import Avatar from "./Avatar";
import useSignOutMutation from "../hooks/auth/use-sign-out-mutation";
import useUserQuery from "../hooks/user/use-user-query";

type Props = {};

const NavBar: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { data: myself } = useUserQuery();
  const queryClient = useQueryClient();
  const signOutMutation = useSignOutMutation();

  const fullname = myself?.fullname || "";
  const email = myself?.email || "";

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
      await router.replace("/auth/signin");

      queryClient.resetQueries();

      Cookies.remove("access_token", {
        path: "/",
      });
    }
  };

  return (
    <div className="h-12 bg-blue-700 flex flex-row justify-between items-center px-4">
      <Image
        src="/images/logo-with-text-white.svg"
        alt="Shoryuken logo"
        width={144}
        height={28}
      />
      <div className="relative">
        <Avatar
          fullname={fullname}
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
        />
        {isAccountMenuOpen && (
          <div className="w-72 bg-white rounded border shadow-lg absolute top-10 right-0">
            <div className="p-4 border-b">
              <p className="text-center text-xs text-slate-500">Account</p>
            </div>
            <div className="p-4 border-b">
              <p className="text-xs text-slate-600 font-semibold mb-1">
                {fullname}
              </p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
            <div className="p-4">
              <button
                className="w-full text-left text-xs text-red-500"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
