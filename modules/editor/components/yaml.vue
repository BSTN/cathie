<template>
  <div>
    <EditStatusbar />
    <div class="px-8 py-8" v-if="data?.data && configModel">
      <EditField
        v-for="(item, key) in configModel"
        :config="[key, item]"
        v-model="data.data"
        :path="[key]"
        class="mb-4"
      ></EditField>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { data, config, configStatus } = useDataModel();

const configModel = computed(() => {
  if (configStatus.value !== "success" || !config.value) return false;
  if (route.params.path.length === 1) {
    return config.value[route.params.path[0]];
  } else if (route.params.path.length === 2) {
    return config.value[route.params.path[0]].fields;
  } else {
    return false;
  }
});
</script>
