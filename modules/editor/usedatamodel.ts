import cloneDeep from "lodash/cloneDeep";
const saving = ref(false);
const data = ref<{ data: any; timestamp: string }>({ data: {}, timestamp: "" });
const status = ref("loading");
const config = ref({});
const configStatus = ref("loading");
let dataOriginal = {};
let url = "";
let configLoaded = false;
async function refresh(donotforce?: boolean) {
  const route = useRoute();
  const newurl = `/api/get?path=${route.params.path.join("/")}`;
  if (newurl === url && donotforce) {
    return;
  }
  url = newurl;
  status.value = "pending";
  await $fetch(`/api/get?path=${route.params.path.join("/")}`)
    .then((res) => {
      data.value = res;
      dataOriginal = JSON.stringify(res);
      status.value = "success";
    })
    .catch((err) => {
      status.value = "error";
      console.warn(err);
    });
}

async function refreshConfig(donotforce?: boolean) {
  if (configLoaded && donotforce) return;
  configLoaded = true;
  configStatus.value = "pending";

  await $fetch("/api/config")
    .then((res) => {
      config.value = res;
      configStatus.value = "success";
    })
    .catch((err) => {
      configStatus.value = "error";
    });
}

// save
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

async function saveMetadata(metadata: { path: string; data: any }) {
  const route = useRoute();
  fetch(`/api/save-metadata`, {
    method: "POST",
    body: JSON.stringify(metadata),
  })
    .then(() => {
      // todo: message
      // alert("saved");
      // refresh();
    })
    .catch((err) => {
      alert("error!");
      console.warn(err);
    });
}

async function getMetadata(path: string) {
  return await fetch(`/api/get-metadata`, {
    method: "POST",
    body: JSON.stringify({ path }),
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => {
      alert("error!");
      console.warn(err);
    });
}

const changed = computed(() => {
  if (!data?.value || !dataOriginal) return false;
  return JSON.stringify(data.value) !== dataOriginal;
});

export const useDataModel = () => {
  const route = useRoute();

  // get data
  refresh(true);
  refreshConfig(true);

  // watch path change
  watch(() => route.path, refresh);

  return {
    data,
    status,
    changed,
    refresh,
    config,
    configStatus,
    refreshConfig,
    save,
    saving,
    saveMetadata,
    getMetadata,
  };
};
