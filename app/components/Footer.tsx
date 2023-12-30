import { FC } from "react";
import Link from "next/link";

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 px-8 pt-8 pb-16 md:px-16 xl:px-32 xl:pb-0">
      <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-x-16">
        <div className="border-b border-blue-700 pb-8 xl:pb-0 xl:border-b-0">
          <img
            className="w-36 xl:w-48"
            src="/images/logo-with-text-white.svg"
            alt="Shoryuken Logo"
          />
        </div>
        <div className="border-b border-blue-700 py-4 xl:py-0 xl:border-b-0">
          <p className="text-white text-base font-bold mb-2">About Shoryuken</p>
          <p className="text-white text-xs">What&lsquo;s behind the boards.</p>
        </div>
        <div className="border-b border-blue-700 py-4 xl:py-0 xl:border-b-0">
          <p className="text-white text-base font-bold mb-2">Contact Us</p>
          <p className="text-white text-xs">
            Need anything? Get in touch and we can help.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 mt-8 xl:flex-row xl:border-t xl:border-blue-700 xl:gap-x-6 xl:py-4">
        <Link href="#">
          <p className="text-xs text-white">Privacy Policy</p>
        </Link>
        <Link href="#">
          <p className="text-xs text-white">Terms</p>
        </Link>
        <p className="text-xs text-white">Copyright &copy; {year} Shoryuken</p>
      </div>
    </footer>
  );
};

export default Footer;
