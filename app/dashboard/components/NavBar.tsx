"use client";

import { FC } from "react";
import Image from "next/image";
import { useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Trans } from "@lingui/macro";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import useSignOutMutation from "../hooks/use-sign-out-mutation";
import useUserQuery from "../hooks/use-user-query";
import { getTailwindColors } from "../helpers/others";
import { getInitials } from "../../helpers/formatter";

type Props = {
  color?: string;
};

const NavBar: FC<Props> = ({ color = "blue" }) => {
  const router = useRouter();
  const userQuery = useUserQuery();
  const queryClient = useQueryClient();
  const signOutMutation = useSignOutMutation();

  const signOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } finally {
      Cookies.remove("access_token", {
        path: "/",
      });

      router.replace("/auth/signin");
      queryClient.resetQueries();
    }
  };

  return (
    <div
      style={{ background: getTailwindColors(color, 700) }}
      className="h-12 flex flex-row justify-between items-center px-4"
    >
      <Image
        src="/images/logo-with-text-white.svg"
        alt="Shoryuken logo"
        width={144}
        height={28}
        priority={true}
      />

      {userQuery.status === "success" && (
        <div className="relative">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden select-none w-8 h-8 rounded-full">
                <Avatar.Fallback
                  style={{ color: getTailwindColors(color, 700) }}
                  className="w-full h-full flex items-center justify-center bg-white text-base font-semibold"
                >
                  {getInitials(userQuery.data.fullname)}
                </Avatar.Fallback>
              </Avatar.Root>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="dropdown-menu-content min-w-60 bg-white rounded p-2 shadow-md"
                sideOffset={5}
                side="bottom"
              >
                <div className="p-2 pb-4">
                  <p className="font-semibold text-xs text-slate-700">
                    {userQuery.data.fullname}
                  </p>
                  <p className="text-xs text-slate-500">
                    {userQuery.data.email}
                  </p>
                </div>
                <DropdownMenu.Separator className="h-px bg-slate-300 mb-2" />
                <DropdownMenu.Item
                  className="dropdown-menu-item text-xs text-red-500 h-6 px-2 flex items-center outline-none rounded data-[highlighted]:text-white"
                  onClick={signOut}
                >
                  <Trans>Sign Out</Trans>
                </DropdownMenu.Item>

                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      )}

      <style jsx>{`
        :global(.dropdown-menu-item[data-highlighted]) {
          background: ${getTailwindColors(color, 500)};
        }
      `}</style>
    </div>
  );
};

export default NavBar;
