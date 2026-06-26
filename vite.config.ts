import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/quin-chinese-learning-app/",
  plugins: [react()],
  server: {
    port: 5173
  }
});
