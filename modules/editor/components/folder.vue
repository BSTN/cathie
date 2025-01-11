<template>
  <div>
    <!-- menu bar -->
    <div
      class="sticky top-0 z-10 flex items-center gap-4 border-b border-solid border-bc bg-bg px-8 py-3"
    >
      <input
        type="text"
        class="rounded-md border border-bg1 bg-bg1 px-4 py-2 text-fg placeholder-fg2 focus:border-bg2 focus:bg-bg2 focus:outline-none focus:ring-0"
        placeholder="Search..."
        ref="searchElement"
        @keydown.escape="$event.target.blur()"
        v-model="filterQuery"
      />
    </div>
    <!-- content list -->
    <div class="bg-bg p-8">
      <div class="overflow-hidden rounded-lg border border-bc bg-bg">
        <NuxtLink
          :to="`/edit/${file.path}`"
          v-for="file in list"
          class="flex cursor-pointer items-center gap-3 border-b border-solid border-bc px-6 py-3 no-underline last:border-0 hover:bg-bg1 hover:no-underline"
        >
          <Icon icon="fluent:document-20-filled" class="text-fg2"></Icon>
          <div>{{ file.name?.split(".").shift() }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const filesList = import.meta.glob("@/data/**/*.*");
const files = Object.keys(filesList);
const route = useRoute();
const filterQuery = ref("");
const list = computed(() => {
  const filtered = files.filter((x) => {
    return x.startsWith(`/data/${route.params.path[0]}`);
  });
  return filtered.map((x) => {
    return {
      name: x.split("/").pop(),
      path: x.replace("/data/", ""),
    };
  });
});
</script>
