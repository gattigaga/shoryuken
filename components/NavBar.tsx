import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

import Avatar from "./Avatar";
import { getMe } from "../api/user";
import { postSignOut } from "../api/auth";
import { useRouter } from "next/router";

type Props = {};

const NavBar: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { data: myself } = useQuery("me", getMe);
  const queryClient = useQueryClient();

  const mutation = useMutation(postSignOut, {
    onSuccess: () => {
      router.replace("/auth/signin");
      queryClient.invalidateQueries("me");
    },
    onError: () => {
      toast.error("Failed to create a board.");
    },
  });

  const fullname = myself?.user_metadata?.fullname || "";
  const email = myself?.email || "";

  const signOut = () => mutation.mutate();

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
