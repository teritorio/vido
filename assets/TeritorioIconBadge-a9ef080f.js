import { aE as defineNuxtComponent, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aB as createVNode, aS as normalizeClass, aF as renderSlot, b4 as normalizeStyle, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { T as TeritorioIcon, __tla as __tla_1 } from "./TeritorioIcon-e896869c.js";
let TeritorioIconBadge;
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
  const _sfc_main = defineNuxtComponent({
    components: {
      TeritorioIcon
    },
    props: {
      colorFill: {
        type: String,
        required: true
      },
      picto: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: "md"
      },
      image: {
        type: String,
        default: null
      }
    },
    computed: {
      iconSize() {
        const values = {
          xs: "xs",
          sm: "md",
          md: "lg",
          lg: "lg",
          xl: "xl",
          "2xl": "2xl"
        };
        return values[this.size || "md"];
      },
      iconDim() {
        const values = {
          xs: "tw-w-4 tw-h-4",
          sm: "tw-w-6 tw-h-6",
          md: "tw-w-8 tw-h-8",
          lg: "tw-w-10 tw-h-10",
          xl: "tw-w-12 tw-h-12",
          "2xl": "tw-w-14 tw-h-14"
        };
        return this.image ? values.xl : values[this.size || "md"];
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TeritorioIcon = resolveComponent("TeritorioIcon");
    return openBlock(), createElementBlock("span", {
      class: normalizeClass([
        "tw-block tw-flex tw-items-center tw-justify-center tw-shrink-0 tw-text-white tw-rounded-full tw-border-2 tw-border-white",
        _ctx.iconDim,
        Boolean(_ctx.image) && "tw-shadow-md"
      ]),
      style: normalizeStyle({
        backgroundColor: _ctx.colorFill
      })
    }, [
      createVNode(_component_TeritorioIcon, {
        class: normalizeClass(`tw-text-${_ctx.iconSize}`),
        picto: _ctx.picto,
        image: _ctx.image
      }, null, 8, [
        "class",
        "picto",
        "image"
      ]),
      renderSlot(_ctx.$slots, "default")
    ], 6);
  }
  _sfc_main.__file = "components/UI/TeritorioIconBadge.vue";
  TeritorioIconBadge = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/TeritorioIconBadge.vue"
    ]
  ]);
});
export {
  TeritorioIconBadge as T,
  __tla
};
