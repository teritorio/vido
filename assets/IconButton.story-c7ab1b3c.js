import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aF as renderSlot, av as createBlock, aw as withCtx, b7 as NuxtLink, at as defineComponent, au as resolveComponent, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, aH as createTextVNode, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
let IconButton_story;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main$1 = defineNuxtComponent({
    props: {
      label: {
        type: String,
        required: true
      },
      href: {
        type: String,
        default: void 0
      },
      target: {
        type: String,
        default: void 0
      }
    }
  });
  const _hoisted_1 = [
    "aria-label"
  ];
  const _hoisted_2 = [
    "aria-label",
    "href",
    "target"
  ];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NuxtLink = NuxtLink;
    return !_ctx.href ? (openBlock(), createElementBlock("button", {
      key: 0,
      "aria-label": _ctx.label,
      type: "button",
      class: "tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 8, _hoisted_1)) : !_ctx.href.startsWith("http://") && !_ctx.href.startsWith("https://") ? (openBlock(), createBlock(_component_NuxtLink, {
      key: 1,
      "aria-label": _ctx.label,
      to: _ctx.href,
      target: _ctx.target,
      class: "tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center"
    }, {
      default: withCtx(() => [
        renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 8, [
      "aria-label",
      "to",
      "target"
    ])) : (openBlock(), createElementBlock("a", {
      key: 2,
      "aria-label": _ctx.label,
      href: _ctx.href,
      target: _ctx.target,
      class: "tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 8, _hoisted_2));
  }
  _sfc_main$1.__file = "components/UI/IconButton.vue";
  const IconButton = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/IconButton.vue"
    ]
  ]);
  const _sfc_main = defineComponent({
    __name: "IconButton.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        label: "Plop"
      };
      const props = {
        DefaultButton: {
          ...defaultProps
        },
        DefaultLink: {
          ...defaultProps,
          href: "https://www.teritorio.fr/"
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        IconButton
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Variant = resolveComponent("Variant");
    const _component_Story = resolveComponent("Story");
    return openBlock(), createBlock(_component_Story, {
      title: "UI/IconButton"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["IconButton"], normalizeProps(guardReactiveProps(p)), {
                default: withCtx(() => [
                  createTextVNode("ABC")
                ]),
                _: 2
              }, 1040)
            ]),
            _: 2
          }, 1032, [
            "title"
          ]);
        }), 64))
      ]),
      _: 1
    });
  }
  _sfc_main.__file = "components/UI/IconButton.story.vue";
  IconButton_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/IconButton.story.vue"
    ]
  ]);
});
export {
  __tla,
  IconButton_story as default
};
