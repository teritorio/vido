import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { L as Link, __tla as __tla_1 } from "./Link-354492ed.js";
import { __tla as __tla_2 } from "./Item-f4eeac49.js";
import { __tla as __tla_3 } from "./TeritorioIconBadge-9e03c463.js";
import { __tla as __tla_4 } from "./TeritorioIcon-2d54367a.js";
let Link_story;
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
    __name: "Link.story",
    setup(__props, { expose }) {
      expose();
      const menuLink = {
        id: 123,
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
      const defaultProps = {
        menuLink,
        size: "lg",
        displayModeDefault: "large"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        Large: {
          ...defaultProps,
          menuLink: {
            ...defaultProps.menuLink,
            link: {
              ...menuLink.link,
              display_mode: "large"
            }
          }
        }
      };
      const __returned__ = {
        menuLink,
        defaultProps,
        props,
        Link
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
      title: "Menu/Link"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["Link"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Menu/Link.story.vue";
  Link_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Link.story.vue"
    ]
  ]);
});
export {
  __tla,
  Link_story as default
};
