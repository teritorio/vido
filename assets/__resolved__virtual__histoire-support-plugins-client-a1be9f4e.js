import { N as createRouter, _ as __vitePreload, O as createWebHistory, P as createWebHashHistory, Q as useDark, R as useToggle, k as watch, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { h as histoireConfig } from "./config-23d2cc81.js";
let base, clientSupportPlugins, isDark, router, toggleDark;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  base = "/";
  function createRouterHistory() {
    switch (histoireConfig.routerMode) {
      case "hash":
        return createWebHashHistory(base);
      case "history":
      default:
        return createWebHistory(base);
    }
  }
  router = createRouter({
    history: createRouterHistory(),
    routes: [
      {
        path: "/",
        name: "home",
        component: () => __vitePreload(() => import("./HomeView.vue-5f9bddc1.js").then(async (m) => {
          await m.__tla;
          return m;
        }), true ? ["assets/HomeView.vue-5f9bddc1.js","assets/config-23d2cc81.js","assets/vendor-c1ea6bed.js"] : void 0)
      },
      {
        path: "/story/:storyId",
        name: "story",
        component: () => __vitePreload(() => import("./StoryView.vue-4cb8c034.js").then(async (m) => {
          await m.__tla;
          return m;
        }), true ? ["assets/StoryView.vue-4cb8c034.js","assets/vendor-c1ea6bed.js","assets/MobileOverlay.vue2-4d622a4f.js","assets/BaseEmpty.vue-fa736f79.js","assets/state-23d0b31f.js","assets/config-23d2cc81.js"] : void 0)
      }
    ]
  });
  isDark = useDark({
    valueDark: "htw-dark",
    initialValue: histoireConfig.theme.defaultColorScheme,
    storageKey: "histoire-color-scheme",
    storage: histoireConfig.theme.storeColorScheme ? localStorage : sessionStorage
  });
  toggleDark = useToggle(isDark);
  function applyDarkToControls() {
    var _a;
    (_a = window.__hst_controls_dark) == null ? void 0 : _a.forEach((ref) => {
      ref.value = isDark.value;
    });
  }
  watch(isDark, () => {
    applyDarkToControls();
  }, {
    immediate: true
  });
  window.__hst_controls_dark_ready = () => {
    applyDarkToControls();
  };
  clientSupportPlugins = {
    "vanilla": () => __vitePreload(() => import("./vendor-c1ea6bed.js").then(async (m) => {
      await m.__tla;
      return m;
    }).then((n) => n.cM), true ? [] : void 0),
    "vue3": () => __vitePreload(() => import("./vendor-c1ea6bed.js").then(async (m) => {
      await m.__tla;
      return m;
    }).then((n) => n.cN), true ? [] : void 0)
  };
});
export {
  __tla,
  base as b,
  clientSupportPlugins as c,
  isDark as i,
  router as r,
  toggleDark as t
};
