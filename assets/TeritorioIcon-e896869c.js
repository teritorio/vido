import { aE as defineNuxtComponent, as as _export_sfc, aK as FontAwesomeIcon, au as resolveComponent, ax as openBlock, ay as createElementBlock, aS as normalizeClass, b4 as normalizeStyle, av as createBlock, aJ as createCommentVNode, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
let TeritorioIcon;
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
      colorText: {
        type: String,
        default: "#ffffff"
      },
      picto: {
        type: String,
        required: true
      },
      useNativeAlignment: {
        type: Boolean,
        default: null
      },
      image: {
        type: String,
        default: null
      }
    }
  });
  const _hoisted_1 = [
    "src"
  ];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return !Boolean(_ctx.image) && _ctx.picto.startsWith("teritorio") ? (openBlock(), createElementBlock("i", {
      key: 0,
      class: normalizeClass([
        _ctx.picto,
        !_ctx.useNativeAlignment && "tw-flex tw-items-center tw-justify-center"
      ]),
      style: normalizeStyle({
        color: _ctx.colorText
      })
    }, null, 6)) : !Boolean(_ctx.image) ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
      key: 1,
      icon: _ctx.picto,
      color: _ctx.colorText
    }, null, 8, [
      "icon",
      "color"
    ])) : Boolean(_ctx.image) ? (openBlock(), createElementBlock("img", {
      key: 2,
      class: "tw-rounded-full",
      src: _ctx.image
    }, null, 8, _hoisted_1)) : createCommentVNode("v-if", true);
  }
  _sfc_main.__file = "components/UI/TeritorioIcon.vue";
  TeritorioIcon = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/TeritorioIcon.vue"
    ]
  ]);
});
export {
  TeritorioIcon as T,
  __tla
};
