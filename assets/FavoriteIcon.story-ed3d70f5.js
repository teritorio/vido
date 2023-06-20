import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { F as FavoriteIcon, __tla as __tla_1 } from "./FavoriteIcon-4536a3ad.js";
let FavoriteIcon_story;
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
  const _sfc_main = defineComponent({
    __name: "FavoriteIcon.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {};
      const props = {
        Default: {
          ...defaultProps
        },
        Active: {
          ...defaultProps,
          isActive: true
        },
        Colored: {
          ...defaultProps,
          colorLine: "#ff0000"
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        FavoriteIcon
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
      title: "UI/FavoriteIcon"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["FavoriteIcon"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/UI/FavoriteIcon.story.vue";
  FavoriteIcon_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/FavoriteIcon.story.vue"
    ]
  ]);
});
export {
  __tla,
  FavoriteIcon_story as default
};
