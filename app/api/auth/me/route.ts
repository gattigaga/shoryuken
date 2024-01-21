import { cookies } from "next/headers";
import { decode } from "base64-arraybuffer";
import { UserAttributes } from "@supabase/supabase-js";

import supabase from "../../../helpers/supabase";
import { getHttpStatusCode } from "../../../helpers/others";

export const GET = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    return new Response(
      JSON.stringify({
        data: {
          id: user?.id,
          fullname:
            user?.user_metadata.fullname || user?.user_metadata.full_name,
          username: user?.user_metadata.username,
          email: user?.email,
          is_confirmed: !!user?.email_confirmed_at,
          avatar: user?.user_metadata.avatar,
        },
        message: "User data successfully found.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: error.status || getHttpStatusCode(error.code) || 500,
      }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value || "";

    const { user, error: userError } = await supabase.auth.api.getUser(token);

    if (userError) {
      throw userError;
    }

    const { avatar, fullname, username, password, confirm_password } =
      (await request.json()) as {
        avatar: string;
        fullname: string;
        username: string;
        password: string;
        confirm_password: string;
      };

    if (password && password !== confirm_password) {
      return new Response(
        JSON.stringify({
          message: "Password and Confirm Password is mismatch.",
        }),
        {
          status: 400,
        }
      );
    }

    const avatarFileName = `${user?.id}_${Date.now()}.png`;

    if (avatar) {
      // Delete old avatar
      if (user?.user_metadata.avatar) {
        await supabase.storage
          .from("common")
          .remove([`avatars/${user?.user_metadata.avatar}`]);
      }

      // Upload new avatar
      const { error: avatarError } = await supabase.storage
        .from("common")
        .upload(
          `avatars/${avatarFileName}`,
          decode(avatar.replace("data:image/png;base64,", "")),
          {
            contentType: "image/png",
          }
        );

      if (avatarError) {
        throw avatarError;
      }
    }

    const data = (() => {
      const result: Record<string, string> = {};

      if (fullname) {
        result["fullname"] = fullname;
      }

      if (username) {
        result["username"] = username;
      }

      if (avatar) {
        result["avatar"] = avatarFileName;
      }

      return result;
    })();

    const attributes: UserAttributes = {
      data,
      ...(password ? { password } : {}),
    };

    const { user: updatedUser, error: updatedUserError } =
      await supabase.auth.api.updateUser(token || "", attributes);

    if (updatedUserError) {
      throw updatedUserError;
    }

    return new Response(
      JSON.stringify({
        data: updatedUser,
        message: "User data successfully updated.",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: error.status || getHttpStatusCode(error.code) || 500,
      }
    );
  }
};
