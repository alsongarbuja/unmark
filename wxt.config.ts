import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  vite: () => ({
    plugins: [react(), tailwindcss()],
  }),
  manifest: {
    name: "Unmark",
    description:
      "Tired of those piled up bookmarks, add reminders to check them later and clear afterwards.",
    version: "0.8.0",
    permissions: ["bookmarks"],
  },
});
