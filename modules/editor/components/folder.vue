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
        v-if="!create"
      />
      <input
        type="text"
        class="rounded-md border border-bg1 bg-bg1 px-4 py-2 text-sm text-fg placeholder-fg2 focus:border-bg2 focus:bg-bg2 focus:outline-none focus:ring-0"
        placeholder="Create..."
        ref="createElement"
        @keydown.escape="create = false"
        v-model="createtext"
        @keydown.enter="makeFile()"
        v-if="create"
      />
      <button
        class="text-2xl leading-[0] hover:text-f"
        @click="create = true"
        v-if="!create"
      >
        <Icon name="material-symbols:add-box"></Icon>
      </button>
      <div class="grow"></div>
    </div>
    <!-- content list -->
    <div class="bg-bg p-8">
      <draggable
        v-model="listmodel"
        item-key="element"
        @change="saveOrder"
        class="overflow-hidden rounded-lg border border-bc bg-bg"
      >
        <template #item="{ element }">
          <NuxtLink
            :to="`/edit/${route.params.path.join('/')}/${element}`"
            class="flex cursor-pointer items-center gap-3 border-b border-solid border-bc px-4 py-3 no-underline last:border-0 hover:underline"
          >
            <Icon
              name="fluent:document-20-filled"
              class="handle text-fg2"
            ></Icon>
            <div>{{ element.split("/").pop().split(".").shift() }}</div>
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
const create = ref(false);
const sortlist = ref([]);
const createtext = ref("");
const createElement = ref(null);
const { getFolder, saveFolderOrder, createFile } = useDataModel();

async function makeFile() {
  await createFile(route.params.path.join("/"), createtext.value);
  refreshFolder();
  createtext.value = "";
  create.value = false;
}

watch(create, (val) => {
  if (!val) return;
  nextTick(() => {
    createElement.value.focus();
    createElement.value.select();
  });
});

const listmodel = ref([]);

async function refreshFolder() {
  listmodel.value = await getFolder(route.params.path.join("/"));
}

async function saveOrder() {
  const path = route.params.path.join("/");
  await saveFolderOrder(path, listmodel.value);
}

onMounted(async () => {
  refreshFolder();
});
</script>
<style scoped>
.sortable-ghost {
  @apply bg-bg2 !opacity-50;
  > div {
    opacity: 0;
  }
}
.sortable-chosen {
  @apply border-none opacity-50;
}
</style>
