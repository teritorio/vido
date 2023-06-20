import { aE as defineNuxtComponent, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, aA as Fragment, az as renderList, aI as toDisplayString, aB as createVNode, aw as withCtx, aH as createTextVNode, b5 as NuxtLink, at as defineComponent, av as createBlock, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { F as Field, __tla as __tla_1 } from "./Field-badcf276.js";
import { P as PropertyTranslationsContextEnum, __tla as __tla_2 } from "./property-translations-f270a039.js";
import { __tla as __tla_3 } from "./Phone-ee9063e2.js";
import { __tla as __tla_4 } from "./DateRange-6d29e143.js";
import { __tla as __tla_5 } from "./RoutesField-e613b2b6.js";
import { __tla as __tla_6 } from "./Stars-fbf34d2a.js";
let PoisTable_story;
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
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      Field
    },
    props: {
      fields: {
        type: Array,
        required: true
      },
      pois: {
        type: Object,
        required: true
      }
    },
    computed: {
      headers() {
        const h = this.fields.map((field) => ({
          value: field.field,
          text: this.$propertyTranslations.p(field.field, PropertyTranslationsContextEnum.List)
        }));
        h.push({
          value: "",
          text: ""
        });
        return h;
      },
      context() {
        return PropertyTranslationsContextEnum.List;
      }
    }
  });
  const _hoisted_1 = {
    class: "tw-bg-gray-100"
  };
  const _hoisted_2 = {
    key: 0
  };
  const _hoisted_3 = {
    class: "tw-align-top"
  };
  const _hoisted_4 = {
    key: 1
  };
  const _hoisted_5 = {
    class: "tw-text-center"
  };
  const _hoisted_6 = [
    "colspan"
  ];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Field = resolveComponent("Field");
    const _component_NuxtLink = NuxtLink;
    return openBlock(), createElementBlock("table", null, [
      createBaseVNode("thead", null, [
        createBaseVNode("tr", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.headers, (header) => {
            return openBlock(), createElementBlock("th", {
              key: header.value,
              scope: "col"
            }, toDisplayString(header.text), 1);
          }), 128))
        ])
      ]),
      _ctx.pois.features ? (openBlock(), createElementBlock("tbody", _hoisted_2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pois.features, (feature, i) => {
          return openBlock(), createElementBlock("tr", {
            key: i
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.fields, (field) => {
              return openBlock(), createElementBlock("td", {
                key: field.field,
                class: "tw-align-top"
              }, [
                createVNode(_component_Field, {
                  context: _ctx.context,
                  "recursion-stack": [
                    field.field
                  ],
                  field,
                  details: _ctx.$t("poisTable.details"),
                  properties: feature.properties,
                  geom: feature.geometry
                }, null, 8, [
                  "context",
                  "recursion-stack",
                  "field",
                  "details",
                  "properties",
                  "geom"
                ])
              ]);
            }), 128)),
            createBaseVNode("td", _hoisted_3, [
              createVNode(_component_NuxtLink, {
                to: `/poi/${feature.properties.metadata.id}/details`
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t("poisTable.details")), 1)
                ]),
                _: 2
              }, 1032, [
                "to"
              ])
            ])
          ]);
        }), 128))
      ])) : (openBlock(), createElementBlock("tbody", _hoisted_4, [
        createBaseVNode("tr", _hoisted_5, [
          createBaseVNode("td", {
            colspan: _ctx.headers.length
          }, toDisplayString(_ctx.$t("poisTable.empty")), 9, _hoisted_6)
        ])
      ]))
    ]);
  }
  _sfc_main$1.__file = "components/PoisList/PoisTable.vue";
  const PoisTable = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisList/PoisTable.vue"
    ]
  ]);
  const type = "FeatureCollection";
  const features = [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -0.4855917,
          43.9045952
        ]
      },
      properties: {
        name: "Aire de Moyen Passage des Gens du Voyage",
        tourism: "caravan_site",
        "addr:postcode": "40000",
        "addr:city": "Mont-de-Marsan",
        phone: [
          "+33 6757658"
        ],
        image: [
          "https://tile.openstreetmap.org/7/6/19.png"
        ],
        metadata: {
          id: 1,
          cartocode: "A1",
          category_ids: [
            22
          ],
          source: "osm",
          osm_id: 583477748,
          osm_type: "node",
          updated_at: "2009-12-09T06:34:45Z"
        },
        display: {
          icon: "teritorio teritorio-caravan_site",
          color_fill: "#99163a",
          color_line: "#99163a"
        },
        editorial: {
          details_fields: [
            {
              field: "name"
            },
            {
              group: "contact_standard",
              display_mode: "standard",
              icon: "phone",
              fields: [
                {
                  field: "name"
                },
                {
                  field: "addr"
                },
                {
                  field: "phone"
                },
                {
                  field: "mobile"
                }
              ]
            },
            {
              group: "contact_card",
              display_mode: "card",
              icon: "phone",
              fields: [
                {
                  field: "addr"
                },
                {
                  field: "phone"
                },
                {
                  field: "mobile"
                }
              ]
            },
            {
              field: "opening_hours"
            },
            {
              field: "description"
            },
            {
              field: "coordinates",
              label: true
            }
          ],
          popup_fields: [
            {
              field: "description"
            },
            {
              field: "addr"
            }
          ],
          list_fields: [
            {
              field: "name"
            },
            {
              field: "description"
            },
            {
              field: "addr"
            },
            {
              field: "opening_hours"
            }
          ],
          class_label: {
            fr: "Aires de camping-cars"
          },
          class_label_popup: {
            fr: "Aire de camping-cars"
          },
          class_label_details: {
            fr: "Aire de camping-cars"
          },
          "website:details": "/poi/1/details"
        }
      }
    }
  ];
  const poisDeps = {
    type,
    features
  };
  const _sfc_main = defineComponent({
    __name: "PoisTable.story",
    setup(__props, { expose }) {
      expose();
      const defaultProps = {
        fields: poisDeps.features[0].properties.editorial.list_fields,
        pois: poisDeps
      };
      const props = {
        Default: {
          ...defaultProps
        }
      };
      const __returned__ = {
        defaultProps,
        props,
        PoisTable
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
      title: "PoisList/PoisTable"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["PoisTable"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/PoisList/PoisTable.story.vue";
  PoisTable_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisList/PoisTable.story.vue"
    ]
  ]);
});
export {
  __tla,
  PoisTable_story as default
};
