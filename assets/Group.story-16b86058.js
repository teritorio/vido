import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { G as Group, __tla as __tla_1 } from "./Group-24fa2fb3.js";
import { __tla as __tla_2 } from "./Item-3f7eb06b.js";
import { __tla as __tla_3 } from "./TeritorioIconBadge-a9ef080f.js";
import { __tla as __tla_4 } from "./TeritorioIcon-e896869c.js";
let Group_story;
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
    __name: "Group.story",
    setup(__props, { expose }) {
      expose();
      const menuGroup = {
        id: 123,
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
      const defaultProps = {
        menuGroup,
        categoriesActivesCount: 0,
        size: "lg",
        displayModeDefault: "large"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        Large: {
          ...defaultProps,
          menuGroup: {
            ...defaultProps.menuGroup,
            menu_group: {
              ...defaultProps.menuGroup.menu_group,
              display_mode: "large"
            }
          }
        },
        Activities: {
          ...defaultProps,
          categoriesActivesCount: 33
        },
        ActivitiesLarge: {
          ...defaultProps,
          menuGroup: {
            ...defaultProps.menuGroup,
            menu_group: {
              ...defaultProps.menuGroup.menu_group,
              display_mode: "large"
            }
          },
          categoriesActivesCount: 33
        },
        EdgeCases: {
          ...defaultProps,
          menuGroup: {
            ...defaultProps.menuGroup,
            menu_group: {
              ...defaultProps.menuGroup.menu_group,
              name: {
                fr: "Leisure & Skiing and misc Ananas"
              },
              display_mode: "large"
            }
          },
          categoriesActivesCount: 97647
        }
      };
      const __returned__ = {
        menuGroup,
        defaultProps,
        props,
        Group
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
      title: "Menu/Group"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["Group"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Menu/Group.story.vue";
  Group_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Group.story.vue"
    ]
  ]);
});
export {
  __tla,
  Group_story as default
};
