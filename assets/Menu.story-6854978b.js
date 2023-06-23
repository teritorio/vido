import { aE as defineNuxtComponent, as as _export_sfc, ax as openBlock, ay as createElementBlock, aG as createBaseVNode, aF as renderSlot, aS as normalizeClass, aL as defineStore, aZ as index, b0 as deepEqual, b1 as mapActions, au as resolveComponent, aA as Fragment, az as renderList, aH as createTextVNode, aI as toDisplayString, aB as createVNode, aJ as createCommentVNode, aK as FontAwesomeIcon, aV as ref, av as createBlock, aT as withModifiers, aM as mapState, b2 as lodashExports, b3 as useRequestHeaders, aw as withCtx, b4 as resolveDynamicComponent, at as defineComponent, aC as normalizeProps, aD as guardReactiveProps, __tla as __tla_0 } from "./vendor-fe86adbc.js";
import { D as DateRange, __tla as __tla_1 } from "./DateRange-7fd7dee9.js";
import { N as NumberRange, __tla as __tla_2 } from "./NumberRange-81a73742.js";
import { S as SelectFilter, __tla as __tla_3 } from "./Select-1f61754b.js";
import { f as filterValueFactory, c as filterValuesIsSet, i as isSet, d as isMatch } from "./types-filters-1e0221da.js";
import { I as ItemList, __tla as __tla_4 } from "./ItemList-216e4f5c.js";
import { T as TeritorioIcon, __tla as __tla_5 } from "./TeritorioIcon-12504358.js";
import { M as MapStyleEnum } from "./types-f83cf40c.js";
import { __tla as __tla_6 } from "./Category-4bca8876.js";
import { __tla as __tla_7 } from "./Item-eeb46123.js";
import { __tla as __tla_8 } from "./TeritorioIconBadge-af4ad1b2.js";
import { __tla as __tla_9 } from "./Group-0ecaac6d.js";
import { __tla as __tla_10 } from "./Link-0851620b.js";
let Menu_story;
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
  })()
]).then(async () => {
  const MenuBlock_vue_vue_type_style_index_0_scoped_c1052a2d_lang = "";
  const _sfc_main$8 = defineNuxtComponent({
    props: {
      extraClassTextBackground: {
        type: String,
        default: "tw-bg-white"
      },
      isFilterActive: {
        type: Boolean,
        default: false
      }
    }
  });
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("aside", {
      class: normalizeClass([
        "tw-rounded-xl tw-shadow-md tw-pointer-events-auto",
        !_ctx.isFilterActive && "tw-overflow-y-hidden"
      ])
    }, [
      createBaseVNode("div", {
        class: normalizeClass([
          "tw-px-5 tw-py-4",
          _ctx.extraClassTextBackground
        ])
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 2)
    ], 2);
  }
  _sfc_main$8.__file = "components/Home/MenuBlock.vue";
  const MenuBlock = _export_sfc(_sfc_main$8, [
    [
      "render",
      _sfc_render$8
    ],
    [
      "__scopeId",
      "data-v-c1052a2d"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Home/MenuBlock.vue"
    ]
  ]);
  const _sfc_main$7 = defineNuxtComponent({
    props: {
      extraClass: {
        type: String,
        default: ""
      }
    }
  });
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", {
      class: normalizeClass([
        "tw-px-5 tw-py-4",
        _ctx.extraClass
      ])
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2);
  }
  _sfc_main$7.__file = "components/Home/MenuBlockBottom.vue";
  const MenuBlockBottom = _export_sfc(_sfc_main$7, [
    [
      "render",
      _sfc_render$7
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Home/MenuBlockBottom.vue"
    ]
  ]);
  const defaultOptions = {
    geometry_as: "bbox",
    short_description: true,
    format: "geojson"
  };
  function stringifyOptions(options) {
    return Object.entries(Object.assign({}, defaultOptions, options)).filter(([k, v]) => k != "format").map(([k, v]) => [
      k,
      `${v}`
    ]);
  }
  function getPoiById(vidoConfig, poiId, options = {}) {
    return fetch(`${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/poi/${poiId}.${options.format || defaultOptions.format}?` + new URLSearchParams(stringifyOptions(options))).then((data) => {
      if (data.ok) {
        return data.json();
      } else {
        return Promise.reject(new Error([
          data.url,
          data.status,
          data.statusText
        ].join(" ")));
      }
    });
  }
  function getPoiByCategoryIdUrl(vidoConfig, categoryId, options = {}) {
    options = Object.assign(defaultOptions, {
      geometry_as: "point"
    }, options);
    return `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/pois/category/${categoryId}.${options.format}?` + new URLSearchParams(stringifyOptions(options));
  }
  function getPoiByCategoryId(vidoConfig, categoryId, options = {}) {
    options = Object.assign(defaultOptions, {
      geometry_as: "point"
    }, options);
    return fetch(getPoiByCategoryIdUrl(vidoConfig, categoryId, options)).then((data) => {
      if (data.ok) {
        return data.json();
      } else {
        return Promise.reject(new Error([
          data.url,
          data.status,
          data.statusText
        ].join(" ")));
      }
    });
  }
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
  function sortedUniq(a) {
    return [
      ...new Set(a)
    ].sort();
  }
  function keepFeature(filters, feature) {
    return filters.reduce((prevValue, filter) => {
      return prevValue && (!isSet(filter) || isMatch(filter, feature.properties));
    }, true);
  }
  const menuStore = defineStore("menu", {
    state: () => ({
      menuItems: void 0,
      selectedCategoryIds: [],
      features: {},
      filters: {},
      allFeatures: {},
      isLoadingFeatures: false
    }),
    getters: {
      apiMenuCategory: (state) => {
        return state.menuItems === void 0 ? void 0 : Object.values(state.menuItems).filter((menuItem) => menuItem.category !== void 0);
      },
      selectedCategories: (state) => {
        return state.menuItems === void 0 ? void 0 : state.selectedCategoryIds.map((selectedCatagoryId) => state.menuItems[selectedCatagoryId]).filter((menuItems) => menuItems !== void 0);
      }
    },
    actions: {
      setSelectedCategoryIds(selectedCategoryIds) {
        this.selectedCategoryIds = selectedCategoryIds;
      },
      addSelectedCategoryIds(selectedCategoryIds) {
        this.selectedCategoryIds = sortedUniq([
          ...this.selectedCategoryIds,
          ...selectedCategoryIds
        ]);
      },
      delSelectedCategoryIds(selectedCategoryIds) {
        this.selectedCategoryIds = this.selectedCategoryIds.filter((categoryId) => !selectedCategoryIds.includes(categoryId));
      },
      clearSelectedCategoryIds() {
        this.selectedCategoryIds = [];
      },
      toggleSelectedCategoryId(categoryId) {
        if (this.selectedCategoryIds.includes(categoryId)) {
          this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== categoryId);
        } else {
          this.selectedCategoryIds = sortedUniq([
            ...this.selectedCategoryIds,
            categoryId
          ]);
        }
      },
      fetchConfig(menuItems) {
        try {
          const stateMenuItems = {};
          const filters = {};
          this.menuItems = void 0;
          menuItems.filter((menuItem) => !menuItem.hidden).map((menuItem) => {
            stateMenuItems[menuItem.id] = menuItem;
            return menuItem;
          }).forEach((menuItem) => {
            if (menuItem.parent_id && menuItem.parent_id !== null) {
              const parent = stateMenuItems[menuItem.parent_id];
              if (_optionalChain([
                parent,
                "optionalAccess",
                (_) => _.menu_group
              ])) {
                if (!parent.menu_group.vido_children) {
                  parent.menu_group.vido_children = [];
                }
                parent.menu_group.vido_children.push(menuItem.id);
              }
            }
            if (_optionalChain([
              menuItem,
              "access",
              (_2) => _2.category,
              "optionalAccess",
              (_3) => _3.filters
            ])) {
              filters[menuItem.id] = _optionalChain([
                menuItem,
                "access",
                (_4) => _4.category,
                "optionalAccess",
                (_5) => _5.filters,
                "access",
                (_6) => _6.map,
                "call",
                (_7) => _7((filter) => filterValueFactory(filter))
              ]);
            }
          });
          this.menuItems = stateMenuItems;
          this.filters = filters;
        } catch (error) {
          console.error("Vido error: Unable to fetch the menu config from the API", error);
        }
      },
      async fetchFeatures({ vidoConfig, categoryIds }) {
        this.isLoadingFeatures = true;
        try {
          const previousFeatures = this.allFeatures;
          const existingFeatures = categoryIds.map((categoryId) => Boolean(previousFeatures[categoryId]));
          const posts = (await Promise.all(categoryIds.filter((categoryId) => !previousFeatures[categoryId]).map((categoryId) => getPoiByCategoryId(vidoConfig, categoryId, {
            short_description: false
          })))).filter((e) => e);
          const features = {};
          let i = 0;
          for (let j = 0; j < categoryIds.length; j++) {
            const categoryId = categoryIds[j];
            const filterIsSet = this.filters[categoryId] && filterValuesIsSet(this.filters[categoryId]);
            if (existingFeatures[j]) {
              features[categoryId] = previousFeatures[categoryId].map((f) => ({
                ...f,
                properties: {
                  ...f.properties,
                  vido_visible: !filterIsSet || keepFeature(this.filters[categoryId], f)
                }
              }));
            } else {
              const post = posts[i];
              features[categoryId] = post.features.map((f) => {
                f.properties.vido_cat = categoryId;
                f.properties.vido_visible = !filterIsSet || keepFeature(this.filters[categoryId], f);
                return f;
              });
              i++;
            }
          }
          this.features = features;
          this.allFeatures = {
            ...this.allFeatures,
            ...features
          };
        } catch (error) {
          console.error("Vido error: Unable to fetch the features from the API", error);
        } finally {
          this.isLoadingFeatures = false;
        }
      },
      applyFilters({ categoryId, filterValues }) {
        const newFilters = index(this.filters);
        if (!deepEqual(newFilters[categoryId], filterValues)) {
          newFilters[categoryId] = filterValues;
          this.filters = newFilters;
          if (categoryId in this.features) {
            const features = index(this.features);
            const filterIsSet = filterValuesIsSet(filterValues);
            features[categoryId] = features[categoryId].map((feature) => {
              feature.properties.vido_visible = !filterIsSet || keepFeature(filterValues, feature);
              return feature;
            });
            this.features = features;
          }
        }
      }
    }
  });
  const _sfc_main$6 = defineNuxtComponent({
    components: {
      SelectFilter,
      DateRange,
      NumberRange
    },
    props: {
      categoryId: {
        type: Number,
        required: true
      },
      filtersValues: {
        type: Array,
        required: true
      }
    },
    computed: {
      filtersSafeCopy() {
        return index(this.filtersValues);
      }
    },
    emits: {
      "go-back-click": () => true,
      "activate-filter": (val) => true
    },
    methods: {
      ...mapActions(menuStore, [
        "applyFilters"
      ]),
      onGoBackClick() {
        this.$emit("go-back-click");
      },
      onClickFilter(val) {
        this.$emit("activate-filter", val);
      },
      onBooleanFilterChange(filterIndex, e) {
        const value = e.target.checked;
        const filters = this.filtersSafeCopy;
        const filter = filters[filterIndex];
        filter.filterValue = value;
        this.applyFilters({
          categoryId: this.categoryId,
          filterValues: filters
        });
      },
      onSelectionFilterChange(filterIndex, values) {
        const filters = this.filtersSafeCopy;
        const filter = filters[filterIndex];
        filter.filterValues = values || [];
        this.applyFilters({
          categoryId: this.categoryId,
          filterValues: filters
        });
      },
      onSelectionFilterDateChange(filterIndex, filterValue) {
        const filters = this.filtersSafeCopy;
        filters[filterIndex] = filterValue;
        this.applyFilters({
          categoryId: this.categoryId,
          filterValues: filters
        });
      },
      onSelectionFilterNumberRangeChange(filterIndex, filterValue) {
        const filters = this.filtersSafeCopy;
        filters[filterIndex] = filterValue;
        this.applyFilters({
          categoryId: this.categoryId,
          filterValues: filters
        });
      },
      onCheckboxFilterChange(filterIndex, val, checked) {
        const filters = this.filtersSafeCopy;
        const filter = filters[filterIndex];
        if (checked && !filter.filterValues.includes(val)) {
          filter.filterValues.push(val);
        } else if (!checked) {
          filter.filterValues = filter.filterValues.filter((k) => k !== val);
        }
        this.applyFilters({
          categoryId: this.categoryId,
          filterValues: filters
        });
      }
    }
  });
  const _hoisted_1$5 = {
    class: "tw-basis-max tw-shrink tw-flex tw-flex-col tw-gap-4 tw-flex-1"
  };
  const _hoisted_2$5 = {
    key: 0
  };
  const _hoisted_3$4 = {
    class: "tw-block tw-mb-1 tw-text-zinc-800"
  };
  const _hoisted_4$3 = [
    "name",
    "checked",
    "onChange"
  ];
  const _hoisted_5$2 = {
    key: 1
  };
  const _hoisted_6 = [
    "for"
  ];
  const _hoisted_7 = {
    key: 2
  };
  const _hoisted_8 = {
    class: "tw-mb-2 tw-text-zinc-500"
  };
  const _hoisted_9 = [
    "name",
    "checked",
    "onChange"
  ];
  const _hoisted_10 = {
    key: 3
  };
  const _hoisted_11 = {
    key: 4
  };
  const _hoisted_12 = {
    class: "tw-block tw-mb-1 tw-text-zinc-800"
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_SelectFilter = resolveComponent("SelectFilter");
    const _component_DateRange = resolveComponent("DateRange");
    const _component_NumberRange = resolveComponent("NumberRange");
    return openBlock(), createElementBlock("div", _hoisted_1$5, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filtersSafeCopy, (filter, filterIndex) => {
        return openBlock(), createElementBlock(Fragment, {
          key: filter.def.property
        }, [
          filter.type == "boolean" ? (openBlock(), createElementBlock("div", _hoisted_2$5, [
            createBaseVNode("label", _hoisted_3$4, [
              createBaseVNode("input", {
                type: "checkbox",
                class: "tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent",
                name: filter.def.property,
                checked: filter.filterValue,
                onChange: ($event) => _ctx.onBooleanFilterChange(filterIndex, $event)
              }, null, 40, _hoisted_4$3),
              createTextVNode(" " + toDisplayString(filter.def.name && filter.def.name.fr || filter.def.property), 1)
            ])
          ])) : filter.type == "multiselection" ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
            createBaseVNode("label", {
              for: filter.def.property,
              class: "tw-block tw-mb-2 tw-text-zinc-500"
            }, toDisplayString(filter.def.name && filter.def.name.fr || filter.def.property), 9, _hoisted_6),
            createVNode(_component_SelectFilter, {
              filter,
              onChange: ($event) => _ctx.onSelectionFilterChange(filterIndex, $event),
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.onClickFilter(true)),
              onBlur: _cache[1] || (_cache[1] = ($event) => _ctx.onClickFilter(false))
            }, null, 8, [
              "filter",
              "onChange"
            ])
          ])) : filter.type == "checkboxes_list" ? (openBlock(), createElementBlock("div", _hoisted_7, [
            createBaseVNode("p", _hoisted_8, toDisplayString(filter.def.name && filter.def.name.fr || filter.def.property), 1),
            (openBlock(true), createElementBlock(Fragment, null, renderList(filter.def.values, (value) => {
              return openBlock(), createElementBlock("label", {
                key: value.value,
                class: "tw-block tw-mb-1 tw-text-zinc-800"
              }, [
                createBaseVNode("input", {
                  type: "checkbox",
                  class: "tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent",
                  name: filter.def.property + "_" + value.value,
                  checked: filter.filterValues.includes(value.value),
                  onChange: (e) => _ctx.onCheckboxFilterChange(filterIndex, value.value, e.target.checked)
                }, null, 40, _hoisted_9),
                createTextVNode(" " + toDisplayString(value.name && value.name.fr || value.value), 1)
              ]);
            }), 128))
          ])) : filter.type == "date_range" ? (openBlock(), createElementBlock("div", _hoisted_10, [
            createVNode(_component_DateRange, {
              filter,
              onChange: ($event) => _ctx.onSelectionFilterDateChange(filterIndex, $event)
            }, null, 8, [
              "filter",
              "onChange"
            ])
          ])) : filter.type == "number_range" ? (openBlock(), createElementBlock("div", _hoisted_11, [
            createBaseVNode("label", _hoisted_12, [
              createTextVNode(toDisplayString(filter.def.name && filter.def.name.fr || filter.def.property) + " ", 1),
              createVNode(_component_NumberRange, {
                filter,
                onChange: ($event) => _ctx.onSelectionFilterNumberRangeChange(filterIndex, $event)
              }, null, 8, [
                "filter",
                "onChange"
              ])
            ])
          ])) : createCommentVNode("v-if", true)
        ], 64);
      }), 128))
    ]);
  }
  _sfc_main$6.__file = "components/Menu/Filter.vue";
  const FilterCompo = _export_sfc(_sfc_main$6, [
    [
      "render",
      _sfc_render$6
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/Filter.vue"
    ]
  ]);
  const _sfc_main$5 = defineNuxtComponent({
    components: {
      FontAwesomeIcon
    },
    props: {
      searchText: {
        type: String,
        default: ""
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      return {
        search: ref()
      };
    },
    emits: {
      input: (value) => true,
      focus: (event) => true,
      blur: (event) => true
    },
    methods: {
      onFocus(event) {
        this.$emit("focus", event);
        this.$tracking({
          type: "search"
        });
      }
    }
  });
  const _hoisted_1$4 = {
    class: "tw-relative tw-w-full"
  };
  const _hoisted_2$4 = {
    class: "tw-sr-only"
  };
  const _hoisted_3$3 = [
    "value",
    "placeholder"
  ];
  const _hoisted_4$2 = {
    class: "tw-absolute tw-inset-y-0 tw-right-0 tw-px-5 tw-text-zinc-800 tw-rounded-r-full tw-outline-none focus:tw-outline-none",
    style: {
      "pointer-events": "none"
    },
    type: "submit"
  };
  const _hoisted_5$1 = {
    class: "tw-sr-only"
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    return openBlock(), createElementBlock("form", {
      class: "tw-flex-grow tw-relative tw-pointer-events-auto tw-w-full",
      onSubmit: _cache[3] || (_cache[3] = withModifiers(() => {
      }, [
        "prevent"
      ]))
    }, [
      createBaseVNode("section", _hoisted_1$4, [
        createBaseVNode("label", null, [
          createBaseVNode("span", _hoisted_2$4, toDisplayString(_ctx.$t("headerMenu.searchHint")), 1),
          createBaseVNode("input", {
            ref: "search",
            value: _ctx.searchText,
            class: "tw-w-full tw-px-5 tw-py-3 tw-font-medium tw-text-zinc-700 tw-placeholder-zinc-500 tw-bg-zinc-100 tw-border-none tw-rounded-full tw-outline-none tw-appearance-none focus:tw-outline-none focus:tw-ring focus:tw-ring-zinc-300 tw-truncate tw-pr-10",
            placeholder: _ctx.$t("headerMenu.searchHint"),
            type: "text",
            onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("input", $event.target.value)),
            onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.onFocus && _ctx.onFocus(...args)),
            onBlur: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("blur", $event))
          }, null, 40, _hoisted_3$3)
        ]),
        createBaseVNode("button", _hoisted_4$2, [
          createBaseVNode("span", _hoisted_5$1, toDisplayString(_ctx.$t("headerMenu.search")), 1),
          !_ctx.isLoading ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
            key: 0,
            icon: "search"
          })) : (openBlock(), createBlock(_component_FontAwesomeIcon, {
            key: 1,
            icon: "spinner",
            class: "tw-animate-spin"
          }))
        ])
      ])
    ], 32);
  }
  _sfc_main$5.__file = "components/Search/SearchInput.vue";
  const SearchInput = _export_sfc(_sfc_main$5, [
    [
      "render",
      _sfc_render$5
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Search/SearchInput.vue"
    ]
  ]);
  const _sfc_main$4 = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      TeritorioIcon
    },
    props: {
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      icon: {
        type: String,
        default: null
      }
    },
    emits: {
      "item-click": (searchResult) => true
    },
    methods: {
      onItemClick(searchResult) {
        this.$tracking({
          type: "search_result_event",
          event: "select",
          resultType: this.type,
          title: searchResult.label
        });
        this.$emit("item-click", searchResult);
      }
    }
  });
  const _hoisted_1$3 = {
    class: "tw-mb-3"
  };
  const _hoisted_2$3 = {
    class: "tw-text-zinc-500 tw-text-sm tw-mb-2"
  };
  const _hoisted_3$2 = [
    "data-item",
    "onClick"
  ];
  const _hoisted_4$1 = {
    key: 0,
    class: "tw-text-zinc-400 tw-text-sm"
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_teritorio_icon = resolveComponent("teritorio-icon");
    return openBlock(), createElementBlock("div", _hoisted_1$3, [
      createBaseVNode("h4", _hoisted_2$3, [
        _ctx.icon ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
          key: 0,
          icon: _ctx.icon
        }, null, 8, [
          "icon"
        ])) : createCommentVNode("v-if", true),
        createTextVNode(" " + toDisplayString(_ctx.label), 1)
      ]),
      createBaseVNode("ul", null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item) => {
          return openBlock(), createElementBlock("li", {
            key: `${item.id}-${item.filter_property}-${item.filter_value}`,
            class: "tw-flex tw-flex-row tw-items-baseline tw-justify-start tw-gap-x-1 tw-mb-1 hover:tw-bg-zinc-100 tw-cursor-pointer tw-rounded-xl tw-ml-2 tw-px-2",
            "data-item": item.id,
            onClick: ($event) => _ctx.onItemClick(item)
          }, [
            item.icon && item.icon.indexOf("teritorio") != -1 ? (openBlock(), createBlock(_component_teritorio_icon, {
              key: 0,
              picto: item.icon,
              "color-text": "#6B7280"
            }, null, 8, [
              "picto"
            ])) : item.icon ? (openBlock(), createBlock(_component_FontAwesomeIcon, {
              key: 1,
              icon: item.icon,
              color: "#6B7280",
              size: "sm"
            }, null, 8, [
              "icon"
            ])) : createCommentVNode("v-if", true),
            createBaseVNode("span", null, [
              createTextVNode(toDisplayString(item.label) + " ", 1),
              item.small ? (openBlock(), createElementBlock("span", _hoisted_4$1, "(" + toDisplayString(item.small) + ")", 1)) : createCommentVNode("v-if", true)
            ])
          ], 8, _hoisted_3$2);
        }), 128))
      ])
    ]);
  }
  _sfc_main$4.__file = "components/Search/SearchResultBlock.vue";
  const SearchResultBlock = _export_sfc(_sfc_main$4, [
    [
      "render",
      _sfc_render$4
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Search/SearchResultBlock.vue"
    ]
  ]);
  ({
    [MapStyleEnum.vector]: "Teritorio",
    [MapStyleEnum.aerial]: "Imagerie a\xE9rienne IGN",
    [MapStyleEnum.bicycle]: "Teritorio - V\xE9lo"
  });
  MapStyleEnum.vector;
  const MAP_ZOOM = {
    zoom: {
      default: 8,
      max: 20,
      min: 1
    },
    selectionZoom: {
      poi: 17,
      streetNumber: 15,
      municipality: 12
    }
  };
  const Search_vue_vue_type_style_index_0_scoped_18b56a49_lang = "";
  const _sfc_main$3 = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      SearchInput,
      SearchResultBlock
    },
    props: {
      menuToIcon: {
        type: Object,
        required: true
      },
      mapCenter: {
        type: Object,
        default: () => ({
          lng: 0,
          lat: 0
        })
      }
    },
    data() {
      return {
        focus: false,
        searchQueryId: 0,
        searchResultId: 0,
        searchText: "",
        searchMenuItemsResults: null,
        searchPoisResults: null,
        searchAddressesResults: null,
        searchCartocodeResult: null,
        search: null,
        trackSearchQuery: null
      };
    },
    computed: {
      ...mapState(menuStore, [
        "filters"
      ]),
      isLoading() {
        return this.searchResultId !== this.searchQueryId;
      },
      itemsCartocode() {
        var _a, _b, _c, _d;
        const v = this.searchCartocodeResult;
        if (v && ((_a = v.properties.metadata) == null ? void 0 : _a.id)) {
          const label = v.properties.name || ((_c = (_b = v.properties.editorial) == null ? void 0 : _b.class_label) == null ? void 0 : _c.fr);
          if (label) {
            return [
              {
                id: (_d = v.properties.metadata) == null ? void 0 : _d.id,
                label
              }
            ];
          }
        }
        return [];
      },
      itemsMenuItems() {
        var _a, _b;
        return ((_b = (_a = this.searchMenuItemsResults) == null ? void 0 : _a.features) == null ? void 0 : _b.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: this.menuToIcon[v.properties.id],
          filter_property: v.properties.filter_property,
          filter_value: v.properties.filter_value
        }))) || [];
      },
      itemsPois() {
        var _a, _b;
        return ((_b = (_a = this.searchPoisResults) == null ? void 0 : _a.features) == null ? void 0 : _b.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: v.properties.icon,
          small: v.properties.city
        }))) || [];
      },
      itemsAddresses() {
        var _a, _b;
        return ((_b = (_a = this.searchAddressesResults) == null ? void 0 : _a.features) == null ? void 0 : _b.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: v.properties.type === "municipality" ? "city" : "map-marker-alt"
        }))) || [];
      },
      results() {
        return this.itemsCartocode.length + this.itemsMenuItems.length + this.itemsPois.length + this.itemsAddresses.length;
      }
    },
    created() {
      this.search = lodashExports.debounce(this.search_, 300);
      this.trackSearchQuery = lodashExports.debounce(this.trackSearchQuery_, 3e3);
    },
    emits: {
      blur: (event) => true,
      focus: (event) => true,
      selectFeature: (feature) => true
    },
    methods: {
      ...mapActions(menuStore, [
        "addSelectedCategoryIds",
        "applyFilters"
      ]),
      setSelectedFeature(feature) {
        this.$emit("selectFeature", feature);
      },
      reset() {
        this.searchMenuItemsResults = null;
        this.searchPoisResults = null;
        this.searchAddressesResults = null;
        this.searchCartocodeResult = null;
        this.searchText = "";
        this.focus = false;
      },
      delayedFocusLose(event) {
        setTimeout(() => {
          this.$emit("blur", event);
          this.focus = false;
        }, 200);
      },
      onSearchFocus(event) {
        this.$emit("focus", event);
        this.focus = true;
      },
      onCartocodeClick(searchResult) {
        var _a, _b;
        const cartocodeId = (_b = (_a = this.searchCartocodeResult) == null ? void 0 : _a.properties.metadata) == null ? void 0 : _b.id;
        if (cartocodeId === searchResult.id) {
          this.onPoiClick(searchResult);
        }
      },
      onCategoryClick(category) {
        if (this.searchMenuItemsResults) {
          const filter = this.searchMenuItemsResults.features.find((a) => a.properties.filter_property === category.filter_property && a.properties.filter_value === category.filter_value && a.properties.id === category.id);
          if (filter == null ? void 0 : filter.properties) {
            const newFilter = filter.properties;
            if (newFilter.filter_property) {
              const filters = index(this.filters[newFilter.id]);
              const filter2 = filters.find((filter3) => (filter3.type === "boolean" || filter3.type === "multiselection" || filter3.type === "checkboxes_list") && filter3.def.property === newFilter.filter_property);
              if (filter2) {
                switch (filter2 == null ? void 0 : filter2.type) {
                  case "boolean":
                    if (newFilter.filter_value === true) {
                      filter2.filterValue = newFilter.filter_value;
                    }
                    break;
                  case "multiselection":
                  case "checkboxes_list":
                    filter2.filterValues = [
                      newFilter.filter_value
                    ];
                    break;
                }
                this.applyFilters({
                  categoryId: newFilter.id,
                  filterValues: filters
                });
              }
            }
            this.addSelectedCategoryIds([
              newFilter.id
            ]);
            this.reset();
          }
        }
      },
      onPoiClick(searchResult) {
        getPoiById(this.$vidoConfig(useRequestHeaders()), searchResult.id).then((poi) => {
          this.setSelectedFeature(poi);
        });
        this.reset();
      },
      onAddressClick(searchResult) {
        var _a;
        const feature = (((_a = this.searchAddressesResults) == null ? void 0 : _a.features) || []).find((a) => a.properties.id === searchResult.id);
        if (feature) {
          Object.assign({}, feature, {
            class: "Adresse",
            vido_zoom: feature.properties.type === "municipality" ? MAP_ZOOM.selectionZoom.municipality : MAP_ZOOM.selectionZoom.streetNumber
          });
          this.setSelectedFeature(feature);
        }
        this.reset();
      },
      onSubmit(searchText) {
        this.searchText = searchText;
        if (!this.searchText || this.searchText.trim().length === 0) {
          this.searchMenuItemsResults = null;
          this.searchPoisResults = null;
          this.searchAddressesResults = null;
          this.searchCartocodeResult = null;
        }
        if (this.search) {
          this.search();
        }
      },
      search_() {
        if (this.searchText) {
          if (this.trackSearchQuery) {
            this.trackSearchQuery.cancel();
            this.trackSearchQuery(this.searchText);
          }
          this.searchQueryId += 1;
          const currentSearchQueryId = this.searchQueryId;
          const config = this.$vidoConfig(useRequestHeaders());
          const projectTheme = `project_theme=${config.API_PROJECT}-${config.API_THEME}`;
          const searchText = this.searchText.trim();
          if (searchText.length === 2) {
            const cartocode = this.searchText;
            getPoiById(this.$vidoConfig(useRequestHeaders()), `cartocode:${cartocode}`).then((poi) => {
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId;
                this.searchMenuItemsResults = null;
                this.searchPoisResults = null;
                this.searchAddressesResults = null;
                this.searchCartocodeResult = poi;
              }
            }).catch(() => {
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId;
                this.searchMenuItemsResults = null;
                this.searchPoisResults = null;
                this.searchAddressesResults = null;
                this.searchCartocodeResult = null;
              }
            });
          } else if (searchText.length > 2) {
            const query = `q=${this.searchText}&lon=${this.mapCenter.lng}&lat=${this.mapCenter.lat}`;
            const config2 = this.$vidoConfig(useRequestHeaders());
            const MenuItemsFetch = fetch(`${config2.API_SEARCH}?${projectTheme}&type=menu_item&${query}`).then((data) => data.ok ? data.json() : null);
            const poisFetch = fetch(`${config2.API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`).then((data) => data.ok ? data.json() : null);
            const addressesFetch = fetch(`${config2.API_SEARCH_ADDR}?${query}`).then((data) => data.ok ? data.json() : null);
            Promise.all([
              MenuItemsFetch,
              poisFetch,
              addressesFetch
            ]).then(([searchMenuItemsResults, searchPoisResults, searchAddressesResults]) => {
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId;
                this.searchMenuItemsResults = searchMenuItemsResults;
                this.searchPoisResults = searchPoisResults;
                this.searchAddressesResults = searchAddressesResults;
                this.searchCartocodeResult = null;
              }
            }).catch(() => {
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId;
                this.searchMenuItemsResults = null;
                this.searchPoisResults = null;
                this.searchAddressesResults = null;
                this.searchCartocodeResult = null;
              }
            });
          }
        }
      },
      trackSearchQuery_(searchText) {
        this.$tracking({
          type: "search_query",
          query: searchText
        });
      }
    }
  });
  const _hoisted_1$2 = {
    class: "tw-flex tw-flex-row tw-items-center"
  };
  const _hoisted_2$2 = {
    key: 1,
    class: "search-results"
  };
  const _hoisted_3$1 = {
    key: 4
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_SearchInput = resolveComponent("SearchInput");
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_SearchResultBlock = resolveComponent("SearchResultBlock");
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$2, [
        !_ctx.focus ? renderSlot(_ctx.$slots, "default", {
          key: 0
        }, void 0, true) : createCommentVNode("v-if", true),
        createVNode(_component_SearchInput, {
          "search-text": _ctx.searchText,
          "is-loading": _ctx.isLoading,
          onInput: _ctx.onSubmit,
          onFocus: _ctx.onSearchFocus,
          onBlur: _cache[0] || (_cache[0] = ($event) => _ctx.delayedFocusLose($event))
        }, null, 8, [
          "search-text",
          "is-loading",
          "onInput",
          "onFocus"
        ])
      ]),
      _ctx.focus && _ctx.results > 0 ? (openBlock(), createElementBlock("button", {
        key: 0,
        type: "button",
        class: "tw-shrink-0 tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-10",
        onClick: _cache[1] || (_cache[1] = (...args) => _ctx.reset && _ctx.reset(...args))
      }, [
        createVNode(_component_FontAwesomeIcon, {
          icon: "arrow-left",
          class: "tw-text-zinc-800",
          size: "xs"
        })
      ])) : createCommentVNode("v-if", true),
      _ctx.focus && _ctx.results > 0 ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
        _ctx.itemsCartocode.length > 0 ? (openBlock(), createBlock(_component_SearchResultBlock, {
          key: 0,
          type: "cartocode",
          label: _ctx.$t("headerMenu.cartocode"),
          icon: "layer-group",
          items: _ctx.itemsCartocode,
          onItemClick: _ctx.onCartocodeClick
        }, null, 8, [
          "label",
          "items",
          "onItemClick"
        ])) : createCommentVNode("v-if", true),
        _ctx.itemsMenuItems.length > 0 ? (openBlock(), createBlock(_component_SearchResultBlock, {
          key: 1,
          type: "category",
          label: _ctx.$t("headerMenu.categories"),
          icon: "layer-group",
          items: _ctx.itemsMenuItems,
          onItemClick: _ctx.onCategoryClick
        }, null, 8, [
          "label",
          "items",
          "onItemClick"
        ])) : createCommentVNode("v-if", true),
        _ctx.itemsPois.length > 0 ? (openBlock(), createBlock(_component_SearchResultBlock, {
          key: 2,
          type: "pois",
          label: _ctx.$t("headerMenu.pois"),
          icon: "map-marker-alt",
          items: _ctx.itemsPois,
          onItemClick: _ctx.onPoiClick
        }, null, 8, [
          "label",
          "items",
          "onItemClick"
        ])) : createCommentVNode("v-if", true),
        _ctx.itemsAddresses.length > 0 ? (openBlock(), createBlock(_component_SearchResultBlock, {
          key: 3,
          type: "addresse",
          label: _ctx.$t("headerMenu.addresses"),
          icon: "home",
          items: _ctx.itemsAddresses,
          onItemClick: _ctx.onAddressClick
        }, null, 8, [
          "label",
          "items",
          "onItemClick"
        ])) : createCommentVNode("v-if", true),
        _ctx.results === 0 ? (openBlock(), createElementBlock("p", _hoisted_3$1, toDisplayString(_ctx.$t("headerMenu.noResult")), 1)) : createCommentVNode("v-if", true)
      ])) : createCommentVNode("v-if", true)
    ]);
  }
  _sfc_main$3.__file = "components/Search/Search.vue";
  const Search = _export_sfc(_sfc_main$3, [
    [
      "render",
      _sfc_render$3
    ],
    [
      "__scopeId",
      "data-v-18b56a49"
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Search/Search.vue"
    ]
  ]);
  const _sfc_main$2 = defineNuxtComponent({
    props: {
      logoUrl: {
        type: String,
        required: true
      },
      mainUrl: {
        type: String,
        required: true
      },
      siteName: {
        type: String,
        required: true
      },
      imageClass: {
        type: String,
        default: "tw-max-w-2xl tw-max-h-16"
      }
    }
  });
  const _hoisted_1$1 = [
    "href",
    "aria-label",
    "title"
  ];
  const _hoisted_2$1 = [
    "src",
    "alt"
  ];
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("a", {
        href: _ctx.mainUrl,
        rel: "noopener noreferrer",
        "aria-label": _ctx.siteName,
        title: _ctx.siteName,
        target: "_blank"
      }, [
        createBaseVNode("img", {
          src: _ctx.logoUrl,
          class: normalizeClass([
            "tw-w-auto tw-h-auto",
            _ctx.imageClass
          ]),
          alt: _ctx.$t("headerMenu.logo")
        }, null, 10, _hoisted_2$1)
      ], 8, _hoisted_1$1)
    ]);
  }
  _sfc_main$2.__file = "components/UI/Logo.vue";
  const Logo = _export_sfc(_sfc_main$2, [
    [
      "render",
      _sfc_render$2
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/Logo.vue"
    ]
  ]);
  const _sfc_main$1 = defineNuxtComponent({
    components: {
      FontAwesomeIcon,
      Logo,
      MenuBlock,
      MenuBlockBottom,
      ItemList,
      FilterCompo,
      Search
    },
    props: {
      menuBlock: {
        type: String,
        required: true
      },
      isOnSearch: {
        type: Boolean,
        default: false
      },
      isFilterActive: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        navigationParentIdStack: [],
        categoryIdFilter: null
      };
    },
    computed: {
      ...mapState(menuStore, [
        "filters",
        "selectedCategoryIds",
        "menuItems"
      ]),
      currentParentId() {
        return this.navigationParentIdStack.at(-1);
      },
      currentMenuItems() {
        return this.getMenuItemByParentId(this.currentParentId);
      },
      isRootMenu() {
        return this.navigationParentIdStack.length === 0;
      },
      size() {
        return this.isRootMenu ? "2xl" : "lg";
      },
      isAllSelected() {
        return this.getRecursiveCategoryIdByParentId(this.currentParentId).every((categoryId) => this.selectedCategoryIds.includes(categoryId));
      },
      categoriesActivesCountByParent() {
        const counts = {};
        this.selectedCategoryIds.forEach((categoryId) => {
          var _a, _b, _c;
          let parentId = (_b = (_a = this.menuItems) == null ? void 0 : _a[categoryId]) == null ? void 0 : _b.parent_id;
          while (parentId) {
            counts[parentId] = (counts[parentId] || 0) + 1;
            parentId = (_c = this.menuItems) == null ? void 0 : _c[parentId].parent_id;
          }
        });
        return counts;
      }
    },
    emits: {
      "activate-filter": (val) => true,
      "scroll-top": () => true
    },
    watch: {
      currentMenuItems() {
        this.$emit("scroll-top");
      }
    },
    methods: {
      ...mapActions(menuStore, [
        "addSelectedCategoryIds",
        "delSelectedCategoryIds",
        "toggleSelectedCategoryId"
      ]),
      getMenuItemByParentId(menuGroupId) {
        return Object.values(this.menuItems || {}).filter((c) => c.parent_id === (menuGroupId || null)).sort((a, b) => a.index_order - b.index_order);
      },
      getRecursiveCategoryIdByParentId(menuGroupId) {
        const menuItems = this.getMenuItemByParentId(menuGroupId);
        const menuGroups = menuItems.filter((menuItem) => menuItem.menu_group);
        const categories = menuItems.filter((menuItem) => menuItem.category).map((category) => category.id);
        return [
          ...categories,
          ...menuGroups.map((parent) => this.getRecursiveCategoryIdByParentId(parent.id)).flat()
        ].sort();
      },
      onClickSelectAll() {
        this.addSelectedCategoryIds(this.getRecursiveCategoryIdByParentId(this.currentParentId));
      },
      onClickUnselectAll() {
        this.delSelectedCategoryIds(this.getRecursiveCategoryIdByParentId(this.currentParentId));
      },
      onGoBackClick() {
        this.navigationParentIdStack.pop();
      },
      onMenuGroupClick(menuGroupId) {
        this.navigationParentIdStack.push(menuGroupId);
      },
      onCategoryFilterClick(categoryId) {
        this.categoryIdFilter = categoryId;
      },
      onBackToCategoryClick() {
        this.categoryIdFilter = null;
      }
    }
  });
  const _hoisted_1 = {
    class: "tw-w-full tw-flex tw-justify-between tw-pb-4"
  };
  const _hoisted_2 = {
    key: 1,
    class: "tw-flex tw-flex-col tw-space-y-4"
  };
  const _hoisted_3 = {
    key: 2
  };
  const _hoisted_4 = {
    class: "tw-w-full tw-flex tw-justify-between tw-pb-4"
  };
  const _hoisted_5 = {
    class: "sr-only"
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
    const _component_FilterCompo = resolveComponent("FilterCompo");
    const _component_ItemList = resolveComponent("ItemList");
    return _ctx.categoryIdFilter ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.menuBlock), {
      key: 0,
      "is-filter-active": _ctx.isFilterActive
    }, {
      default: withCtx(() => [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("button", {
            type: "button",
            class: "tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100",
            onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onBackToCategoryClick && _ctx.onBackToCategoryClick(...args))
          }, [
            createVNode(_component_FontAwesomeIcon, {
              icon: "arrow-left",
              class: "tw-text-zinc-800",
              size: "xs"
            })
          ])
        ]),
        createVNode(_component_FilterCompo, {
          key: "Filter",
          "category-id": _ctx.categoryIdFilter,
          "filters-values": _ctx.categoryIdFilter ? _ctx.filters[_ctx.categoryIdFilter] : [],
          onActivateFilter: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("activate-filter", $event)),
          onGoBackClick: _ctx.onBackToCategoryClick
        }, null, 8, [
          "category-id",
          "filters-values",
          "onGoBackClick"
        ])
      ]),
      _: 1
    }, 8, [
      "is-filter-active"
    ])) : _ctx.isRootMenu ? (openBlock(), createElementBlock("div", _hoisted_2, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.currentMenuItems, (menuItem, index2) => {
        return openBlock(), createElementBlock(Fragment, {
          key: menuItem.id
        }, [
          index2 === 0 ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.menuBlock), {
            key: 0
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          })) : !_ctx.isOnSearch ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.menuBlock), {
            key: 1,
            class: normalizeClass([
              index2 === 0 && "tw-hidden md:tw-block"
            ])
          }, {
            default: withCtx(() => [
              createVNode(_component_ItemList, {
                "menu-items": _ctx.getMenuItemByParentId(menuItem.id),
                filters: _ctx.filters,
                "categories-actives-count-by-parent": _ctx.categoriesActivesCountByParent,
                "selected-categories-ids": _ctx.selectedCategoryIds,
                size: _ctx.size,
                "display-mode-default": "compact",
                class: "tw-flex-1 tw-pointer-events-auto tw-h-full",
                onMenuGroupClick: _ctx.onMenuGroupClick,
                onCategoryClick: _cache[2] || (_cache[2] = ($event) => _ctx.toggleSelectedCategoryId($event)),
                onFilterClick: _ctx.onCategoryFilterClick
              }, null, 8, [
                "menu-items",
                "filters",
                "categories-actives-count-by-parent",
                "selected-categories-ids",
                "size",
                "onMenuGroupClick",
                "onFilterClick"
              ])
            ]),
            _: 2
          }, 1032, [
            "class"
          ])) : createCommentVNode("v-if", true)
        ], 64);
      }), 128))
    ])) : (openBlock(), createElementBlock("div", _hoisted_3, [
      (openBlock(), createBlock(resolveDynamicComponent(_ctx.menuBlock), null, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("button", {
              type: "button",
              class: "tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-100",
              onClick: _cache[3] || (_cache[3] = (...args) => _ctx.onGoBackClick && _ctx.onGoBackClick(...args))
            }, [
              createBaseVNode("span", _hoisted_5, toDisplayString(_ctx.$t("headerMenu.back")), 1),
              createVNode(_component_FontAwesomeIcon, {
                icon: "arrow-left",
                class: "tw-text-zinc-800",
                size: "xs"
              })
            ]),
            !_ctx.isAllSelected ? (openBlock(), createElementBlock("button", {
              key: 0,
              type: "button",
              class: "tw-px-3 tw-py-2 tw-font-medium tw-transition-all tw-rounded-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100",
              onClick: _cache[4] || (_cache[4] = (...args) => _ctx.onClickSelectAll && _ctx.onClickSelectAll(...args))
            }, toDisplayString(_ctx.$t("headerMenu.selectAll")), 1)) : createCommentVNode("v-if", true),
            _ctx.isAllSelected ? (openBlock(), createElementBlock("button", {
              key: 1,
              type: "button",
              class: "tw-px-3 tw-py-2 tw-font-medium tw-transition-all tw-rounded-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus:tw-bg-zinc-100",
              onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onClickUnselectAll && _ctx.onClickUnselectAll(...args))
            }, toDisplayString(_ctx.$t("headerMenu.unselectAll")), 1)) : createCommentVNode("v-if", true)
          ]),
          createVNode(_component_ItemList, {
            "menu-items": _ctx.currentMenuItems,
            filters: _ctx.filters,
            "categories-actives-count-by-parent": _ctx.categoriesActivesCountByParent,
            "selected-categories-ids": _ctx.selectedCategoryIds,
            size: _ctx.size,
            "display-mode-default": "large",
            class: "tw-flex-1 tw-pointer-events-auto tw-h-full",
            onMenuGroupClick: _ctx.onMenuGroupClick,
            onCategoryClick: _cache[6] || (_cache[6] = ($event) => _ctx.toggleSelectedCategoryId($event)),
            onFilterClick: _ctx.onCategoryFilterClick
          }, null, 8, [
            "menu-items",
            "filters",
            "categories-actives-count-by-parent",
            "selected-categories-ids",
            "size",
            "onMenuGroupClick",
            "onFilterClick"
          ])
        ]),
        _: 1
      }))
    ]));
  }
  _sfc_main$1.__file = "components/Home/Menu.vue";
  const Menu = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Home/Menu.vue"
    ]
  ]);
  const _sfc_main = defineComponent({
    __name: "Menu.story",
    setup(__props, { expose }) {
      expose();
      const search = {
        id: 1,
        selected_by_default: false,
        parent_id: null,
        index_order: 1,
        menu_group: {
          name: {
            fr: "Search"
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
      const menuGroup1 = {
        id: 1,
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
      const menuGroup2 = {
        id: 12,
        selected_by_default: false,
        parent_id: 1,
        index_order: 1,
        menu_group: {
          name: {
            fr: "Leisure & Skiing"
          },
          icon: "teritorio teritorio-hosting",
          color_fill: "#284627",
          color_line: "#284627",
          display_mode: "large",
          vido_children: []
        },
        link: void 0,
        category: void 0
      };
      const menuLink = {
        id: 121,
        selected_by_default: false,
        parent_id: 12,
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
          display_mode: "large"
        },
        category: void 0
      };
      const category = {
        id: 122,
        selected_by_default: false,
        parent_id: 12,
        index_order: 1,
        menu_group: void 0,
        link: void 0,
        category: {
          name: {
            fr: "Leisure"
          },
          icon: "teritorio teritorio-bar",
          color_fill: "#284627",
          color_line: "#284627",
          style_class: [],
          style_merge: true,
          display_mode: "large",
          zoom: 14
        }
      };
      const defaultProps = {
        logoUrl: "",
        mainUrl: "",
        siteName: "",
        filters: {},
        isCategorySelected: () => false,
        categoriesActivesCountByParent: {},
        menuBlock: "MenuBlock"
      };
      const MenuMock = defineNuxtComponent({
        extends: Menu,
        computed: {
          menuItems() {
            return Object.fromEntries([
              search,
              menuGroup1,
              menuGroup2,
              menuLink,
              category
            ].map((i) => [
              i.id,
              i
            ]));
          }
        }
      });
      const props = {
        Default: {
          ...defaultProps
        }
      };
      const __returned__ = {
        search,
        menuGroup1,
        menuGroup2,
        menuLink,
        category,
        defaultProps,
        MenuMock,
        props
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
      title: "Home/Menu"
    }, {
      default: withCtx(() => [
        (openBlock(), createElementBlock(Fragment, null, renderList($setup.props, (p, name) => {
          return createVNode(_component_Variant, {
            key: name,
            title: name.replace(/([A-Z])/g, " $1").trim()
          }, {
            default: withCtx(() => [
              createVNode($setup["MenuMock"], normalizeProps(guardReactiveProps(p)), null, 16)
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
  _sfc_main.__file = "components/Home/Menu.story.vue";
  Menu_story = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Home/Menu.story.vue"
    ]
  ]);
});
export {
  __tla,
  Menu_story as default
};
