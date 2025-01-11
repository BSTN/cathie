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
    <!-- add button -->
    <button
      class="mb-2 rounded border border-bc bg-bg1 px-8 py-2 hover:bg-bg2"
      @click="browse = true"
    >
      Add an image
    </button>
    <!-- the items -->
    <draggable
      v-model="model"
      item-key="element"
      class="grid grid-cols-12 gap-2 rounded-md bg-bg1 p-2"
      @click="browse = true"
    >
      <template #item="{ element }">
        <div
          class="group relative flex aspect-square cursor-move items-center gap-2 rounded border border-bc"
          @click.stop
        >
          <button
            class="absolute right-0 top-0 m-2 rounded bg-bg text-2xl text-fg opacity-0 hover:text-f group-hover:opacity-100"
            @click="model.splice(model.indexOf(element), 1)"
          >
            <Icon icon="gg:close-o"></Icon>
          </button>
          <button
            class="absolute bottom-0 left-0 m-2 rounded bg-bg text-2xl text-fg opacity-0 hover:text-f group-hover:opacity-100"
            @click="editing = element"
          >
            <Icon icon="mingcute:edit-fill"></Icon>
          </button>
          <img
            loading="lazy"
            :src="`https://cathie.twic.pics/${element.replace(/^\//, '')}?twic=v1/cover=200x200`"
            class="h-full w-full object-cover"
          />
        </div>
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
