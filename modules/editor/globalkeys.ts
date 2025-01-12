import { onKeyStroke } from "@vueuse/core";

const keys: {
  depth: number;
  el: HTMLElement;
  key: string;
  k: string;
  meta: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  callback: () => void;
}[] = [];

onKeyStroke((ev) => {
  keys.sort((a, b) => b.depth - a.depth);
  for (let i in keys) {
    const x = keys[i];
    if (
      ev.key == x.key &&
      x.meta == ev.metaKey &&
      x.ctrl == ev.ctrlKey &&
      x.alt == ev.altKey &&
      x.shift == ev.shiftKey
    ) {
      ev.preventDefault();
      x.callback();
      break;
    }
  }
});

function getElementDepth(el: HTMLElement) {
  let depth = 0;
  while (el.parentNode) {
    depth++;
    el = el.parentNode;
  }
  return depth;
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("globalkeys", {
    mounted(el, binding, vnode) {
      Object.keys(binding.value).forEach((k) => {
        const callback = binding.value[k];
        const modifiers = k.split(".");
        const key = modifiers.filter(
          (x) => !["meta", "ctrl", "shift"].includes(x),
        )[0];
        const meta = modifiers.includes("meta");
        const ctrl = modifiers.includes("ctrl");
        const alt = modifiers.includes("alt");
        const shift = modifiers.includes("shift");
        keys.push({
          el: el,
          depth: getElementDepth(el),
          k,
          key,
          meta,
          ctrl,
          alt,
          shift,
          callback,
        });
      });
    },
    beforeUnmount(el, binding, vnode) {
      Object.keys(binding.value).forEach((k) => {
        const index = keys.findIndex((x) => x.el === el && x.k === k);
        if (index > -1) {
          keys.splice(index, 1);
        }
      });
    },
  });
});
