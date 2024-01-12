import "./styles/globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400-italic.css";
import "@fontsource/poppins/600-italic.css";

import { FC } from "react";

import Provider from "./components/Provider";
import StyledComponentsRegistry from "./registry";

type Props = {
  children: JSX.Element;
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>
          <Provider>{children}</Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
