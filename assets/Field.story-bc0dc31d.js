import { as as _export_sfc, at as defineComponent, au as resolveComponent, av as createBlock, aw as withCtx, ax as openBlock, ay as createElementBlock, az as renderList, aA as Fragment, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { F as Field, __tla as __tla_1 } from "./Field-badcf276.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_2 } from "./property-translations-f270a039.js";
import { __tla as __tla_3 } from "./Phone-ee9063e2.js";
import { __tla as __tla_4 } from "./DateRange-6d29e143.js";
import { __tla as __tla_5 } from "./RoutesField-e613b2b6.js";
import { __tla as __tla_6 } from "./Stars-fbf34d2a.js";
let Field_story;
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
  })()
]).then(async () => {
  const _sfc_main = defineComponent({
    __name: "Field.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        context: PropertyTranslationsContextEnum.Details,
        field: {
          field: "name"
        },
        properties: {
          metadata: {
            id: 0
          },
          name: "foo"
        },
        geom: {
          type: "Point",
          coordinates: [
            0.123456789,
            0.987654321
          ]
        }
      };
      const description = "Itin\xE9raire tr\xE8s int\xE9ressant, d'une part pour sa vari\xE9t\xE9 paysag\xE8re accentu\xE9e par la travers\xE9e fr\xE9quente de cours d'eau et d'autre part, par la qualit\xE9 du patrimoine b\xE2ti : maisons traditionnelles landaises, \xE9glise en garluche. \n\nDistance : 10,2 km - Dur\xE9e : 4h45 - Animaux tenus en laisse  - Sentier p\xE9destre et VTT \nFiche rando disponible dans le topoguide du D\xE9partement des Landes du Pays de Born n\xB015 (en vente : 2 \u20AC)";
      const props = {
        Default: {
          ...defaultProps
        },
        DefaultListOne: {
          ...defaultProps,
          field: {
            field: "email"
          },
          properties: {
            metadata: {
              id: 0
            },
            email: [
              "foo"
            ]
          }
        },
        DefaultListMany: {
          ...defaultProps,
          field: {
            field: "email"
          },
          properties: {
            metadata: {
              id: 0
            },
            email: [
              "foo",
              "bar"
            ]
          }
        },
        NoValue: {
          ...defaultProps,
          properties: {
            metadata: {
              id: 0
            }
          }
        },
        Label: {
          ...defaultProps,
          field: {
            ...defaultProps.field,
            label: true
          }
        },
        StartEndDate: {
          ...defaultProps,
          field: {
            field: "start_end_date"
          },
          properties: {
            metadata: {
              id: 0
            },
            start_date: "2001-01-01",
            end_date: "2012-12-12"
          }
        },
        Addr: {
          ...defaultProps,
          field: {
            field: "addr"
          },
          properties: {
            metadata: {
              id: 0
            },
            "addr:housenumber": "33",
            "addr:street": "Rue du Nord",
            "addr:postcode": "35677",
            "addr:city": "Le Grand Nord"
          }
        },
        Description: {
          ...defaultProps,
          field: {
            field: "description"
          },
          properties: {
            metadata: {
              id: 0
            },
            description
          }
        },
        DescriptionShort: {
          ...defaultProps,
          field: {
            field: "short_description"
          },
          properties: {
            metadata: {
              id: 0
            },
            description
          }
        },
        DescriptionDetails: {
          ...defaultProps,
          field: {
            field: "short_description"
          },
          properties: {
            metadata: {
              id: 0
            },
            description
          },
          details: "details"
        },
        Email: {
          ...defaultProps,
          field: {
            field: "email"
          },
          properties: {
            metadata: {
              id: 0
            },
            email: [
              "root@example.com"
            ]
          }
        },
        Website: {
          ...defaultProps,
          field: {
            field: "website"
          },
          properties: {
            metadata: {
              id: 0
            },
            website: [
              "https://example.com"
            ]
          }
        },
        Facebook: {
          ...defaultProps,
          field: {
            field: "facebook"
          },
          properties: {
            metadata: {
              id: 0
            },
            facebook: "https://www.facebook.com/"
          }
        },
        Instagram: {
          ...defaultProps,
          field: {
            field: "instagram"
          },
          properties: {
            metadata: {
              id: 0
            },
            instagram: "https://www.instagram.com/"
          }
        },
        RouteGpxTrace: {
          ...defaultProps,
          field: {
            field: "route:gpx_trace"
          },
          properties: {
            metadata: {
              id: 0
            },
            "route:gpx_trace": "https://cdt40.tourinsoft.com/upload/15.8.gpx"
          }
        },
        RoutePdf: {
          ...defaultProps,
          field: {
            field: "route:pdf"
          },
          properties: {
            metadata: {
              id: 0
            },
            "route:pdf": "https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf"
          }
        },
        Download: {
          ...defaultProps,
          field: {
            field: "download"
          },
          properties: {
            metadata: {
              id: 0
            },
            download: [
              "https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf",
              "https://cdt41.tourinsoft.com/upload/ITIAQU040V502MFU.pdf"
            ]
          }
        },
        Coordinates: {
          ...defaultProps,
          field: {
            field: "coordinates"
          }
        }
      };
      const __returned__ = {
        defaultProps,
        description,
        props,
        Field
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
      title: "Fields/Field"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["Field"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Fields/Field.story.vue";
  Field_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Fields/Field.story.vue"
    ]
  ]);
});
export {
  __tla,
  Field_story as default
};
