import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { C as Category, __tla as __tla_1 } from "./Category-0f8a4bcf.js";
import { __tla as __tla_2 } from "./Item-3f7eb06b.js";
import { __tla as __tla_3 } from "./TeritorioIconBadge-a9ef080f.js";
import { __tla as __tla_4 } from "./TeritorioIcon-e896869c.js";
import "./types-filters-1e0221da.js";
let Category_story;
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "Category.story",
    setup(__props, { expose }) {
      expose();
      const category = {
        id: 123,
        selected_by_default: false,
        parent_id: null,
        index_order: 1,
        menu_group: void 0,
        link: void 0,
        category: {
          name: {
            fr: "Leisure"
          },
          icon: "teritorio teritorio-bar",
          color_fill: "#284627",
          color_line: "#284627",
          style_class: [],
          style_merge: true,
          display_mode: "large",
          zoom: 14
        }
      };
      const defaultProps = {
        category,
        filters: [],
        selected: false,
        size: "lg",
        displayModeDefault: "large"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        Selected: {
          ...defaultProps,
          selected: true
        },
        DefaultCompact: {
          ...defaultProps,
          category: {
            ...defaultProps.category,
            category: {
              ...defaultProps.category.category,
              display_mode: "compact"
            }
          }
        },
        SelectedCompact: {
          ...defaultProps,
          category: {
            ...defaultProps.category,
            category: {
              ...defaultProps.category.category,
              display_mode: "compact"
            }
          },
          selected: true
        }
      };
      const __returned__ = {
        category,
        defaultProps,
        props,
        Category
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
      title: "Menu/Category"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["Category"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Menu/Category.story.vue";
  Category_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Category.story.vue"
    ]
  ]);
});
export {
  __tla,
  Category_story as default
};
