"use client";

import { FC } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import Modal from "react-modal";

import { messages as enMessages } from "../locales/en/messages";
import { messages as idMessages } from "../locales/id/messages";

i18n.load({
  en: enMessages,
  id: idMessages,
});

i18n.activate("en");

Modal.setAppElement("body");

const queryClient = new QueryClient();

type Props = {
  children: JSX.Element;
};

const Provider: FC<Props> = ({ children }) => {
  return (
    <I18nProvider i18n={i18n}>
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
    </I18nProvider>
  );
};

export default Provider;
