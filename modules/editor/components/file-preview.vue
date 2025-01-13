<template>
  <div
    class="group relative aspect-square cursor-pointer select-none overflow-hidden text-fg"
    ref="el"
  >
    <div :class="{ invisible: !isVisible }">
      <!-- preview/icon -->
      <div v-if="props.file.type === 'image'">
        <picture class="pointer-events-none h-full w-full object-cover">
          <img
            loading="lazy"
            :src="`//wsrv.nl/?url=cathie.lon1.digitaloceanspaces.com/${props.file.Key.replace(
              /^\//,
              '',
            )}&w=300&h=300&fit=cover`"
          />
          <img
            :srcset="`//wsrv.nl/?url=cathie.lon1.digitaloceanspaces.com/${props.file.Key.replace(
              /^\//,
              '',
            )}&w=8&h=8&fit=cover`"
            type="image/jpeg"
            class="h-full w-full object-cover blur-md"
          />
        </picture>
      </div>
      <div v-else-if="props.file.type === 'video'">
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-6xl text-fg2"
        >
          <Icon name="lets-icons:video-fill"></Icon>
        </div>
      </div>
      <div v-else-if="props.file.type === 'pdf'">
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-6xl text-fg2"
        >
          <Icon name="bxs:file-pdf"></Icon>
          <div
            class="absolute bottom-0 w-full whitespace-break-spaces break-all p-2 text-xs text-fg2"
          >
            {{ props.file.Key.split("/").pop() }}
          </div>
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
