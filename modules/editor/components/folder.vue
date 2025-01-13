<template>
  <div>
    <!-- menu bar -->
    <div
      class="sticky top-0 z-10 flex items-center gap-4 border-b border-solid border-bc bg-bg px-8 py-3"
    >
      <input
        type="text"
        class="rounded-md border border-bg1 bg-bg1 px-4 py-2 text-sm text-fg placeholder-fg2 focus:border-bg2 focus:bg-bg2 focus:outline-none focus:ring-0"
        placeholder="Search..."
        ref="searchElement"
        @keydown.escape="$event.target.blur()"
        v-model="filterQuery"
      />
    </div>
    <!-- content list -->
    <div class="bg-bg p-8">
      <draggable
        v-model="listmodel"
        item-key="element"
        class="overflow-hidden rounded-lg border border-bc bg-bg"
      >
        <template #item="{ element }">
          <NuxtLink
            :to="`/edit/${element.path}`"
            class="flex cursor-pointer items-center gap-3 border-b border-solid border-bc px-4 py-3 no-underline last:border-0 hover:underline"
          >
            <Icon name="fluent:document-20-filled" class="text-fg2"></Icon>
            <div>{{ element.name?.split(".").shift() }}</div>
          </NuxtLink>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggable from "vuedraggable";
const filesList = import.meta.glob("@/data/**/*.*");
const files = Object.keys(filesList);
const route = useRoute();
const filterQuery = ref("");
const sortlist = ref([]);
const listmodel = computed({
  get() {
    return list.value;
  },
  set(value) {
    console.log("set list", value);
  },
});
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
<style scoped>
.sortable-ghost {
  @apply bg-bg2 !opacity-50;
}
.sortable-chosen {
  @apply opacity-0;
}
</style>
