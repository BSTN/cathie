// https://nuxt.com/docs/api/configuration/nuxt-config
// import svgLoader from 'vite-svg-loader'
import ViteYaml from "@modyfi/vite-plugin-yaml";

export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  modules: [
    "@nuxt/image",
    "@nuxtjs/robots",
    "@nuxtjs/mdc",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@nuxt/fonts",
  ],

  site: {
    url: "https://www.cathiepilkington.com",
  },

  css: ["@/assets/css/theme.css"],

  runtimeConfig: {
    public: {
      domain: process.env.NUXT_IMAGE_DOMAINS,
    },
  },

  image: {
    dir: "/Users/bok/Desktop/cathiedata",
  },

  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/less/ease.less";@import "@/less/globals.less";`,
        },
      },
    },
    plugins: [
      ViteYaml(),
      // svgLoader(),
    ],
  },

  compatibilityDate: "2024-09-28",
});
