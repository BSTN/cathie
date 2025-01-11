<template>
  <div>
    <textarea
      class="min-h-[20rem] w-[40rem] max-w-full rounded-md bg-bg1 p-4 focus:bg-bg2 focus:outline-none"
      v-model="model"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
const model = defineModel();
</script>
