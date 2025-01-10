<template>
  <div
    class="group relative aspect-square cursor-pointer overflow-hidden text-fg"
    ref="el"
  >
    <div :class="{ invisible: !isVisible }">
      <!-- preview/icon -->
      <div v-if="props.file.type === 'image'">
        <img
          loading="lazy"
          :src="`https://cathie.twic.pics/${props.file.Key}?twic=v1/cover=200x200`"
          class="h-full w-full object-cover"
        />
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
        {{ props.file.Key }}
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
import { useElementVisibility } from "@vueuse/core";
import { Icon } from "@iconify/vue";
const el = ref(null);
const isVisible = useElementVisibility(el);
const props = defineProps(["file"]);
</script>

<style lang="less" scoped></style>
