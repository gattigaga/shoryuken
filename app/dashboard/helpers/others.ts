import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../../tailwind.config.js";

const { theme } = resolveConfig(tailwindConfig);

type ColorLevel =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

export const getTailwindColors = (color: string, level: ColorLevel) => {
  return (theme.colors as any)[color][level] as string;
};

export const getAvatarUrl = (filename: string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/common/avatars/${filename}`;
};
