import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aA as Fragment, az as renderList, av as createBlock, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let Stars;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      stars: {
        type: Number,
        required: true
      }
    }
  });
  const _hoisted_1 = {
    class: "stars-data tw-text-amber-500 tw-mb-1"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(new Array(_ctx.stars), (index) => {
        return openBlock(), createBlock(_component_FontAwesomeIcon, {
          key: index,
          icon: "star"
        });
      }), 128))
    ]);
  }
  _sfc_main.__file = "components/Fields/Stars.vue";
  Stars = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Stars.vue"
    ]
  ]);
});
export {
  Stars as S,
  __tla
};
