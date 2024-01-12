import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";

import { getExcerpt } from "../helpers/formatter";
import { getTailwindColors } from "../helpers/others";

const StyledContainer = styled.div<{ color: string }>`
  background: ${(props) => getTailwindColors(props.color, 700)};

  &:hover {
    background: ${(props) => getTailwindColors(props.color, 800)};
  }
`;

type Props = {
  title: string;
  color: string;
  href: string;
  isDisabled?: boolean;
};

const Board: FC<Props> = ({ title, color, href, isDisabled }) => {
  const content = (
    <StyledContainer className="root p-4 h-32 rounded" color={color}>
      <p className="text-md font-semibold text-white">
        {getExcerpt(title, 50)}
      </p>
    </StyledContainer>
  );

  if (isDisabled) return content;

  return <Link href={href}>{content}</Link>;
};

export default Board;
