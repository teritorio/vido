import { _ as _export_sfc, __tla as __tla_0 } from "./MobileOverlay.vue2-0b166fe0.js";
import { o as openBlock, e as createElementBlock, Z as renderSlot, __tla as __tla_1 } from "./vendor-bd688624.js";
let BaseEmpty;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = {};
  const _hoisted_1 = {
    class: "histoire-base-empty htw-base-empty htw-flex htw-flex-col htw-items-center htw-justify-center htw-space-y-4 htw-py-12 htw-h-full htw-text-center htw-text-gray-400 htw-text-lg"
  };
  function _sfc_render(_ctx, _cache) {
    return openBlock(), createElementBlock("div", _hoisted_1, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  BaseEmpty = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-c5ecfead"
    ]
  ]);
});
export {
  BaseEmpty as B,
  __tla
};
