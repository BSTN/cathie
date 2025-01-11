<template>
  <div class="rounded-md bg-bg1 p-2" v-if="Array.isArray(model)">
    <transition name="fade">
      <EditFileEditor
        v-model="editing"
        v-if="editing"
        @next="openNext"
        @prev="openPrev"
      ></EditFileEditor>
    </transition>
    <draggable
      v-model="model"
      item-key="element"
      class="grid grid-cols-12 gap-2"
    >
      <template #item="{ element }">
        <div
          class="group relative flex aspect-square cursor-move items-center gap-2 rounded border border-bc"
        >
          <button
            class="absolute right-0 top-0 m-2 rounded bg-bg text-2xl text-fg opacity-0 hover:text-f group-hover:opacity-100"
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
function openNext() {
  const nowindex = model.value.findIndex((x) => x === editing.value);
  editing.value =
    model.value[nowindex + 1] || model.value[model.value.length - 1];
}
function openPrev() {
  const nowindex = model.value.findIndex((x) => x === editing.value);
  editing.value = model.value[nowindex - 1] || model.value[0];
}
</script>
<style scoped>
.sortable-ghost {
  opacity: 0.1;
}
</style>
