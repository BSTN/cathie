<template>
  <div
    class="sticky top-0 flex w-full items-center gap-4 border-b border-solid border-bc bg-bg px-8 py-3"
  >
    <button
      class="rounded border border-bg1 px-6 py-2 hover:bg-bg1"
      @click="save"
    >
      Save
    </button>
    <button
      class="rounded border border-bg1 px-6 py-2 hover:bg-bg1"
      @click="refresh"
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
const { data, loading, refresh, save, saving } = useDataModel();
onKeyStroke("s", (ev) => {
  if (ev.metaKey) {
    ev.preventDefault();
    save();
  }
});
</script>

<style lang="less" scoped></style>
