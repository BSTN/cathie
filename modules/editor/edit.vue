<template>
  <ClientOnly>
    <div
      ref="el"
      class="edit-page fixed bottom-0 left-0 right-0 top-0 z-[99] flex flex-row items-stretch bg-bg p-0 tracking-extra text-fg"
      v-if="configStatus === 'success'"
    >
      <div
        class="sticky top-8 flex h-full w-64 shrink-0 flex-col self-start overflow-auto border-r border-bc p-4"
      >
        <NuxtLink
          v-for="(content, name) in menuList"
          :to="`/edit/${name}`"
          class="mb-1 flex items-center gap-3 rounded-md px-3 py-2 capitalize !no-underline hover:bg-bg1"
          :class="[$route.path.startsWith(`/edit/${name}`) ? 'bg-bg1' : '']"
        >
          <icon :name="content.icon" class="text-fg2"></icon>
          <div class="name grow">
            {{ name }}
          </div>
        </NuxtLink>
      </div>
      <div class="relative grow overflow-auto">
        <component :is="componentName" class="!relative h-full" />
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
const { config, configStatus, save } = useDataModel();
const el = ref(null);
const menuList = computed(() => {
  const list = {};
  for (let i in config.value) {
    if (!i.startsWith("_")) {
      list[i] = config.value[i];
    }
  }
  return list;
});
import {
  EditFileBrowser,
  EditMarkdown,
  EditFolder,
  EditYaml,
} from "#components";

const components = {
  filebrowser: EditFileBrowser,
  markdown: EditMarkdown,
  folder: EditFolder,
  yaml: EditYaml,
};
const route = useRoute();

const componentName = computed(() => {
  // if (configLoading.value) {
  //   return "div";
  // }
  if (route.params.path.length > 1) {
    return components["yaml"];
  }
  if (route.params.path.length === 1) {
    const type = config.value[route.params.path[0]].type || "text";
    return components[type] || "div";
  }
  return "div";
});

const active = ref("");
const filenamesList = import.meta.glob("@/data/**/*.*");
const filenames = [];
for (let i in filenamesList) {
  filenames.push(filenamesList[i].name.replace("/data/", ""));
}

// not working:
definePageMeta({
  layout: "edit-layout",
});
</script>
<style scoped>
.edit-page {
  --f: #fff874;
  --fg: #b3b39d;
  --fg2: #636355;
  --bc: #2a2a2f;
  --bg: #1c1d20;
  --bg1: #141619;
  --bg2: #101111;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.125s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
