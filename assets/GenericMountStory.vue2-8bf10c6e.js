import { S as defineAsyncComponent, _ as __vitePreload, U as Comp22, V as markRaw, E as reactive, d as defineComponent, r as ref, W as watchEffect, o as openBlock, q as createBlock, X as mergeProps, Y as resolveDynamicComponent, h as createCommentVNode, __tla as __tla_0 } from "./vendor-c1ea6bed.js";
import { c as clientSupportPlugins, __tla as __tla_1 } from "./__resolved__virtual__histoire-support-plugins-client-a1be9f4e.js";
let _sfc_main, files, mapFile, tree;
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
  const Comp0 = defineAsyncComponent(() => __vitePreload(() => import("./DateRange.story-ed6711d4.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/DateRange.story-ed6711d4.js","assets/vendor-c1ea6bed.js","assets/DateRange-3b4e79b8.js"] : void 0));
  const Comp1 = defineAsyncComponent(() => __vitePreload(() => import("./Field.story-2f44a9a3.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Field.story-2f44a9a3.js","assets/vendor-c1ea6bed.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js"] : void 0));
  const Comp2 = defineAsyncComponent(() => __vitePreload(() => import("./Phone.story-f4a64ecb.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Phone.story-f4a64ecb.js","assets/vendor-c1ea6bed.js","assets/Phone-6bb6952c.js"] : void 0));
  const Comp3 = defineAsyncComponent(() => __vitePreload(() => import("./RoutesField.story-5f1aaf95.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/RoutesField.story-5f1aaf95.js","assets/vendor-c1ea6bed.js","assets/RoutesField-3282d8e6.js","assets/property-translations-98d98cd7.js"] : void 0));
  const Comp4 = defineAsyncComponent(() => __vitePreload(() => import("./Stars.story-09721a17.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Stars.story-09721a17.js","assets/vendor-c1ea6bed.js","assets/Stars-af26ac92.js"] : void 0));
  const Comp5 = defineAsyncComponent(() => __vitePreload(() => import("./DateRange.story-97c538a2.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/DateRange.story-97c538a2.js","assets/vendor-c1ea6bed.js","assets/DateRange-af1e4fdc.js","assets/types-filters-1e0221da.js"] : void 0));
  const Comp6 = defineAsyncComponent(() => __vitePreload(() => import("./NumberRange.story-89892134.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/NumberRange.story-89892134.js","assets/vendor-c1ea6bed.js","assets/NumberRange-ebb913ba.js","assets/types-filters-1e0221da.js"] : void 0));
  const Comp7 = defineAsyncComponent(() => __vitePreload(() => import("./Select.story-5f67fe19.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Select.story-5f67fe19.js","assets/vendor-c1ea6bed.js","assets/Select-aa414f48.js","assets/types-filters-1e0221da.js"] : void 0));
  const Comp8 = defineAsyncComponent(() => __vitePreload(() => import("./Menu.story-df1c76ac.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Menu.story-df1c76ac.js","assets/vendor-c1ea6bed.js","assets/DateRange-af1e4fdc.js","assets/NumberRange-ebb913ba.js","assets/Select-aa414f48.js","assets/types-filters-1e0221da.js","assets/ItemList-d766addf.js","assets/Category-0f8a4bcf.js","assets/Item-3f7eb06b.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js","assets/Group-24fa2fb3.js","assets/Link-70d795a1.js","assets/types-f83cf40c.js"] : void 0));
  const Comp9 = defineAsyncComponent(() => __vitePreload(() => import("./Category.story-ba8585c6.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Category.story-ba8585c6.js","assets/vendor-c1ea6bed.js","assets/Category-0f8a4bcf.js","assets/Item-3f7eb06b.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js","assets/types-filters-1e0221da.js"] : void 0));
  const Comp10 = defineAsyncComponent(() => __vitePreload(() => import("./Group.story-16b86058.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Group.story-16b86058.js","assets/vendor-c1ea6bed.js","assets/Group-24fa2fb3.js","assets/Item-3f7eb06b.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js"] : void 0));
  const Comp11 = defineAsyncComponent(() => __vitePreload(() => import("./ItemList.story-f3284c23.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/ItemList.story-f3284c23.js","assets/vendor-c1ea6bed.js","assets/ItemList-d766addf.js","assets/Category-0f8a4bcf.js","assets/Item-3f7eb06b.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js","assets/types-filters-1e0221da.js","assets/Group-24fa2fb3.js","assets/Link-70d795a1.js"] : void 0));
  const Comp12 = defineAsyncComponent(() => __vitePreload(() => import("./Link.story-b30b6117.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Link.story-b30b6117.js","assets/vendor-c1ea6bed.js","assets/Link-70d795a1.js","assets/Item-3f7eb06b.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js"] : void 0));
  const Comp13 = defineAsyncComponent(() => __vitePreload(() => import("./Fields.story-72906604.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/Fields.story-72906604.js","assets/vendor-c1ea6bed.js","assets/Fields-d1e8f5a6.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js"] : void 0));
  const Comp14 = defineAsyncComponent(() => __vitePreload(() => import("./PoiCard.story-5ee27ec3.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/PoiCard.story-5ee27ec3.js","assets/vendor-c1ea6bed.js","assets/PoiCard-174df7dc.js","assets/Fields-d1e8f5a6.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js","assets/FavoriteIcon-ea848d4f.js","assets/TeritorioIcon-e896869c.js","assets/UIPicture-f40f3c38.js","assets/types-f83cf40c.js","assets/2-8524393d.js"] : void 0));
  const Comp15 = defineAsyncComponent(() => __vitePreload(() => import("./PoiCardLight.story-8891553f.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/PoiCardLight.story-8891553f.js","assets/vendor-c1ea6bed.js","assets/PoiCardLight-59053318.js","assets/Fields-d1e8f5a6.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js","assets/TeritorioIconBadge-a9ef080f.js","assets/TeritorioIcon-e896869c.js","assets/UIPicture-f40f3c38.js","assets/2-8524393d.js"] : void 0));
  const Comp16 = defineAsyncComponent(() => __vitePreload(() => import("./PoisDeck.story-7f257219.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/PoisDeck.story-7f257219.js","assets/vendor-c1ea6bed.js","assets/PoiCard-174df7dc.js","assets/Fields-d1e8f5a6.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js","assets/FavoriteIcon-ea848d4f.js","assets/TeritorioIcon-e896869c.js","assets/UIPicture-f40f3c38.js","assets/types-f83cf40c.js","assets/PoiCardLight-59053318.js","assets/TeritorioIconBadge-a9ef080f.js"] : void 0));
  const Comp17 = defineAsyncComponent(() => __vitePreload(() => import("./FieldsGroup.story-83a5f381.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/FieldsGroup.story-83a5f381.js","assets/vendor-c1ea6bed.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js"] : void 0));
  const Comp18 = defineAsyncComponent(() => __vitePreload(() => import("./PoisTable.story-8d854378.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/PoisTable.story-8d854378.js","assets/vendor-c1ea6bed.js","assets/Field-e70efc06.js","assets/Phone-6bb6952c.js","assets/DateRange-3b4e79b8.js","assets/property-translations-98d98cd7.js","assets/RoutesField-3282d8e6.js","assets/Stars-af26ac92.js"] : void 0));
  const Comp19 = defineAsyncComponent(() => __vitePreload(() => import("./FavoriteIcon.story-e3acbb1d.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/FavoriteIcon.story-e3acbb1d.js","assets/vendor-c1ea6bed.js","assets/FavoriteIcon-ea848d4f.js"] : void 0));
  const Comp20 = defineAsyncComponent(() => __vitePreload(() => import("./IconButton.story-328b2369.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/IconButton.story-328b2369.js","assets/vendor-c1ea6bed.js"] : void 0));
  const Comp21 = defineAsyncComponent(() => __vitePreload(() => import("./TeritorioIcon.story-82367b26.js").then(async (m) => {
    await m.__tla;
    return m;
  }), true ? ["assets/TeritorioIcon.story-82367b26.js","assets/vendor-c1ea6bed.js","assets/TeritorioIcon-e896869c.js"] : void 0));
  files = [
    {
      "id": "components-fields-daterange-story-vue",
      "path": [
        "Fields",
        "DateRange"
      ],
      "filePath": "components/Fields/DateRange.story.vue",
      "story": {
        "id": "components-fields-daterange-story-vue",
        "title": "DateRange",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-fields-daterange-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-daterange-story-vue-1",
            "title": "Default Start",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-daterange-story-vue-2",
            "title": "Default End",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-daterange-story-vue-3",
            "title": "Default Same",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 0,
      component: Comp0,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-fields-daterange-story-vue-52a3edb1.js"), true ? [] : void 0)
    },
    {
      "id": "components-fields-field-story-vue",
      "path": [
        "Fields",
        "Field"
      ],
      "filePath": "components/Fields/Field.story.vue",
      "story": {
        "id": "components-fields-field-story-vue",
        "title": "Field",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-fields-field-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-1",
            "title": "Default List One",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-2",
            "title": "Default List Many",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-3",
            "title": "No Value",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-4",
            "title": "Label",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-5",
            "title": "Start End Date",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-6",
            "title": "Addr",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-7",
            "title": "Description",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-8",
            "title": "Description Short",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-9",
            "title": "Description Details",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-10",
            "title": "Email",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-11",
            "title": "Website",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-12",
            "title": "Facebook",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-13",
            "title": "Instagram",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-14",
            "title": "Route Gpx Trace",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-15",
            "title": "Route Pdf",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-16",
            "title": "Download",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-field-story-vue-17",
            "title": "Coordinates",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 1,
      component: Comp1,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-fields-field-story-vue-ab8fff04.js"), true ? [] : void 0)
    },
    {
      "id": "components-fields-phone-story-vue",
      "path": [
        "Fields",
        "Phone"
      ],
      "filePath": "components/Fields/Phone.story.vue",
      "story": {
        "id": "components-fields-phone-story-vue",
        "title": "Phone",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-fields-phone-story-vue-0",
            "title": "Default - desktop",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-phone-story-vue-1",
            "title": "Default - mobile",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 2,
      component: Comp2,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-fields-phone-story-vue-4f2e0ec7.js"), true ? [] : void 0)
    },
    {
      "id": "components-fields-routesfield-story-vue",
      "path": [
        "Fields",
        "Route"
      ],
      "filePath": "components/Fields/RoutesField.story.vue",
      "story": {
        "id": "components-fields-routesfield-story-vue",
        "title": "Route",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-fields-routesfield-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-routesfield-story-vue-1",
            "title": "Missing Fields",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-routesfield-story-vue-2",
            "title": "Missing Difficulty",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 3,
      component: Comp3,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-fields-routesfield-story-vue-7f8e1160.js"), true ? [] : void 0)
    },
    {
      "id": "components-fields-stars-story-vue",
      "path": [
        "Fields",
        "Stars"
      ],
      "filePath": "components/Fields/Stars.story.vue",
      "story": {
        "id": "components-fields-stars-story-vue",
        "title": "Stars",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-fields-stars-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-stars-story-vue-1",
            "title": "More",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-fields-stars-story-vue-2",
            "title": "None",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 4,
      component: Comp4,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-fields-stars-story-vue-8cd5c85c.js"), true ? [] : void 0)
    },
    {
      "id": "components-filters-daterange-story-vue",
      "path": [
        "Filters",
        "DateRange"
      ],
      "filePath": "components/Filters/DateRange.story.vue",
      "story": {
        "id": "components-filters-daterange-story-vue",
        "title": "DateRange",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-filters-daterange-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 5,
      component: Comp5,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-filters-daterange-story-vue-d5f0af00.js"), true ? [] : void 0)
    },
    {
      "id": "components-filters-numberrange-story-vue",
      "path": [
        "Filters",
        "NumberRange"
      ],
      "filePath": "components/Filters/NumberRange.story.vue",
      "story": {
        "id": "components-filters-numberrange-story-vue",
        "title": "NumberRange",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-filters-numberrange-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 6,
      component: Comp6,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-filters-numberrange-story-vue-9e2bbfe0.js"), true ? [] : void 0)
    },
    {
      "id": "components-filters-select-story-vue",
      "path": [
        "Filters",
        "Select"
      ],
      "filePath": "components/Filters/Select.story.vue",
      "story": {
        "id": "components-filters-select-story-vue",
        "title": "Select",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-filters-select-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 7,
      component: Comp7,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-filters-select-story-vue-7b21916d.js"), true ? [] : void 0)
    },
    {
      "id": "components-home-menu-story-vue",
      "path": [
        "Home",
        "Menu"
      ],
      "filePath": "components/Home/Menu.story.vue",
      "story": {
        "id": "components-home-menu-story-vue",
        "title": "Menu",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-home-menu-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 8,
      component: Comp8,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-home-menu-story-vue-d2c4691f.js"), true ? [] : void 0)
    },
    {
      "id": "components-menu-category-story-vue",
      "path": [
        "Menu",
        "Category"
      ],
      "filePath": "components/Menu/Category.story.vue",
      "story": {
        "id": "components-menu-category-story-vue",
        "title": "Category",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-menu-category-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-category-story-vue-1",
            "title": "Selected",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-category-story-vue-2",
            "title": "Default Compact",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-category-story-vue-3",
            "title": "Selected Compact",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 9,
      component: Comp9,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-menu-category-story-vue-506452e4.js"), true ? [] : void 0)
    },
    {
      "id": "components-menu-group-story-vue",
      "path": [
        "Menu",
        "Group"
      ],
      "filePath": "components/Menu/Group.story.vue",
      "story": {
        "id": "components-menu-group-story-vue",
        "title": "Group",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-menu-group-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-group-story-vue-1",
            "title": "Large",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-group-story-vue-2",
            "title": "Activities",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-group-story-vue-3",
            "title": "Activities Large",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-group-story-vue-4",
            "title": "Edge Cases",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 10,
      component: Comp10,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-menu-group-story-vue-f6f05ae4.js"), true ? [] : void 0)
    },
    {
      "id": "components-menu-itemlist-story-vue",
      "path": [
        "Menu",
        "ItemList"
      ],
      "filePath": "components/Menu/ItemList.story.vue",
      "story": {
        "id": "components-menu-itemlist-story-vue",
        "title": "ItemList",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-menu-itemlist-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-itemlist-story-vue-1",
            "title": "Large",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-itemlist-story-vue-2",
            "title": "Many Groups",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 11,
      component: Comp11,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-menu-itemlist-story-vue-46026dc1.js"), true ? [] : void 0)
    },
    {
      "id": "components-menu-link-story-vue",
      "path": [
        "Menu",
        "Link"
      ],
      "filePath": "components/Menu/Link.story.vue",
      "story": {
        "id": "components-menu-link-story-vue",
        "title": "Link",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-menu-link-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-menu-link-story-vue-1",
            "title": "Large",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 12,
      component: Comp12,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-menu-link-story-vue-7aa14ec1.js"), true ? [] : void 0)
    },
    {
      "id": "components-poiscard-fields-story-vue",
      "path": [
        "PoisCard",
        "Fields"
      ],
      "filePath": "components/PoisCard/Fields.story.vue",
      "story": {
        "id": "components-poiscard-fields-story-vue",
        "title": "Fields",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poiscard-fields-story-vue-0",
            "title": "Default Empty",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poiscard-fields-story-vue-1",
            "title": "Many",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 13,
      component: Comp13,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poiscard-fields-story-vue-263b2753.js"), true ? [] : void 0)
    },
    {
      "id": "components-poiscard-poicard-story-vue",
      "path": [
        "PoisCard",
        "PoiCard"
      ],
      "filePath": "components/PoisCard/PoiCard.story.vue",
      "story": {
        "id": "components-poiscard-poicard-story-vue",
        "title": "PoiCard",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poiscard-poicard-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 14,
      component: Comp14,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poiscard-poicard-story-vue-c89e3932.js"), true ? [] : void 0)
    },
    {
      "id": "components-poiscard-poicardlight-story-vue",
      "path": [
        "PoisCard",
        "PoiCardLight"
      ],
      "filePath": "components/PoisCard/PoiCardLight.story.vue",
      "story": {
        "id": "components-poiscard-poicardlight-story-vue",
        "title": "PoiCardLight",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poiscard-poicardlight-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 15,
      component: Comp15,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poiscard-poicardlight-story-vue-c525b54e.js"), true ? [] : void 0)
    },
    {
      "id": "components-poiscard-poisdeck-story-vue",
      "path": [
        "PoisCard",
        "PoisDeck"
      ],
      "filePath": "components/PoisCard/PoisDeck.story.vue",
      "story": {
        "id": "components-poiscard-poisdeck-story-vue",
        "title": "PoisDeck",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poiscard-poisdeck-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poiscard-poisdeck-story-vue-1",
            "title": "Light",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 16,
      component: Comp16,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poiscard-poisdeck-story-vue-fb73b3a8.js"), true ? [] : void 0)
    },
    {
      "id": "components-poisdetails-fieldsgroup-story-vue",
      "path": [
        "PoisDetails",
        "FieldsGroup"
      ],
      "filePath": "components/PoisDetails/FieldsGroup.story.vue",
      "story": {
        "id": "components-poisdetails-fieldsgroup-story-vue",
        "title": "FieldsGroup",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poisdetails-fieldsgroup-story-vue-0",
            "title": "Sandart",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poisdetails-fieldsgroup-story-vue-1",
            "title": "Empty",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poisdetails-fieldsgroup-story-vue-2",
            "title": "Label",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poisdetails-fieldsgroup-story-vue-3",
            "title": "Card",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-poisdetails-fieldsgroup-story-vue-4",
            "title": "Many",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 17,
      component: Comp17,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poisdetails-fieldsgroup-story-vue-50b6ba58.js"), true ? [] : void 0)
    },
    {
      "id": "components-poislist-poistable-story-vue",
      "path": [
        "PoisList",
        "PoisTable"
      ],
      "filePath": "components/PoisList/PoisTable.story.vue",
      "story": {
        "id": "components-poislist-poistable-story-vue",
        "title": "PoisTable",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-poislist-poistable-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 18,
      component: Comp18,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-poislist-poistable-story-vue-1f6c99a5.js"), true ? [] : void 0)
    },
    {
      "id": "components-ui-favoriteicon-story-vue",
      "path": [
        "UI",
        "FavoriteIcon"
      ],
      "filePath": "components/UI/FavoriteIcon.story.vue",
      "story": {
        "id": "components-ui-favoriteicon-story-vue",
        "title": "FavoriteIcon",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-ui-favoriteicon-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-favoriteicon-story-vue-1",
            "title": "Active",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-favoriteicon-story-vue-2",
            "title": "Colored",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 19,
      component: Comp19,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-ui-favoriteicon-story-vue-7dce0864.js"), true ? [] : void 0)
    },
    {
      "id": "components-ui-iconbutton-story-vue",
      "path": [
        "UI",
        "IconButton"
      ],
      "filePath": "components/UI/IconButton.story.vue",
      "story": {
        "id": "components-ui-iconbutton-story-vue",
        "title": "IconButton",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-ui-iconbutton-story-vue-0",
            "title": "Default Button",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-iconbutton-story-vue-1",
            "title": "Default Link",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 20,
      component: Comp20,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-ui-iconbutton-story-vue-6918a081.js"), true ? [] : void 0)
    },
    {
      "id": "components-ui-teritorioicon-story-vue",
      "path": [
        "UI",
        "TeritorioIcon"
      ],
      "filePath": "components/UI/TeritorioIcon.story.vue",
      "story": {
        "id": "components-ui-teritorioicon-story-vue",
        "title": "TeritorioIcon",
        "group": null,
        "layout": {
          "type": "grid",
          "width": "100%"
        },
        "icon": null,
        "iconColor": null,
        "docsOnly": false,
        "variants": [
          {
            "id": "components-ui-teritorioicon-story-vue-0",
            "title": "Default",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-teritorioicon-story-vue-1",
            "title": "Text Color",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-teritorioicon-story-vue-2",
            "title": "Fontawesome",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-teritorioicon-story-vue-3",
            "title": "Fontawesome Text Color",
            "icon": null,
            "iconColor": null
          },
          {
            "id": "components-ui-teritorioicon-story-vue-4",
            "title": "Image",
            "icon": null,
            "iconColor": null
          }
        ]
      },
      "supportPluginId": "vue3",
      "index": 21,
      component: Comp21,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_components-ui-teritorioicon-story-vue-f53de737.js"), true ? [] : void 0)
    },
    {
      "id": "tailwind",
      "path": [
        "Tailwind"
      ],
      "filePath": "/home/runner/work/vido/vido/node_modules/.histoire/plugins/builtin_tailwind-tokens/Tailwind.story.js",
      "story": {
        "id": "tailwind",
        "title": "Tailwind",
        "group": "design-system",
        "layout": {
          "type": "single",
          "iframe": false
        },
        "icon": "mdi:tailwind",
        "docsOnly": false,
        "variants": [
          {
            "id": "background-color",
            "title": "Background Color",
            "icon": "carbon:color-palette"
          },
          {
            "id": "text-color",
            "title": "Text Color",
            "icon": "carbon:text-color"
          },
          {
            "id": "border-color",
            "title": "Border Color",
            "icon": "carbon:color-palette"
          },
          {
            "id": "padding",
            "title": "Padding",
            "icon": "carbon:area"
          },
          {
            "id": "margin",
            "title": "Margin",
            "icon": "carbon:area"
          },
          {
            "id": "font-size",
            "title": "Font Size",
            "icon": "carbon:text-font"
          },
          {
            "id": "font-weight",
            "title": "Font Weight",
            "icon": "carbon:text-font"
          },
          {
            "id": "font-family",
            "title": "Font Family",
            "icon": "carbon:text-font"
          },
          {
            "id": "letter-spacing",
            "title": "Letter Spacing",
            "icon": "carbon:text-font"
          },
          {
            "id": "line-height",
            "title": "Line Height",
            "icon": "carbon:text-font"
          },
          {
            "id": "drop-shadow",
            "title": "Drop Shadow",
            "icon": "carbon:shape-except"
          },
          {
            "id": "border-radius",
            "title": "Border Radius",
            "icon": "carbon:condition-wait-point"
          },
          {
            "id": "border-width",
            "title": "Border Width",
            "icon": "carbon:checkbox"
          },
          {
            "id": "width",
            "title": "Width",
            "icon": "carbon:pan-horizontal"
          },
          {
            "id": "height",
            "title": "Height",
            "icon": "carbon:pan-vertical"
          },
          {
            "id": "full-config",
            "title": "Full Config",
            "icon": "carbon:code"
          }
        ]
      },
      "supportPluginId": "vanilla",
      "index": 22,
      component: Comp22,
      source: () => __vitePreload(() => import("./__resolved__virtual_story-source_tailwind-89f7c735.js"), true ? [] : void 0)
    }
  ];
  tree = [
    {
      "group": true,
      "id": "design-system",
      "title": "Design System",
      "children": [
        {
          "title": "Tailwind",
          "index": 22
        }
      ]
    },
    {
      "title": "Fields",
      "children": [
        {
          "title": "DateRange",
          "index": 0
        },
        {
          "title": "Field",
          "index": 1
        },
        {
          "title": "Phone",
          "index": 2
        },
        {
          "title": "Route",
          "index": 3
        },
        {
          "title": "Stars",
          "index": 4
        }
      ]
    },
    {
      "title": "Filters",
      "children": [
        {
          "title": "DateRange",
          "index": 5
        },
        {
          "title": "NumberRange",
          "index": 6
        },
        {
          "title": "Select",
          "index": 7
        }
      ]
    },
    {
      "title": "Home",
      "children": [
        {
          "title": "Menu",
          "index": 8
        }
      ]
    },
    {
      "title": "Menu",
      "children": [
        {
          "title": "Category",
          "index": 9
        },
        {
          "title": "Group",
          "index": 10
        },
        {
          "title": "ItemList",
          "index": 11
        },
        {
          "title": "Link",
          "index": 12
        }
      ]
    },
    {
      "title": "PoisCard",
      "children": [
        {
          "title": "Fields",
          "index": 13
        },
        {
          "title": "PoiCard",
          "index": 14
        },
        {
          "title": "PoiCardLight",
          "index": 15
        },
        {
          "title": "PoisDeck",
          "index": 16
        }
      ]
    },
    {
      "title": "PoisDetails",
      "children": [
        {
          "title": "FieldsGroup",
          "index": 17
        }
      ]
    },
    {
      "title": "PoisList",
      "children": [
        {
          "title": "PoisTable",
          "index": 18
        }
      ]
    },
    {
      "title": "UI",
      "children": [
        {
          "title": "FavoriteIcon",
          "index": 19
        },
        {
          "title": "IconButton",
          "index": 20
        },
        {
          "title": "TeritorioIcon",
          "index": 21
        }
      ]
    }
  ];
  const copiedFromExistingVariant = [
    "state",
    "slots",
    "source",
    "responsiveDisabled",
    "autoPropsDisabled",
    "setupApp",
    "configReady",
    "previewReady"
  ];
  mapFile = function(file, existingFile) {
    let result;
    if (existingFile) {
      result = existingFile;
      for (const key in file) {
        if (key === "story") {
          result.story = {
            ...result.story,
            ...file.story,
            file: markRaw(result),
            variants: file.story.variants.map((v) => mapVariant(v, existingFile.story.variants.find((item) => item.id === v.id)))
          };
        } else if (key !== "component") {
          result[key] = file[key];
        }
      }
    } else {
      result = {
        ...file,
        component: markRaw(file.component),
        story: {
          ...file.story,
          title: file.story.title,
          file: markRaw(file),
          variants: file.story.variants.map((v) => mapVariant(v)),
          slots: () => ({})
        }
      };
    }
    return result;
  };
  function mapVariant(variant, existingVariant) {
    let result;
    if (existingVariant) {
      result = existingVariant;
      for (const key in variant) {
        if (!copiedFromExistingVariant.includes(key)) {
          result[key] = variant[key];
        }
      }
    } else {
      result = {
        ...variant,
        state: reactive({
          _hPropState: {},
          _hPropDefs: {}
        }),
        setupApp: null,
        slots: () => ({}),
        previewReady: false
      };
    }
    return result;
  }
  const __default__ = {
    inheritAttrs: false
  };
  _sfc_main = defineComponent({
    ...__default__,
    __name: "GenericMountStory",
    props: {
      story: null
    },
    setup(__props) {
      const props = __props;
      const mountComponent = ref(null);
      watchEffect(async () => {
        var _a;
        const clientPlugin = clientSupportPlugins[(_a = props.story.file) == null ? void 0 : _a.supportPluginId];
        if (clientPlugin) {
          const pluginModule = await clientPlugin();
          mountComponent.value = markRaw(pluginModule.MountStory);
        }
      });
      return (_ctx, _cache) => {
        return mountComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(mountComponent.value), mergeProps({
          key: 0,
          class: "histoire-generic-mount-story",
          story: __props.story
        }, _ctx.$attrs), null, 16, [
          "story"
        ])) : createCommentVNode("", true);
      };
    }
  });
});
export {
  _sfc_main as _,
  __tla,
  files as f,
  mapFile as m,
  tree as t
};
