import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
  extendPages,
  addLayout,
  addImports,
} from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtModule({
  setup() {
    // only run in dev mode
    if (process.env.S3PATH) {
      addComponentsDir({
        path: resolve("./editor/components"),
      });
      addImports({
        name: "useFiles",
        as: "useFiles",
        from: resolve("./editor/usefiles.ts"),
      });
      addServerHandler({
        route: "/api/:path",
        handler: resolve("./editor/api.ts"),
      });
      addLayout(resolve("./editor/edit-layout.vue"), "edit-layout");
      extendPages((pages) => {
        pages.push({
          name: "edit",
          path: "/edit",
          file: resolve("./editor/edit.vue"),
        });
      });
    }
  },
});
