import { useMediaQuery } from "react-responsive";

const useTailwindBreakpoint = () => {
  const isXLBreakpoint = useMediaQuery({
    query: "(min-width: 1280px)",
  });

  const isMDBreakpoint = useMediaQuery({
    query: "(min-width: 768px)",
  });

  if (isXLBreakpoint) return "xl";
  if (isMDBreakpoint) return "md";

  return "xs";
};

export default useTailwindBreakpoint;
