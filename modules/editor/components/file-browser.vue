<template>
  <div
    class="file-browser fixed bottom-0 left-0 right-0 top-0 overflow-auto bg-bg2 p-2"
  >
    <!-- editor -->
    <transition name="fade">
      <FileEditor
        v-model="editing"
        v-if="editing"
        @next="openNext"
        @prev="openPrev"
      ></FileEditor>
    </transition>

    <!-- menu bar -->
    <div
      class="sticky top-0 z-10 flex items-center gap-2 rounded-md bg-bg px-2 py-2"
    >
      <!-- <button class="rounded-md bg-bg2 p-1 px-3 text-fg">Folders</button> -->
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
      <div class="grow"></div>
      <div class="rounded-md bg-bg1 p-1 px-3 text-f" v-if="selected.length > 0">
        {{ selected.length }}
      </div>
      <button
        class="rounded-md bg-bg1 p-1 px-3 text-f"
        @click="selected = []"
        v-if="selected.length > 0"
      >
        Deselect all
      </button>
    </div>
    <div class="bg-bg2 p-2 px-0">
      <!-- the grid -->
      <div class="border-right grid w-full grid-cols-12 gap-2" v-if="ALLFILES">
        <!-- file -->
        <div
          v-for="file in filteredFiles"
          class="group relative overflow-hidden rounded border border-solid border-bg"
          @click.meta="toggleSelected(file.Key)"
        >
          <!-- file: selected border -->
          <div
            v-if="selected.includes(file.Key)"
            class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full rounded-md border-4 border-solid border-f"
          ></div>
          <!-- file: select button -->
          <button
            class="absolute left-0 top-0 z-20 m-2 rounded bg-bg text-3xl text-fg opacity-0 outline-2 outline-fg transition group-hover:opacity-100"
            @click.exact="toggleSelected(file.Key)"
            :class="{ 'opacity-100': selected.includes(file.Key) }"
          >
            <Icon
              icon="mdi:checkbox-blank"
              v-if="!selected.includes(file.Key)"
            ></Icon>
            <Icon icon="mdi:checkbox-marked" class="text-f" v-else></Icon>
          </button>
          <!-- file: preview -->
          <FilePreview
            class="file"
            @click.exact="editing = file.Key"
            :file="file"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { onKeyStroke } from "@vueuse/core";
const searchElement = ref<HTMLInputElement | null>(null);
const ALLFILES = useFiles();
const filterType = ref("");
const filterQuery = ref("");
const editing = ref("");
const selected = ref([]);
function toggleSelected(key: string) {
  if (selected.value.includes(key)) {
    selected.value = selected.value.filter((x) => x !== key);
  } else {
    selected.value.push(key);
  }
}
function openNext() {
  const nowindex = filteredFiles.value.findIndex(
    (x) => x.Key === editing.value,
  );
  editing.value =
    filteredFiles.value[nowindex + 1].Key ||
    filteredFiles.value[filteredFiles.value.length - 1].Key;
}
function openPrev() {
  const nowindex = filteredFiles.value.findIndex(
    (x) => x.Key === editing.value,
  );
  editing.value =
    filteredFiles.value[nowindex - 1].Key || filteredFiles.value[0].Key;
}
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
    return ALLFILES.filter((file) =>
      file?.type?.match(/(image|video|audio|pdf)/i),
    );
  }

  return ALLFILES.filter((file) => {
    if (filterQuery.value) {
      if (
        file.Key.includes(filterQuery.value) &&
        file?.type?.match(/(image|video|audio|pdf)/i)
      )
        return true;
    }
    return false;
  });
});
</script>
