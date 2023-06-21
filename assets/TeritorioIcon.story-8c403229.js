import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { T as TeritorioIcon, __tla as __tla_1 } from "./TeritorioIcon-2d54367a.js";
let TeritorioIcon_story;
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
    __name: "TeritorioIcon.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        picto: "teritorio teritorio-restaurant",
        colorText: "#000000"
      };
      const props = {
        Default: {
          ...defaultProps
        },
        TextColor: {
          ...defaultProps,
          colorText: "#ff0000"
        },
        Fontawesome: {
          ...defaultProps,
          picto: "phone"
        },
        FontawesomeTextColor: {
          ...defaultProps,
          picto: "phone",
          colorText: "#ff0000"
        },
        Image: {
          ...defaultProps,
          image: "https://www.teritorio.fr/wp-content/themes/teritorio/img/favicon/favicon-194x194.png"
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        TeritorioIcon
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
      title: "UI/TeritorioIcon"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["TeritorioIcon"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/UI/TeritorioIcon.story.vue";
  TeritorioIcon_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/TeritorioIcon.story.vue"
    ]
  ]);
});
export {
  __tla,
  TeritorioIcon_story as default
};
