import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-fe86adbc.js";
import { I as ItemList, __tla as __tla_1 } from "./ItemList-216e4f5c.js";
import { __tla as __tla_2 } from "./Category-4bca8876.js";
import { __tla as __tla_3 } from "./Item-eeb46123.js";
import { __tla as __tla_4 } from "./TeritorioIconBadge-af4ad1b2.js";
import { __tla as __tla_5 } from "./TeritorioIcon-12504358.js";
import "./types-filters-1e0221da.js";
import { __tla as __tla_6 } from "./Group-0ecaac6d.js";
import { __tla as __tla_7 } from "./Link-0851620b.js";
let ItemList_story;
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
  })(),
  (() => {
    try {
      return __tla_5;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_6;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_7;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "ItemList.story",
    setup(__props, { expose }) {
      expose();
      const menuGroup = {
        id: 1,
        selected_by_default: false,
        parent_id: null,
        index_order: 1,
        menu_group: {
          name: {
            fr: "Leisure & Skiing"
          },
          icon: "teritorio teritorio-hosting",
          color_fill: "#284627",
          color_line: "#284627",
          display_mode: "compact",
          vido_children: []
        },
        link: void 0,
        category: void 0
      };
      const menuLink = {
        id: 2,
        selected_by_default: false,
        parent_id: null,
        index_order: 1,
        menu_group: void 0,
        link: {
          href: "https://example.com",
          name: {
            fr: "Example.com"
          },
          icon: "teritorio teritorio-bar",
          color_fill: "#284627",
          color_line: "#284627",
          display_mode: "compact"
        },
        category: void 0
      };
      const category = {
        id: 3,
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
          display_mode: "compact",
          zoom: 14
        }
      };
      const defaultProps = {
        menuItems: [
          menuGroup,
          menuLink,
          category
        ],
        filters: {},
        categoriesActivesCountByParent: {},
        selectedCategoriesIds: [],
        size: "lg",
        displayModeDefault: "large"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        Large: {
          ...defaultProps,
          menuItems: [
            {
              ...defaultProps.menuItems[0],
              menu_group: {
                ...defaultProps.menuItems[0].menu_group,
                display_mode: "large"
              }
            },
            {
              ...defaultProps.menuItems[1],
              link: {
                ...defaultProps.menuItems[1].link,
                display_mode: "large"
              }
            },
            {
              ...defaultProps.menuItems[2],
              category: {
                ...defaultProps.menuItems[2].category,
                display_mode: "large"
              }
            }
          ]
        },
        ManyGroups: {
          ...defaultProps,
          menuItems: [
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup,
            menuGroup
          ]
        }
      };
      const __returned__ = {
        menuGroup,
        menuLink,
        category,
        defaultProps,
        props,
        ItemList
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
      title: "Menu/ItemList"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["ItemList"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Menu/ItemList.story.vue";
  ItemList_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/ItemList.story.vue"
    ]
  ]);
});
export {
  __tla,
  ItemList_story as default
};
