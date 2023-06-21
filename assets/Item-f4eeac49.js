import { aE as defineNuxtComponent, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, aS as normalizeClass, aB as createVNode, aw as withCtx, aF as renderSlot, aJ as createCommentVNode, aI as toDisplayString, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { T as TeritorioIconBadge, __tla as __tla_1 } from "./TeritorioIconBadge-9e03c463.js";
let MenuItem;
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
      TeritorioIconBadge
    },
    emits: {
      click: (val) => true
    },
    props: {
      id: {
        type: String,
        required: true
      },
      href: {
        type: String,
        required: true
      },
      displayMode: {
        type: String,
        required: true
      },
      colorFill: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      name: {
        type: Object,
        required: true
      },
      badgeClass: {
        type: String,
        default: ""
      }
    }
  });
  const _hoisted_1 = {
    class: "tw-flex tw-flex-col tw-items-start"
  };
  const _hoisted_2 = [
    "id",
    "href"
  ];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TeritorioIconBadge = resolveComponent("TeritorioIconBadge");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      createBaseVNode("a", {
        id: _ctx.id,
        href: _ctx.href,
        target: "_blank",
        class: normalizeClass([
          "tw-flex focus:tw-outline-none tw-outline-none tw-items-center tw-text-center tw-self-stretch tw-justify-start tw-leading-none tw-transition-colors tw-rounded-lg tw-relative hover:tw-bg-zinc-100",
          _ctx.displayMode === "large" ? "tw-px-4 tw-py-2 tw-col-start-1 tw-col-span-4" : "tw-p-4 tw-flex-col"
        ]),
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
      }, [
        createBaseVNode("div", {
          class: normalizeClass([
            "tw-relative tw-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-text-white tw-rounded-full",
            _ctx.displayMode === "compact" && "tw-mb-2"
          ]),
          style: {
            flexShrink: 0
          }
        }, [
          createVNode(_component_TeritorioIconBadge, {
            "color-fill": _ctx.colorFill,
            picto: _ctx.icon,
            size: _ctx.size
          }, {
            default: withCtx(() => [
              _ctx.$slots.badge ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass([
                  "tw-block tw-text-xs tw-font-semibold tw-font-sans tw-text-center tw-absolute",
                  _ctx.size === "2xl" ? "-tw-top-3 -tw-right-3" : "-tw-top-1 -tw-right-1",
                  _ctx.badgeClass
                ])
              }, [
                renderSlot(_ctx.$slots, "badge")
              ], 2)) : createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, [
            "color-fill",
            "picto",
            "size"
          ])
        ], 2),
        createBaseVNode("div", {
          class: normalizeClass([
            _ctx.displayMode === "compact" && "tw-text-xs",
            _ctx.displayMode === "large" && "tw-mx-4 tw-text-left tw-grow tw-w-full"
          ])
        }, toDisplayString(_ctx.name.fr), 3),
        _ctx.displayMode === "large" ? renderSlot(_ctx.$slots, "end-line-large", {
          key: 0,
          class: "tw-text-zinc-700 tw-shrink-0",
          size: "sm"
        }) : createCommentVNode("v-if", true)
      ], 10, _hoisted_2),
      renderSlot(_ctx.$slots, "more")
    ]);
  }
  _sfc_main.__file = "components/Menu/Item.vue";
  MenuItem = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Item.vue"
    ]
  ]);
});
export {
  MenuItem as M,
  __tla
};
