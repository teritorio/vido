import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { P as PoiCard, __tla as __tla_1 } from "./PoiCard-0fa4a9ce.js";
import { p as poi } from "./2-8524393d.js";
import { __tla as __tla_2 } from "./Fields-af7d7fff.js";
import { __tla as __tla_3 } from "./Field-badcf276.js";
import { __tla as __tla_4 } from "./Phone-ee9063e2.js";
import { __tla as __tla_5 } from "./DateRange-6d29e143.js";
import { __tla as __tla_6 } from "./property-translations-f270a039.js";
import { __tla as __tla_7 } from "./RoutesField-e613b2b6.js";
import { __tla as __tla_8 } from "./Stars-fbf34d2a.js";
import { __tla as __tla_9 } from "./FavoriteIcon-4536a3ad.js";
import { __tla as __tla_10 } from "./TeritorioIcon-9c2f7072.js";
import { __tla as __tla_11 } from "./UIPicture-62fcd39c.js";
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
