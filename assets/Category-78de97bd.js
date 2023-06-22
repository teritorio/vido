import { aE as defineNuxtComponent, aK as FontAwesomeIcon, as as _export_sfc, au as resolveComponent, ax as openBlock, av as createBlock, b5 as createSlots, aw as withCtx, ay as createElementBlock, aS as normalizeClass, aB as createVNode, aH as createTextVNode, aI as toDisplayString, aJ as createCommentVNode, aT as withModifiers, __tla as __tla_0 } from "./vendor-cc850437.js";
import { M as MenuItem, __tla as __tla_1 } from "./Item-170a2cac.js";
import { c as filterValuesIsSet } from "./types-filters-1e0221da.js";
let Category;
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
  const Category_vue_vue_type_style_index_0_scoped_cca7609a_lang = "";
  const _sfc_main = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      MenuItem
    },
    props: {
      category: {
        type: Object,
        required: true
      },
      filters: {
        type: Array,
        default: null
      },
      selected: {
        type: Boolean,
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
    computed: {
      isFiltered() {
        return this.filters && filterValuesIsSet(this.filters);
      }
    },
    emits: {
      click: (category_id) => true,
      "filter-click": (category_id) => true
    },
    methods: {
      onClick() {
        this.$tracking({
          type: "category_event",
          event: "enable",
          categoryId: this.category.id,
          title: this.category.category.name.fr
        });
        this.$emit("click", this.category.id);
      },
      onFilterClick() {
        this.$tracking({
          type: "category_event",
          event: "filter",
          categoryId: this.category.id,
          title: this.category.category.name.fr
        });
        this.$emit("filter-click", this.category.id);
      }
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_MenuItem = resolveComponent("MenuItem");
    return openBlock(), createBlock(_component_MenuItem, {
      id: `MenuItem-${_ctx.category.id}`,
      href: `/${_ctx.category.id}`,
      "display-mode": _ctx.category.category.display_mode || _ctx.displayModeDefault,
      "color-fill": _ctx.category.category.color_fill,
      icon: _ctx.category.category.icon,
      size: _ctx.size,
      name: _ctx.category.category.name,
      "badge-class": "tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white",
      onClick: withModifiers(_ctx.onClick, [
        "prevent"
      ])
    }, createSlots({
      "end-line-large": withCtx(() => [
        !_ctx.selected ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
          key: 0,
          class: "tw-text-zinc-300",
          icon: [
            "far",
            "circle"
          ],
          size: _ctx.size
        }, null, 8, [
          "size"
        ])) : (openBlock(), createBlock(_component_FontAwesomeIcon, {
          key: 1,
          class: "tw-text-emerald-500",
          icon: "check-circle",
          size: _ctx.size
        }, null, 8, [
          "size"
        ]))
      ]),
      more: withCtx(() => [
        Object.keys(_ctx.category.category && _ctx.category.category.filters || []).length > 0 && _ctx.selected ? (openBlock(), createElementBlock("button", {
          key: 0,
          type: "button",
          class: normalizeClass([
            "tw-w-full tw-h-12 sm:tw-h-8 tw-text-left tw-rounded-lg tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100",
            _ctx.isFiltered && "tw-text-emerald-500",
            !_ctx.isFiltered && "tw-text-zinc-500"
          ]),
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onFilterClick && _ctx.onFilterClick(...args))
        }, [
          createVNode(_component_FontAwesomeIcon, {
            icon: "filter",
            size: "sm",
            class: "tw-ml-16"
          }),
          createTextVNode(" " + toDisplayString(_ctx.isFiltered ? _ctx.$t("headerMenu.editFilters") : _ctx.$t("headerMenu.filter")), 1)
        ], 2)) : createCommentVNode("v-if", true)
      ]),
      _: 2
    }, [
      _ctx.category.category.display_mode === "compact" ? {
        name: "badge",
        fn: withCtx(() => [
          !_ctx.selected ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
            key: 0,
            class: "tw-text-zinc-300",
            icon: [
              "far",
              "circle"
            ],
            size: _ctx.size
          }, null, 8, [
            "size"
          ])) : (openBlock(), createBlock(_component_FontAwesomeIcon, {
            key: 1,
            class: "tw-text-emerald-500",
            icon: "check-circle",
            size: _ctx.size
          }, null, 8, [
            "size"
          ]))
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
      "onClick"
    ]);
  }
  _sfc_main.__file = "components/Menu/Category.vue";
  Category = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-cca7609a"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Category.vue"
    ]
  ]);
});
export {
  Category as C,
  __tla
};
