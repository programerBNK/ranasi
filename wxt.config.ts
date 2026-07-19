import { defineConfig } from "wxt";

const apiBase = (process.env.WXT_API_BASE || "http://localhost:3130").replace(
  /\/$/,
  "",
);

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  dev: {
    server: {
      port: 3121,
      strictPort: true,
    },
  },
  manifest: {
    default_locale: "en",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["storage", "history", "tabs"],
    host_permissions: [
      "http://*/*",
      "https://*/*",
      "https://api.openai.com/*",
      `${apiBase}/*`,
    ],
  },
});
