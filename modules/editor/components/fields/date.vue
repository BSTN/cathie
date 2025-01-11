<template>
  <div>
    <input
      type="text"
      class="w-[32rem] max-w-full rounded bg-bg1 px-4 py-2 placeholder-fg2 focus:bg-bg2 focus:outline-none"
      v-model="model"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel();
</script>
