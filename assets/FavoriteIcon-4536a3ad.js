import { aE as defineNuxtComponent, as as _export_sfc, aK as FontAwesomeIcon, au as resolveComponent, ax as openBlock, av as createBlock, aS as normalizeClass, __tla as __tla_0 } from "./vendor-bd688624.js";
let FavoriteIcon;
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
      isActive: {
        type: Boolean,
        default: false
      },
      colorLine: {
        type: String,
        default: null
      },
      colorClass: {
        type: String,
        default: "text-white"
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return openBlock(), createBlock(_component_FontAwesomeIcon, {
      icon: [
        _ctx.isActive ? "fas" : "far",
        "star"
      ],
      class: normalizeClass([
        !_ctx.isActive && !_ctx.colorLine && "tw-text-amber-500",
        _ctx.isActive && "tw-text-amber-500"
      ]),
      color: !_ctx.isActive && _ctx.colorLine,
      size: "sm"
    }, null, 8, [
      "icon",
      "class",
      "color"
    ]);
  }
  _sfc_main.__file = "components/UI/FavoriteIcon.vue";
  FavoriteIcon = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/FavoriteIcon.vue"
    ]
  ]);
});
export {
  FavoriteIcon as F,
  __tla
};
