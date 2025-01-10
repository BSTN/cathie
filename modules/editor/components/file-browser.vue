<template>
  <div
    class="file-browser fixed bottom-0 left-0 right-0 top-0 overflow-auto bg-bg"
  >
    <!-- editor -->
    <EditFileEditor v-model="editing" v-if="editing"></EditFileEditor>

    <!-- menu bar -->
    <div
      class="sticky top-0 z-10 flex items-center gap-2 border-b border-solid border-bg2 bg-bg px-4 py-3"
    >
      <button class="rounded-md bg-bg2 p-1 px-3 text-fg">Folders</button>
      <input
        type="text"
        class="rounded-md bg-bg2 p-1 px-3 text-fg placeholder-fg2 focus:outline-none focus:ring-0"
        placeholder="Search..."
        ref="searchElement"
        @keydown.escape="$event.target.blur()"
        v-model="filterQuery"
      />
      <button class="rounded-md bg-bg1 p-1 px-3 text-fg">Images</button>
      <button class="rounded-md bg-bg1 p-1 px-3 text-fg">Videos</button>
      <button class="rounded-md bg-bg1 p-1 px-3 text-fg">Other</button>
    </div>
    <div class="bg-bg2 p-4">
      <div class="border-right grid w-full grid-cols-12 gap-2" v-if="ALLFILES">
        <FilePreview
          class="file"
          @click="editing = file.key"
          v-for="file in filteredFiles"
          :file="file"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
const searchElement = ref<HTMLInputElement | null>(null);
const ALLFILES = useFiles();
const filterType = ref("");
const filterQuery = ref("");
const editing = ref("");
onKeyStroke("k", (ev) => {
  if (ev.metaKey && searchElement.value) {
    ev.preventDefault();
    searchElement.value.focus();
    searchElement.value.select();
  }
});
const filteredFiles = computed(() => {
  if (!ALLFILES) return [];
  if (!filterType.value && !filterQuery.value) {
    return ALLFILES.listBucketResult.contents.filter((file) =>
      file?.type?.match(/(image|video|audio|pdf)/i),
    );
  }

  return ALLFILES.listBucketResult.contents.filter((file) => {
    if (filterQuery.value) {
      if (
        file.key.includes(filterQuery.value) &&
        file?.type?.match(/(image|video|audio|pdf)/i)
      )
        return true;
    }
    return false;
  });
});
</script>

<style scoped>
.file-browser {
  --fg: #b3b39d;
  --fg2: #636355;
  --bg: #1e1e1e;
  --bg1: #151515;
  --bg2: #090909;
}
</style>
