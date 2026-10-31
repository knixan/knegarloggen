import config from "@knegarloggen/config/eslint";

const eslintConfig = [
  ...config,
  // Paketet har ingen pages/-mapp – regeln letar efter en och varnar annars.
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
];

export default eslintConfig;
