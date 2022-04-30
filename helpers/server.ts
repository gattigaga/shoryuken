import cookie from "cookie";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

import supabase from "./supabase";

export const withAuthGuard =
  (callback: GetServerSideProps) =>
  async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    // Check validity of JWT access token.
    const cookies = cookie.parse(context.req.headers?.cookie || "");
    const { error } = await supabase.auth.api.getUser(cookies.access_token);

    if (error) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    return callback(context);
  };
