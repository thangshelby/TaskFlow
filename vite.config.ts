import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vitePluginImp from "vite-plugin-imp";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      allowedHosts: [
        env.VITE_ALLOWED_HOST,
      ]
    },
    plugins: [
      viteCompression({
        algorithm: "brotliCompress",
      }),
      tailwindcss(),
      vitePluginImp({
        libList: [
          {
            libName: "antd",
            style: (name) => `antd/es/${name}/style/index.js`,
          },
        ],
      }),
    ],
    build: {
      sourcemap: true,
    },
    resolve: {
      alias: [{ find: "@libs", replacement: "/src" }],
    },
  };
});
