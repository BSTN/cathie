<template>
  <div class="">
    <button @click="transform()" class="rounded bg-bg1 p-2">Transform</button>
    {{ model }}
  </div>
</template>
<script lang="ts" setup>
const model = defineModel();
function transform() {
  model.value = model.value.map((x) => {
    if (typeof x === "string") {
      return x;
    }
    return x.url;
  });
}
</script>
