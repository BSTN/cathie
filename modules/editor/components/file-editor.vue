<template>
  <div
    class="fixed left-0 top-0 z-[99] flex h-full w-full flex-row gap-8 bg-bg p-4 text-fg"
  >
    <div class="relative flex grow border border-solid border-bg1">
      <div
        v-if="bucketfile?.type === 'image'"
        class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center"
      >
        <img
          loading="lazy"
          :src="`https://cathie.twic.pics/${bucketfile.Key}?twic=v1/contain-max=2000x2000`"
          class="max-h-full max-w-full object-contain"
          :key="bucketfile.Key"
        />
      </div>
      <div
        v-else-if="bucketfile?.type === 'video'"
        class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center"
      >
        <video controls>
          <source
            :src="`https://cathie.lon1.digitaloceanspaces.com/${model}`"
          />
        </video>
      </div>
      <div v-else>{{ bucketfile }}</div>
    </div>
    <div class="w-96 shrink-0 pr-4">
      <!-- buttons -->
      <div class="mb-4 flex gap-1">
        <div class="grow"></div>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 text-fg hover:bg-bg2"
        >
          <Icon icon="tabler:arrow-left" @click="emits('prev')"></Icon>
        </button>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 text-fg hover:bg-bg2"
          @click="emits('next')"
        >
          <Icon icon="tabler:arrow-right"></Icon>
        </button>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 text-fg hover:bg-bg2"
          @click="model = ''"
        >
          <Icon icon="ic:baseline-close"></Icon>
        </button>
      </div>
      <!-- name / link -->
      <div class="mb-8">
        <NuxtLink
          :to="`https://cathie.lon1.digitaloceanspaces.com/${model}`"
          target="_blank"
          >{{ model }}</NuxtLink
        >
        <div class="text-xs">
          {{ bucketfile.hrsize }}
        </div>
      </div>
      <!-- size -->
      <!-- title -->
      <div class="mb-4">
        <input
          type="text"
          class="w-full rounded"
          v-model="datamodel.title"
          placeholder="Title..."
        />
      </div>
      <!-- year -->
      <div class="mb-4">
        <input type="text" placeholder="Year..." v-model="datamodel.year" />
      </div>
      <!-- description -->
      <div class="mb-4">
        <textarea
          type="text"
          class="min-h-96"
          placeholder="Description..."
          v-model="datamodel.description"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import metadata from "@/data/metadata.yml";
import bucketfiles from "@/data/bucketfiles.json";
import { Icon } from "@iconify/vue";
import { onKeyStroke } from "@vueuse/core";
const emits = defineEmits(["next", "prev"]);
const model = defineModel<string>();
const bucketfile = ref({});
onKeyStroke("Escape", () => {
  model.value = "";
});
onKeyStroke("ArrowLeft", () => {
  if (
    !!document.activeElement &&
    !!document.activeElement.nodeName.match("INPUT|TEXTAREA")
  )
    return;
  emits("prev");
});
onKeyStroke("ArrowRight", () => {
  if (
    !!document.activeElement &&
    !!document.activeElement.nodeName.match("INPUT|TEXTAREA")
  )
    return;
  emits("next");
});
const datamodel = ref({ title: "", description: "", year: "" });
watch(model, resetData);
function resetData() {
  const d = metadata.find((x) => x.url === model.value);
  if (d) {
    datamodel.value.title = d.title;
    datamodel.value.description = d.description;
    datamodel.value.year = d.year;
  }
  const bf = bucketfiles.find((x) => x.Key === model.value);
  if (bf) {
    bucketfile.value = bf;
  }
}
onMounted(() => {
  resetData();
});
</script>

<style scoped>
input,
textarea {
  @apply w-full rounded bg-bg1 p-2 px-4 placeholder-fg2 focus:bg-bg2 focus:outline-none;
}
</style>
