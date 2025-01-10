<template>
  <div class="flex flex-row gap-4 p-8 align-top">
    <div
      class="shrin-0 sticky top-8 flex flex-col self-start p-4 pr-4 font-mono"
    >
      <div
        v-for="name in filenames"
        @click="active = name"
        class="cursor-pointer hover:underline"
        :class="{ underline: active === name }"
      >
        {{ name }}
      </div>
    </div>
    {{ allfiles }}
    <!-- <FileBrowser /> -->
  </div>
</template>

<script lang="ts" setup>
import allfiles from "@/data/allfiles.json";
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
