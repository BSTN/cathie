<template>
  <div>
    <label class="text-bold mb-2 block text-sm capitalize text-fg2">{{
      label
    }}</label>
    <component
      :is="componentName"
      v-model="fieldModel"
      :config="config"
      :path="path"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  EditFieldsText,
  EditFieldsDate,
  EditFieldsMarkdown,
  EditFieldsGallery,
} from "#components";
const componentMap = {
  text: EditFieldsText,
  date: EditFieldsDate,
  markdown: EditFieldsMarkdown,
  gallery: EditFieldsGallery,
};
const componentName = computed(() => {
  return componentMap[props.config[1].type] || false;
});
const props = defineProps(["config", "path"]);
const model = defineModel();
const fieldModel = computed({
  get() {
    if (!model.value) return "";
    // depth maximum 3
    if (props.path.length === 1) {
      return model.value[props.path[0]] || "";
    } else if (props.path.length === 2) {
      return model.value[props.path[0]][props.path[1]] || "";
    } else if (props.path.length === 3) {
      return model.value[props.path[0]][props.path[1]][props.path[2]] || "";
    }
  },
  set(value) {
    if (!model.value) return;
    if (props.path.length === 1) {
      model.value[props.path[0]] = value;
    } else if (props.path.length === 2) {
      model.value[props.path[0]][props.path[1]] = value;
    } else if (props.path.length === 3) {
      model.value[props.path[0]][props.path[1]][props.path[2]] = value;
    }
  },
});
const type = computed(() => {
  return props.config[1].type;
});
const label = computed(() => {
  return props.config[1].label;
});
</script>

<style lang="less" scoped></style>
