<template>
  <div class="markdown">
    <EditStatusbar />
    <div class="h-full p-8">
      <textarea
        class="h-full w-[50rem] max-w-full rounded-md bg-bg1 p-4 font-mono focus:bg-bg2 focus:outline-none"
        @keydown.meta.s.prevent="save"
        @keydown.meta.r.prevent="refresh"
        v-model="data.data"
        v-if="data.data"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
const model = ref("Model");
const { data, loading, refresh, save } = useDataModel();
</script>
