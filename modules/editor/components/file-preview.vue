<template>
  <div
    class="group relative aspect-square cursor-pointer overflow-hidden rounded border border-solid border-bg text-fg"
    ref="el"
  >
    <div class="" :class="{ invisible: !isVisible }">
      <!-- preview/icon -->
      <div v-if="props.file.type === 'image'">
        <TwicImg :src="`/${props.file.key}`" alt="file" />
      </div>
      <div v-else-if="props.file.type === 'video'">
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-6xl text-fg2"
        >
          <Icon icon="lets-icons:video-fill"></Icon>
        </div>
      </div>
      <div v-else-if="props.file.type === 'pdf'">
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-6xl text-fg2"
        >
          <Icon icon="bxs:file-pdf"></Icon>
        </div>
      </div>
      <div v-else>
        {{ props.file.key }}
        <div
          class="flexjustify-center absolute bottom-0 left-0 right-0 top-0 items-center text-6xl text-fg2"
        >
          <Icon
            icon="material-symbols:folder"
            class="inline-block h-4 w-4 text-fg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useElementBounding } from "@vueuse/core";
import { useElementVisibility } from "@vueuse/core";
import { Icon } from "@iconify/vue";
const el = ref(null);
// const { top } = useElementBounding(el);
const isVisible = useElementVisibility(el);
const props = defineProps(["file"]);
const extension = computed(() => {
  if (!props.file?.key && typeof props.file.key !== "string") return "";
  return props.file.key.split(".").pop();
});
const basename = computed(() => {
  if (!props.file?.key && typeof props.file.key !== "string") return "";
  return props.file.key.split("/").pop();
});
</script>

<style lang="less" scoped></style>
