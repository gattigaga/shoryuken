import "../styles/globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400-italic.css";
import "@fontsource/poppins/600-italic.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "0.25rem",
            fontFamily: "Poppins",
            fontSize: "0.75rem",
          },
        }}
        position="top-right"
      />
    </>
  );
}

export default MyApp;
