import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
  extendPages,
  addLayout,
  addImports,
  addTemplate,
  addPlugin,
} from "@nuxt/kit";

import type { NuxtTemplate } from "@nuxt/schema";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtModule({
  setup() {
    // only run in dev mode (when S3 is set in env)
    if (!process.env.S3) {
      return false;
    }
    addComponentsDir({
      prefix: "edit",
      path: resolve("./editor/components"),
    });
    addImports({
      name: "useFiles",
      as: "useFiles",
      from: resolve("./editor/usefiles.ts"),
    });
    addImports({
      name: "useDataModel",
      as: "useDataModel",
      from: resolve("./editor/usedatamodel.ts"),
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
      pages.push({
        name: "edit-page",
        path: "/edit/:path*",
        file: resolve("./editor/edit.vue"),
      });
    });
  },
});
