import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aA as Fragment, az as renderList, av as createBlock, aS as normalizeClass, b2 as resolveDynamicComponent, at as defineComponent, au as resolveComponent, aw as withCtx, aB as createVNode, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-bd688624.js";
import { P as PoiCard, __tla as __tla_1 } from "./PoiCard-0fa4a9ce.js";
import { P as PoiCardLight, __tla as __tla_2 } from "./PoiCardLight-2a75a048.js";
import { __tla as __tla_3 } from "./Fields-af7d7fff.js";
import { __tla as __tla_4 } from "./Field-badcf276.js";
import { __tla as __tla_5 } from "./Phone-ee9063e2.js";
import { __tla as __tla_6 } from "./DateRange-6d29e143.js";
import { __tla as __tla_7 } from "./property-translations-f270a039.js";
import { __tla as __tla_8 } from "./RoutesField-e613b2b6.js";
import { __tla as __tla_9 } from "./Stars-fbf34d2a.js";
import { __tla as __tla_10 } from "./FavoriteIcon-4536a3ad.js";
import { __tla as __tla_11 } from "./TeritorioIcon-9c2f7072.js";
import { __tla as __tla_12 } from "./UIPicture-62fcd39c.js";
import "./types-f83cf40c.js";
import { __tla as __tla_13 } from "./TeritorioIconBadge-ab900b2a.js";
let PoisDeck_story;
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
  })(),
  (() => {
    try {
      return __tla_12;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_13;
    } catch {
    }
  })()
]).then(async () => {
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      PoiCard,
      PoiCardLight
    },
    props: {
      pois: {
        type: Array,
        required: true
      },
      selectedPoiIds: {
        type: Array,
        default: void 0
      },
      poisCard: {
        type: String,
        default: "PoiCard"
      },
      explorerModeEnabled: {
        type: Boolean,
        required: true
      },
      favoritesModeEnabled: {
        type: Boolean,
        required: true
      }
    },
    emits: {
      "zoom-click": (poi) => true,
      "explore-click": (poi) => true,
      "favorite-click": (poi) => true
    },
    methods: {
      isFavorite(id) {
        return this.selectedPoiIds === void 0 || this.selectedPoiIds.includes(id);
      }
    }
  });
  const _hoisted_1 = {
    class: "tw-flex tw-justify-between tw-flex-wrap tw-gap-6"
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pois, (item) => {
        return openBlock(), createBlock(resolveDynamicComponent(_ctx.poisCard), {
          key: item.properties.metadata.id,
          poi: item,
          class: normalizeClass([
            "tw-grow-1",
            !_ctx.isFavorite(item.properties.metadata.id) && "tw-bg-zinc-200 tw-opacity-70"
          ]),
          "explorer-mode-enabled": _ctx.explorerModeEnabled,
          "favorites-mode-enabled": _ctx.favoritesModeEnabled,
          onExploreClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("explore-click", $event)),
          onFavoriteClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("favorite-click", $event)),
          onZoomClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("zoom-click", $event))
        }, null, 40, [
          "poi",
          "class",
          "explorer-mode-enabled",
          "favorites-mode-enabled"
        ]);
      }), 128))
    ]);
  }
  _sfc_main$1.__file = "components/PoisCard/PoisDeck.vue";
  const PoisDeck = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoisDeck.vue"
    ]
  ]);
  const type = "FeatureCollection";
  const features = [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -1.16728,
          44.07568
        ]
      },
      properties: {
        name: "A M\xE9zos, circuit du Courlis",
        classe: "Balades \xE0 pieds",
        "teritorio:url": "https://www.tourismelandes.com/wp-json/irisit/link/ITIAQU040V502MFU",
        "addr:street": "Avenue du Born",
        "addr:postcode": "40170",
        phone: [
          "+33 5 58 09 11 20"
        ],
        email: [
          "contact@mimizan-tourisme.com"
        ],
        "addr:city": "MEZOS",
        metadata: {
          id: 2,
          category_ids: [
            211
          ],
          source: "tis"
        },
        display: {
          icon: "teritorio teritorio-extra-hiking_forest",
          style_class: [
            "extra",
            "hiking"
          ],
          color_fill: "#00a757",
          color_line: "#00a757"
        },
        editorial: {
          details_fields: [
            {
              field: "route"
            },
            {
              field: "opening_hours"
            },
            {
              group: "download",
              display_mode: "card",
              icon: "arrow-circle-down",
              fields: [
                {
                  field: "route:gpx_trace"
                },
                {
                  field: "route:pdf"
                }
              ]
            },
            {
              group: "contact",
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
              field: "description"
            }
          ],
          popup_fields: [
            {
              field: "route"
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
            fr: "Balades \xE0 pieds"
          },
          class_label_popup: {
            fr: "Balades \xE0 pieds"
          },
          class_label_details: {
            fr: "Balades \xE0 pieds"
          },
          "website:details": "/poi/2/details"
        },
        description: `<div>Itin\xE9raire tr\xE8s int\xE9ressant, d'une part pour sa vari\xE9t\xE9 paysag\xE8re accentu\xE9e par la travers\xE9e fr\xE9quente de cours d'eau et d'autre part, par la qualit\xE9 du patrimoine b\xE2ti : maisons traditionnelles landaises, \xE9glise en garluche. 

Distance : 10,2 km - Dur\xE9e : 4h45 - Animaux tenus en laisse  - Sentier p\xE9destre et VTT 
Fiche rando disponible dans le topoguide du D\xE9partement des Landes du Pays de Born n\xB015 (en vente : 2 \u20AC)</div><div><br /></div><div><span type="champSimple" id="408feabd-c6ba-44fe-99e6-2dcb32b888b1" data-champcoderef=" "></span><br /></div><br />`,
        image: [
          "https://tile.openstreetmap.org/7/6/19.png"
        ],
        "route:hiking:difficulty": "easy",
        "route:hiking:duration": 285,
        "route:hiking:length": 10.2,
        "route:mtb:difficulty": "easy",
        "route:mtb:duration": 90,
        "route:mtb:length": 10.2,
        "route:gpx_trace": "https://cdt40.tourinsoft.com/upload/15.8.gpx",
        "route:pdf": "https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf"
      }
    },
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
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -1.22772216796875,
          44.040218713142146
        ]
      },
      properties: {
        "route:point:type": "parking",
        description: {
          fr: "Gratuit le weekend."
        },
        id: 10001
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -1.138458251953125,
          44.05699861738566
        ]
      },
      properties: {
        "route:point:type": "start",
        name: {
          fr: "D\xE9part"
        },
        description: {
          fr: "Prendre en direction du sud."
        },
        id: 10002
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -1.20851,
          44.06808
        ]
      },
      properties: {
        "route:point:type": "way_point",
        name: {
          fr: "Petite Pause"
        },
        description: {
          fr: "Point de vue sur les foug\xE8res."
        },
        id: 10003
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          -1.18377685546875,
          44.04614157509527
        ]
      },
      properties: {
        "route:point:type": "end",
        name: {
          fr: "Arriv\xE9"
        },
        description: {
          fr: "Alors, elles ne sont pas belles nos foug\xE8res ?"
        },
        id: 10004
      }
    }
  ];
  const poisDeps = {
    type,
    features
  };
  function _optionalChain(ops) {
    let lastAccessLHS = void 0;
    let value = ops[0];
    let i = 1;
    while (i < ops.length) {
      const op = ops[i];
      const fn = ops[i + 1];
      i += 2;
      if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
        return void 0;
      }
      if (op === "access" || op === "optionalAccess") {
        lastAccessLHS = value;
        value = fn(value);
      } else if (op === "call" || op === "optionalCall") {
        value = fn((...args) => value.call(lastAccessLHS, ...args));
        lastAccessLHS = void 0;
      }
    }
    return value;
  }
  const iconMap = {
    ["parking"]: "square-parking",
    ["start"]: "house-flag",
    ["end"]: "flag-checkered",
    ["way_point"]: "map-marker-alt"
  };
  function apiRouteWaypointToApiPoi(waypoint, colorFill, colorLine) {
    return {
      ...waypoint,
      properties: {
        ...waypoint.properties,
        name: _optionalChain([
          waypoint,
          "access",
          (_) => _.properties,
          "access",
          (_2) => _2.name,
          "optionalAccess",
          (_3) => _3.fr
        ]),
        description: _optionalChain([
          waypoint,
          "access",
          (_4) => _4.properties,
          "access",
          (_5) => _5.description,
          "optionalAccess",
          (_6) => _6.fr
        ]),
        metadata: {
          id: waypoint.properties.id
        },
        display: {
          icon: iconMap[waypoint.properties["route:point:type"]],
          color_fill: colorFill,
          color_line: colorLine
        },
        editorial: {
          popup_fields: [
            {
              field: "short_description"
            },
            {
              field: "coordinates",
              label: true
            }
          ]
        }
      }
    };
  }
  const _sfc_main = defineComponent({
    __name: "PoisDeck.story",
    setup(__props, { expose }) {
      expose();
      const points = poisDeps["features"].filter((feature) => feature.properties["route:point:type"]);
      const defaultProps = {
        pois: points.map((feature) => apiRouteWaypointToApiPoi(feature, "#123456", "#123456")),
        selectedPoiIds: points.map((feature) => feature.properties.id),
        explorerModeEnabled: false,
        favoritesModeEnabled: false
      };
      const props = {
        Default: {
          ...defaultProps
        },
        Light: {
          ...defaultProps,
          poisCard: "PoiCardLight"
        }
      };
      const __returned__ = {
        points,
        defaultProps,
        props,
        PoisDeck
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
      title: "PoisCard/PoisDeck"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["PoisDeck"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/PoisCard/PoisDeck.story.vue";
  PoisDeck_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/PoisCard/PoisDeck.story.vue"
    ]
  ]);
});
export {
  __tla,
  PoisDeck_story as default
};
