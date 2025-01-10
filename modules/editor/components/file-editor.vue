<template>
  <div class="fixed z-50 h-full w-full bg-bg p-4">
    {{ model }}
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";
const model = defineModel();
onKeyStroke("Escape", () => {
  model.value = "";
});
</script>

<style lang="less" scoped></style>
