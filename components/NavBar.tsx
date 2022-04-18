import React, { useState } from "react";
import Image from "next/image";
import Avatar from "./Avatar";

type Props = {};

const NavBar: React.FC<Props> = ({}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const logout = async () => {};

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
          fullname="Gattigaga Hayyuta Dewa"
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
        />
        {isAccountMenuOpen && (
          <div className="w-72 bg-white rounded border shadow-lg absolute top-10 right-0">
            <div className="p-4 border-b">
              <p className="text-center text-xs text-slate-500">Account</p>
            </div>
            <div className="p-4 border-b">
              <p className="text-xs text-slate-600 font-semibold mb-1">
                Gattigaga Hayyuta Dewa
              </p>
              <p className="text-xs text-slate-400">gattigaga@gmail.com</p>
            </div>
            <div className="p-4">
              <button
                className="w-full text-left text-xs text-red-500"
                type="button"
                onClick={logout}
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
