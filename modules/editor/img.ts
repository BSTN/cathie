export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      img: (url: string | undefined, options: any) => {
        if (url === undefined) return;
        const path = url.replace(/^\//, "");
        const params: URLSearchParams = new URLSearchParams();
        for (let i in options) {
          params.append(i, options[i]);
        }
        return `//wsrv.nl/?url=cathie.lon1.digitaloceanspaces.com/${path}&${params.toString()}`;
      },
    },
  };
});
