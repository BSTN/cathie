<template>
  <div
    class="relative min-h-[12rem] w-[12rem] cursor-pointer rounded border border-bc"
    @click="browse = true"
  >
    <transition name="fade">
      <EditFileBrowser
        mode="select-one"
        @done="setModel"
        v-if="browse"
        @cancel="browse = false"
        @click.stop
      ></EditFileBrowser>
    </transition>
    <img
      class="absolute"
      :src="$img(model, { w: 400, h: 400, fit: 'contain' })"
      loading="lazy"
      v-if="model"
    />
  </div>
</template>

<script lang="ts" setup>
const model = defineModel<string>();
const browse = ref(false);
function setModel(path: Array<string>) {
  model.value = path[0];
  browse.value = false;
  // model.value = path;
}
</script>
