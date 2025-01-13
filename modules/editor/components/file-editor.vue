<template>
  <div
    class="fixed left-0 top-0 z-[99] flex h-full w-full flex-row gap-8 bg-bg p-4 text-fg"
    ref="el"
    v-globalkeys="{
      's.meta': save,
      Escape: () => {
        model = '';
      },
      ArrowLeft: prev,
      ArrowRight: next,
    }"
  >
    <div class="relative flex grow border border-solid border-bg1">
      <div
        v-if="bucketfile?.type === 'image'"
        class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center overflow-hidden"
      >
        <picture
          class="pointer-events-none h-full w-full object-contain"
          :key="bucketfile.Key"
        >
          <img
            loading="lazy"
            :src="`//wsrv.nl/?url=cathie.lon1.digitaloceanspaces.com/${bucketfile.Key.replace(
              /^\//,
              '',
            )}?w=2000&h=2000&fit=contain`"
            class="absolute h-full w-full object-contain"
          />
        </picture>
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
    <!-- right frame -->
    <div class="w-96 shrink-0 pr-4">
      <!-- buttons -->
      <div class="mb-4 flex gap-1">
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 text-sm"
          @click="save"
          :class="changed ? 'bg-fg text-bg2 hover:bg-f' : 'text-fg2'"
        >
          save
        </button>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 text-sm text-fg2 hover:bg-bg2 hover:text-fg"
          @click="resetData()"
        >
          undo
        </button>
        <div class="grow"></div>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 leading-[0] text-fg hover:bg-bg2"
        >
          <Icon name="tabler:arrow-left" @click="emits('prev')"></Icon>
        </button>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 leading-[0] text-fg hover:bg-bg2"
          @click="emits('next')"
        >
          <Icon name="tabler:arrow-right"></Icon>
        </button>
        <button
          class="rounded border border-solid border-bg1 p-1 px-3 leading-[0] text-fg hover:bg-bg2"
          @click="model = ''"
        >
          <Icon name="ic:baseline-close"></Icon>
        </button>
      </div>

      <EditField
        v-for="(item, key) in config._media_metadata.fields"
        v-if="config?._media_metadata?.fields"
        :config="[key, item]"
        v-model="datamodel"
        :path="[key]"
        class="mb-4"
      ></EditField>

      <!-- name / link -->
      <div class="mb-8">
        <NuxtLink
          :to="`https://cathie.lon1.digitaloceanspaces.com/${model}`"
          target="_blank"
          class="break-all text-xs"
          >{{ model }}</NuxtLink
        >
        <div class="text-xs">
          {{ bucketfile.hrsize }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import cloneDeep from "lodash/cloneDeep";
import bucketfiles from "@/data/bucketfiles.json";
const { config, configStatus, saveMetadata, getMetadata } = useDataModel();
const emits = defineEmits(["next", "prev"]);
const model = defineModel<string>();
const bucketfile = ref({});
const el = ref(null);
let originalDatamodel = ref("");

function prev() {
  if (
    !!document.activeElement &&
    !!document.activeElement.nodeName.match("INPUT|TEXTAREA")
  )
    return;
  emits("prev");
}
function next() {
  if (
    !!document.activeElement &&
    !!document.activeElement.nodeName.match("INPUT|TEXTAREA")
  )
    return;
  emits("next");
}

async function save() {
  if (!model.value) return;
  await saveMetadata({ path: model.value, data: datamodel.value });
  resetData();
}

const datamodel = ref<any>({});
watch(model, resetData);
async function resetData() {
  const d = await getMetadata(model.value);
  for (let i in config.value._media_metadata.fields) {
    // fill datamodel with field
    datamodel.value[i] = d && i in d ? d[i] : "";
  }
  originalDatamodel.value = JSON.stringify(cloneDeep(datamodel.value));
  // populate bucketfile
  const bf = bucketfiles.find((x) => x.Key === model.value);
  if (bf) {
    bucketfile.value = bf;
  }
}

const changed = computed(() => {
  if (!datamodel.value || !originalDatamodel) return false;
  return JSON.stringify(datamodel.value) !== originalDatamodel.value;
});
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
