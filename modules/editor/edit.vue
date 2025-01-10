<template>
  <div
    class="edit-page absolute bottom-0 left-0 right-0 top-0 flex flex-row gap-4 bg-bg p-8 align-top text-fg"
  >
    <div class="shrin-0 sticky top-8 flex w-48 flex-col self-start p-4 pr-4">
      <div class="mb-3 capitalize" v-for="(content, name) in config">
        <NuxtLink :to="`/edit/${name}`">{{ name }}</NuxtLink>
      </div>
    </div>
    <div class="grow rounded-md border border-solid border-bg1">
      {{ $route.params.path }}
    </div>
    <!-- <FileBrowser /> -->
  </div>
</template>

<script lang="ts" setup>
import configRaw from "@/data/config.yml";

const config = computed(() => {
  for (let i in configRaw) {
    if (typeof configRaw[i] === "string") {
      configRaw[i] = {
        type: configRaw[i],
      };
    }
  }
  return configRaw;
});

definePageMeta({
  layout: "edit-layout",
});
const active = ref("");
const filenamesList = import.meta.glob("@/data/**/*.*");
const filenames = [];
for (let i in filenamesList) {
  filenames.push(filenamesList[i].name.replace("/data/", ""));
}
</script>
<style scoped>
.edit-page {
  --f: #fff874;
  --fg: #b3b39d;
  --fg2: #636355;
  --bg: #1e1e1e;
  --bg1: #151515;
  --bg2: #090909;
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
