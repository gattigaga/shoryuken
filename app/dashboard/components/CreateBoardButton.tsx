import { FC } from "react";
import { Trans } from "@lingui/macro";

type Props = {
  onClick?: () => void;
};

const CreateBoardButton: FC<Props> = ({ onClick }) => {
  return (
    <button
      className="p-4 h-32 bg-slate-200 rounded hover:bg-slate-300"
      type="button"
      onClick={onClick}
    >
      <p className="text-md text-slate-500">
        <Trans>Create new board</Trans>
      </p>
    </button>
  );
};

export default CreateBoardButton;
