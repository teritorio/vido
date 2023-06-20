import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, av as createBlock, b3 as createSlots, aw as withCtx, aB as createVNode, __tla as __tla_0 } from "./vendor-bd688624.js";
import { M as MenuItem, __tla as __tla_1 } from "./Item-6d2342df.js";
let Link;
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
      FontAwesomeIcon,
      MenuItem
    },
    props: {
      menuLink: {
        type: Object,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      displayModeDefault: {
        type: String,
        required: true
      }
    },
    emits: {
      click: (menuLinkId) => true
    },
    methods: {
      onClick() {
        this.$tracking({
          type: "external_link",
          url: this.menuLink.link.href,
          title: this.menuLink.link.name.fr
        });
        this.$emit("click", this.menuLink.id);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_MenuItem = resolveComponent("MenuItem");
    return openBlock(), createBlock(_component_MenuItem, {
      id: `MenuLink-${_ctx.menuLink.id}`,
      href: _ctx.menuLink.link.href,
      "display-mode": _ctx.menuLink.link.display_mode || _ctx.displayModeDefault,
      "color-fill": _ctx.menuLink.link.color_fill,
      icon: _ctx.menuLink.link.icon,
      size: _ctx.size,
      name: _ctx.menuLink.link.name,
      "badge-class": [
        "tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-2 tw-border-white",
        _ctx.size === "2xl" ? "tw-w-6 tw-h-6" : "tw-w-5 tw-h-5"
      ].join(" "),
      onClick: _ctx.onClick
    }, createSlots({
      "end-line-large": withCtx(() => [
        createVNode(_component_FontAwesomeIcon, {
          icon: "external-link-alt"
        })
      ]),
      _: 2
    }, [
      _ctx.menuLink.link.display_mode === "compact" ? {
        name: "badge",
        fn: withCtx(() => [
          createVNode(_component_FontAwesomeIcon, {
            icon: "external-link-alt",
            size: "sm"
          })
        ]),
        key: "0"
      } : void 0
    ]), 1032, [
      "id",
      "href",
      "display-mode",
      "color-fill",
      "icon",
      "size",
      "name",
      "badge-class",
      "onClick"
    ]);
  }
  _sfc_main.__file = "components/Menu/Link.vue";
  Link = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Link.vue"
    ]
  ]);
});
export {
  Link as L,
  __tla
};
