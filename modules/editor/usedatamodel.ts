const data = ref({});
const originalData = ref({});
const loading = ref(false);
const saving = ref(false);
const config = ref({});
const configLoading = ref(false);

function refresh() {
  const route = useRoute();
  loading.value = true;
  fetch(`/api/get?path=${route.params.path.join("/")}`)
    .then((res) => res.json())
    .then((res) => {
      data.value = res;
      originalData.value = JSON.stringify(res);
      loading.value = false;
    });
}

function refreshConfig() {
  configLoading.value = true;
  fetch(`/api/config`)
    .then((res) => res.json())
    .then((res) => {
      config.value = res;
      configLoading.value = false;
    });
}

async function save() {
  const route = useRoute();
  fetch(`/api/save`, {
    method: "POST",
    body: JSON.stringify({
      data: data.value.data,
      path: route.params.path.join("/"),
    }),
  })
    .then(() => {
      // todo: message
      // alert("saved");
      refresh();
    })
    .catch((err) => {
      alert("error!");
      console.warn(err);
    });
}

export const useDataModel = () => {
  const route = useRoute();
  watch(() => route.path, refresh);
  refresh();
  refreshConfig();
  return {
    data,
    originalData,
    loading,
    refresh,
    save,
    refreshConfig,
    config,
    configLoading,
    saving,
  };
};
