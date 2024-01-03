import { FC } from "react";
import { Trans } from "@lingui/macro";
import { useRouter } from "next/navigation";

const NotFound: FC = () => {
  const router = useRouter();

  return (
    <div className="h-full w-full flex flex-col items-center pt-32">
      <p className="font-semibold text-white text-3xl mb-6">
        <Trans>Board not found</Trans>
      </p>
      <p className="text-white text-sm text-center px-4 max-w-lg mb-8">
        <Trans>
          This board may be private. If someone gave you this link, they may
          need to invite you to one of their boards or Workspaces.
        </Trans>
      </p>
      <button
        className="ml-6 px-2 text-xs h-8 bg-blue-500  text-white font-semibold rounded items-center justify-center"
        type="button"
        onClick={() => router.replace("/dashboard")}
      >
        <Trans>Go Back</Trans>
      </button>
    </div>
  );
};

export default NotFound;
