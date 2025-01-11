<template>
  <div
    class="sticky top-0 flex w-full items-center gap-4 border-b border-solid border-bc bg-bg px-8 py-3 text-sm"
  >
    <button
      class="rounded border border-bc px-6 py-2"
      @click="save"
      :class="[
        changed
          ? 'border-fg bg-fg text-bg hover:border-f hover:bg-f'
          : 'text-fg2',
      ]"
    >
      Save
    </button>
    <button
      class="rounded border border-bc px-6 py-2"
      @click="refresh"
      :class="[changed ? 'text-fg hover:bg-bg1' : 'text-fg2']"
    >
      Undo
    </button>
    <transition name="fade"
      ><div class="" v-if="loading">
        <Icon icon="eos-icons:three-dots-loading"></Icon></div
    ></transition>
    <transition name="fade"
      ><div class="" v-if="saving">saving...</div></transition
    >
    <div class="grow"></div>
    <div class="text-xs text-fg2" v-if="data.timestamp">
      {{ useTimeAgo(data.timestamp) }}
    </div>
    <div class="">{{ $route.params.path.join("/") }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useTimeAgo, onKeyStroke } from "@vueuse/core";
const { data, originalData, loading, refresh, save, saving } = useDataModel();
onKeyStroke("s", (ev) => {
  if (ev.metaKey) {
    ev.preventDefault();
    save();
  }
});
const changed = computed(() => {
  return JSON.stringify(data.value) !== originalData.value;
});
</script>

<style lang="less" scoped></style>
