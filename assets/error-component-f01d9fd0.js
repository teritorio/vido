import { as as _export_sfc, ax as openBlock, av as createBlock, aC as normalizeProps, aD as guardReactiveProps, S as defineAsyncComponent, _ as __vitePreload, __tla as __tla_0 } from "./vendor-cc850437.js";
let nuxtErrorPage;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = {
    __name: "nuxt-error-page",
    props: {
      error: Object
    },
    setup(__props, { expose }) {
      expose();
      const { error } = __props;
      const stacktrace = (error.stack || "").split("\n").splice(1).map((line) => {
        const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
        return {
          text,
          internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
        };
      }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
      const statusCode = Number(error.statusCode || 500);
      const is404 = statusCode === 404;
      const statusMessage = error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
      const description = error.message || error.toString();
      const stack = !is404 ? error.description || `<pre>${stacktrace}</pre>` : void 0;
      const _Error404 = defineAsyncComponent(() => __vitePreload(() => import("./vendor-cc850437.js").then(async (m) => {
        await m.__tla;
        return m;
      }).then((n) => n.cQ), true ? [] : void 0).then((r) => r.default || r));
      const _Error = defineAsyncComponent(() => __vitePreload(() => import("./vendor-cc850437.js").then(async (m) => {
        await m.__tla;
        return m;
      }).then((n) => n.cR), true ? [] : void 0).then((r) => r.default || r));
      const ErrorTemplate = is404 ? _Error404 : _Error;
      const __returned__ = {
        stacktrace,
        statusCode,
        is404,
        statusMessage,
        description,
        stack,
        _Error404,
        _Error,
        ErrorTemplate,
        defineAsyncComponent
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock($setup["ErrorTemplate"], normalizeProps(guardReactiveProps({
      statusCode: $setup.statusCode,
      statusMessage: $setup.statusMessage,
      description: $setup.description,
      stack: $setup.stack
    })), null, 16);
  }
  nuxtErrorPage = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/node_modules/nuxt/dist/app/components/nuxt-error-page.vue"
    ]
  ]);
});
export {
  __tla,
  nuxtErrorPage as default
};
