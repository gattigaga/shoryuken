"use client";

import { FC, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import Modal from "react-modal";
import * as Tooltip from "@radix-ui/react-tooltip";

import { useStore } from "../store/store";
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
  const language = useStore((state) => state.language);

  useEffect(() => {
    i18n.activate(language);
  }, [language]);

  return (
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Tooltip.Provider>{children}</Tooltip.Provider>

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
