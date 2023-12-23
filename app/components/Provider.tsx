"use client";

import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import Modal from "react-modal";

Modal.setAppElement("body");

const queryClient = new QueryClient();

type Props = {
  children: JSX.Element;
};

const Provider: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
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
    </QueryClientProvider>
  );
};

export default Provider;
