<template>
  <div class="" v-if="Array.isArray(model)">
    <!-- file editor -->
    <transition name="fade">
      <EditFileEditor
        v-model="editing"
        v-if="editing"
        @next="openNext"
        @prev="openPrev"
      ></EditFileEditor>
    </transition>
    <!-- browse -->
    <transition name="fade">
      <div
        class="fixed left-0 top-0 z-50 h-full w-full overflow-auto bg-bg1 p-4"
        v-if="browse"
      >
        <EditFileBrowser
          @done="addFromFileBrowser"
          @cancel="browse = false"
          :mode="'select'"
          class="!static"
        ></EditFileBrowser>
      </div>
    </transition>
    <!-- the items -->
    <draggable
      v-model="model"
      item-key="element"
      class="grid grid-cols-12 gap-2 rounded-md bg-bg1 p-2"
      @click="browse = true"
    >
      <template #item="{ element }">
        <div
          class="group relative flex aspect-square cursor-move select-none items-center gap-2 rounded border border-bc"
          @click.stop
        >
          <!-- hover buttons -->
          <div
            class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-20 rounded bg-black/50 bg-opacity-30 text-2xl text-fg opacity-0 transition hover:text-f group-hover:opacity-100"
          >
            <button
              class="pointer-events-auto float-right m-2 rounded text-2xl text-fg hover:text-f"
              @click="model.splice(model.indexOf(element), 1)"
            >
              <Icon icon="material-symbols:close-rounded"></Icon>
            </button>
          </div>
          <!-- image -->
          <img
            loading="lazy"
            :key="element"
            :src="`//wsrv.nl/?url=cathie.lon1.digitaloceanspaces.com/${element.replace(
              /^\//,
              '',
            )}&w=400&h=400`"
            @click.stop="editing = element"
            class="h-full w-full rounded object-cover"
          />
        </div>
      </template>
      <template #footer>
        <button
          @click="browse = true"
          class="rounded border border-bc text-3xl text-fg2 hover:bg-bg2 hover:text-fg"
        >
          +
        </button>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts" setup>
import draggable from "vuedraggable";
const model = defineModel();
const editing = ref("");
const browse = ref(false);
function openNext() {
  const nowindex = model.value.findIndex((x) => x === editing.value);
  editing.value =
    model.value[nowindex + 1] || model.value[model.value.length - 1];
}
function openPrev() {
  const nowindex = model.value.findIndex((x) => x === editing.value);
  editing.value = model.value[nowindex - 1] || model.value[0];
}

function addFromFileBrowser(files: string[]) {
  browse.value = false;
  files.forEach((file) => {
    model.value.push(file);
  });
}
</script>
<style scoped>
.sortable-ghost {
  opacity: 0.1;
}
</style>
