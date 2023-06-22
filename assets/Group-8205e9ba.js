import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, av as createBlock, b5 as createSlots, aw as withCtx, aH as createTextVNode, aI as toDisplayString, aB as createVNode, aT as withModifiers, __tla as __tla_0 } from "./vendor-cc850437.js";
import { M as MenuItem, __tla as __tla_1 } from "./Item-170a2cac.js";
let Group;
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
      menuGroup: {
        type: Object,
        required: true
      },
      categoriesActivesCount: {
        type: Number,
        default: 0
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
      click: (menuGroupId) => true
    },
    methods: {
      onClick() {
        this.$tracking({
          type: "menu",
          menuItemId: this.menuGroup.id,
          title: this.menuGroup.menu_group.name.fr
        });
        this.$emit("click", this.menuGroup.id);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_MenuItem = resolveComponent("MenuItem");
    return openBlock(), createBlock(_component_MenuItem, {
      id: `MenuGroup-${_ctx.menuGroup.id}`,
      href: `/${_ctx.menuGroup.id}/`,
      "display-mode": _ctx.menuGroup.menu_group.display_mode || _ctx.displayModeDefault,
      "color-fill": _ctx.menuGroup.menu_group.color_fill,
      icon: _ctx.menuGroup.menu_group.icon,
      size: _ctx.size,
      name: _ctx.menuGroup.menu_group.name,
      "badge-class": [
        "tw-bg-red-600 tw-text-white tw-rounded-full tw-border-2 tw-border-white",
        _ctx.size === "2xl" ? "tw-w-6 tw-h-6" : "tw-w-5 tw-h-5"
      ].join(" "),
      onClick: withModifiers(_ctx.onClick, [
        "prevent"
      ])
    }, createSlots({
      "end-line-large": withCtx(() => [
        createVNode(_component_FontAwesomeIcon, {
          icon: "chevron-right"
        })
      ]),
      _: 2
    }, [
      _ctx.categoriesActivesCount > 0 ? {
        name: "badge",
        fn: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.categoriesActivesCount), 1)
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
  _sfc_main.__file = "components/Menu/Group.vue";
  Group = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Group.vue"
    ]
  ]);
});
export {
  Group as G,
  __tla
};
