import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-cc850437.js";
import { P as PoiCard, __tla as __tla_1 } from "./PoiCard-9c14b02e.js";
import { p as poi } from "./2-8524393d.js";
import { __tla as __tla_2 } from "./Fields-1b400249.js";
import { __tla as __tla_3 } from "./Field-43bb16b8.js";
import { __tla as __tla_4 } from "./Phone-52480e95.js";
import { __tla as __tla_5 } from "./DateRange-b424399d.js";
import { __tla as __tla_6 } from "./property-translations-9fdfb1f5.js";
import { __tla as __tla_7 } from "./RoutesField-0c089ce5.js";
import { __tla as __tla_8 } from "./Stars-c6e8b43a.js";
import { __tla as __tla_9 } from "./FavoriteIcon-8130c3cd.js";
import { __tla as __tla_10 } from "./TeritorioIcon-3925ac42.js";
import { __tla as __tla_11 } from "./UIPicture-12029774.js";
import "./types-f83cf40c.js";
let PoiCard_story;
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
  })(),
  (() => {
    try {
      return __tla_8;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_9;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_10;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_11;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "PoiCard.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        poi,
        explorerModeEnabled: false,
        favoritesModeEnabled: false
      };
      const props = {
        Default: {
          ...defaultProps
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        PoiCard
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
      title: "PoisCard/PoiCard"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["PoiCard"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/PoisCard/PoiCard.story.vue";
  PoiCard_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoiCard.story.vue"
    ]
  ]);
});
export {
  __tla,
  PoiCard_story as default
};
