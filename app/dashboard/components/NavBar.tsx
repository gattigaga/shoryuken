"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Avatar from "./Avatar";
import useSignOutMutation from "../hooks/use-sign-out-mutation";
import useUserQuery from "../hooks/use-user-query";

const NavBar: FC = () => {
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const refAvatar = useRef<HTMLDivElement>(null);
  const refMenu = useRef<HTMLDivElement>(null);
  const userQuery = useUserQuery();
  const queryClient = useQueryClient();
  const signOutMutation = useSignOutMutation();

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
      router.replace("/auth/signin");

      queryClient.resetQueries();

      Cookies.remove("access_token", {
        path: "/",
      });
    }
  };

  // Close menu if outside is clicked.
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refAvatar.current && refMenu.current) {
        if (
          !refAvatar.current.contains(event.target) &&
          !refMenu.current.contains(event.target)
        ) {
          setIsAccountMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-12 bg-blue-700 flex flex-row justify-between items-center px-4">
      <Image
        src="/images/logo-with-text-white.svg"
        alt="Shoryuken logo"
        width={144}
        height={28}
      />
      {userQuery.status === "success" && (
        <div className="relative">
          <div ref={refAvatar}>
            <Avatar
              fullname={userQuery.data.fullname}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            />
          </div>
          {isAccountMenuOpen && (
            <div
              ref={refMenu}
              className="w-72 bg-white rounded border shadow-lg absolute top-10 right-0"
            >
              <div className="p-4 border-b">
                <p className="text-center text-xs text-slate-500">Account</p>
              </div>
              <div className="p-4 border-b">
                <p className="text-xs text-slate-600 font-semibold mb-1">
                  {userQuery.data.fullname}
                </p>
                <p className="text-xs text-slate-400">{userQuery.data.email}</p>
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
      )}
    </div>
  );
};

export default NavBar;
