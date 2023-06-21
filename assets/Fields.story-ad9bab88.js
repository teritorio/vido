import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { F as Fields, __tla as __tla_1 } from "./Fields-69092bde.js";
import { __tla as __tla_2 } from "./Field-73c4ca61.js";
import { __tla as __tla_3 } from "./Phone-fe42dea9.js";
import { __tla as __tla_4 } from "./DateRange-742a5053.js";
import { __tla as __tla_5 } from "./property-translations-fcaee93b.js";
import { __tla as __tla_6 } from "./RoutesField-d87c8518.js";
import { __tla as __tla_7 } from "./Stars-4c374ab7.js";
let Fields_story;
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
    __name: "Fields.story",
    setup(__props, { expose }) {
      expose();
      const properties = {
        metadata: {
          id: 1
        }
      };
      const defaultProps = {
        fields: [],
        properties,
        geom: {
          type: "Point",
          coordinates: [
            0,
            0
          ]
        }
      };
      const description = "Itin\xE9raire tr\xE8s int\xE9ressant, d'une part pour sa vari\xE9t\xE9 paysag\xE8re accentu\xE9e par la travers\xE9e fr\xE9quente de cours d'eau et d'autre part, par la qualit\xE9 du patrimoine b\xE2ti : maisons traditionnelles landaises, \xE9glise en garluche. \n\nDistance : 10,2 km - Dur\xE9e : 4h45 - Animaux tenus en laisse  - Sentier p\xE9destre et VTT \nFiche rando disponible dans le topoguide du D\xE9partement des Landes du Pays de Born n\xB015 (en vente : 2 \u20AC)";
      const props = {
        DefaultEmpty: {
          ...defaultProps
        },
        Many: {
          ...defaultProps,
          fields: [
            {
              field: "phone"
            },
            {
              field: "route"
            },
            {
              field: "short_description"
            }
          ],
          properties: {
            metadata: {
              id: 0
            },
            phone: [
              "+33676544"
            ],
            mobile: [
              "+339750987766"
            ],
            "route:hiking:difficulty": "easy",
            "route:hiking:duration": 285,
            "route:hiking:length": 10.2,
            "route:mtb:difficulty": "easy",
            "route:mtb:duration": 90,
            "route:mtb:length": 10.2,
            "route:gpx_trace": "https://cdt40.tourinsoft.com/upload/15.8.gpx",
            "route:pdf": "https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf",
            description
          },
          details: "details"
        }
      };
      const __returned__ = {
        properties,
        defaultProps,
        description,
        props,
        Fields
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
      title: "PoisCard/Fields"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["Fields"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/PoisCard/Fields.story.vue";
  Fields_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/Fields.story.vue"
    ]
  ]);
});
export {
  __tla,
  Fields_story as default
};
