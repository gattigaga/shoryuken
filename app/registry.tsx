"use client";

import React, { FC, useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

type Props = {
  children: JSX.Element;
};

const StyledJsxRegistry: FC<Props> = ({ children }) => {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();

    jsxStyleRegistry.flush();

    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
};

export default StyledJsxRegistry;
