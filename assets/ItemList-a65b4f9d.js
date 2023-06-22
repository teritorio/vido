import { aE as defineNuxtComponent, as as _export_sfc, au as resolveComponent, ax as openBlock, ay as createElementBlock, aA as Fragment, az as renderList, av as createBlock, aS as normalizeClass, aJ as createCommentVNode, __tla as __tla_0 } from "./vendor-cc850437.js";
import { C as Category, __tla as __tla_1 } from "./Category-78de97bd.js";
import { G as Group, __tla as __tla_2 } from "./Group-8205e9ba.js";
import { L as Link, __tla as __tla_3 } from "./Link-183b481b.js";
let ItemList;
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
  })()
]).then(async () => {
  const _sfc_main = defineNuxtComponent({
    components: {
      Category,
      MenuGroup: Group,
      LinkItem: Link
    },
    props: {
      menuItems: {
        type: Array,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
      categoriesActivesCountByParent: {
        type: Object,
        required: true
      },
      selectedCategoriesIds: {
        type: Array,
        required: true
      },
      displayModeDefault: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: true
      }
    },
    emits: {
      "menu-group-click": (menuItemId) => true,
      "category-click": (menuItemId) => true,
      "filter-click": (categoryId) => true
    },
    methods: {
      onMenuGroupClick(menuItem) {
        this.$emit("menu-group-click", menuItem.id);
      },
      onCategoryClick(menuItem) {
        this.$emit("category-click", menuItem.id);
      },
      onFilterClick(categoryId) {
        this.$emit("filter-click", categoryId);
      },
      isCategorySelected(categoryId) {
        return this.selectedCategoriesIds.includes(categoryId);
      }
    }
  });
  const _hoisted_1 = {
    class: "tw-grid tw-items-start tw-grid-cols-4"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_MenuGroup = resolveComponent("MenuGroup");
    const _component_LinkItem = resolveComponent("LinkItem");
    const _component_Category = resolveComponent("Category");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.menuItems, (menuItem) => {
        return openBlock(), createElementBlock(Fragment, {
          key: menuItem.id
        }, [
          menuItem.menu_group ? (openBlock(), createBlock(_component_MenuGroup, {
            key: 0,
            "menu-group": menuItem,
            "categories-actives-count": _ctx.categoriesActivesCountByParent[menuItem.id],
            size: _ctx.size,
            "display-mode-default": _ctx.displayModeDefault,
            class: normalizeClass((menuItem.menu_group.display_mode || _ctx.displayModeDefault) === "large" && [
              "tw-col-start-1 tw-col-span-4"
            ]),
            onClick: ($event) => _ctx.onMenuGroupClick(menuItem)
          }, null, 8, [
            "menu-group",
            "categories-actives-count",
            "size",
            "display-mode-default",
            "class",
            "onClick"
          ])) : menuItem.link ? (openBlock(), createBlock(_component_LinkItem, {
            key: 1,
            "menu-link": menuItem,
            size: _ctx.size,
            "display-mode-default": _ctx.displayModeDefault,
            class: normalizeClass((menuItem.link.display_mode || _ctx.displayModeDefault) === "large" && [
              "tw-col-start-1 tw-col-span-4"
            ])
          }, null, 8, [
            "menu-link",
            "size",
            "display-mode-default",
            "class"
          ])) : menuItem.category ? (openBlock(), createBlock(_component_Category, {
            key: 2,
            category: menuItem,
            selected: _ctx.isCategorySelected(menuItem.id),
            filters: _ctx.filters[menuItem.id],
            size: _ctx.size,
            "display-mode-default": _ctx.displayModeDefault,
            class: normalizeClass((menuItem.category.display_mode || _ctx.displayModeDefault) === "large" && [
              "tw-col-start-1 tw-col-span-4"
            ]),
            onClick: ($event) => _ctx.onCategoryClick(menuItem),
            onFilterClick: _cache[0] || (_cache[0] = ($event) => _ctx.onFilterClick($event))
          }, null, 8, [
            "category",
            "selected",
            "filters",
            "size",
            "display-mode-default",
            "class",
            "onClick"
          ])) : createCommentVNode("v-if", true)
        ], 64);
      }), 128))
    ]);
  }
  _sfc_main.__file = "components/Menu/ItemList.vue";
  ItemList = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/components/Menu/ItemList.vue"
    ]
  ]);
});
export {
  ItemList as I,
  __tla
};
