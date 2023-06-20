import { aL as defineStore, b6 as baseImageProps, as as _export_sfc, at as defineComponent, b7 as useImage, b8 as h, b9 as useBaseImage, ba as computed, bb as useHead, bc as getFileExtension, __tla as __tla_0 } from "./vendor-bd688624.js";
let UIPicture, favoritesStore;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
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
  const LOCAL_STORAGE = {
    favorites: "vido:favorites"
  };
  function setFavorites(state, payload) {
    state.favoritesIds = payload;
    if (!payload) {
      localStorage.removeItem(LOCAL_STORAGE.favorites);
    } else {
      localStorage.setItem(LOCAL_STORAGE.favorites, JSON.stringify({
        favorites: payload,
        version: 1
      }));
    }
  }
  favoritesStore = defineStore("favorites", {
    state: () => ({
      favoritesIds: []
    }),
    actions: {
      initFavoritesFromLocalStorage() {
        const local = localStorage.getItem(LOCAL_STORAGE.favorites);
        if (local) {
          this.setFavorites(JSON.parse(local).favorites);
        }
      },
      setFavorites(favorites) {
        setFavorites(this, favorites);
      },
      toggleFavorite(poi) {
        const props = _optionalChain([
          poi,
          "optionalAccess",
          (_) => _.properties
        ]);
        const id = _optionalChain([
          props,
          "optionalAccess",
          (_2) => _2.metadata,
          "optionalAccess",
          (_3) => _3.id
        ]) || _optionalChain([
          poi,
          "optionalAccess",
          (_4) => _4.id
        ]);
        let newFavorite;
        if (id) {
          if (!this.favoritesIds.includes(id)) {
            newFavorite = [
              ...this.favoritesIds,
              id
            ];
          } else {
            newFavorite = this.favoritesIds.filter((f) => `${f}` !== `${id}`);
          }
          setFavorites(this, newFavorite);
        }
      }
    },
    share: {
      enable: true
    }
  });
  const pictureProps = {
    ...baseImageProps,
    legacyFormat: {
      type: String,
      default: null
    },
    imgAttrs: {
      type: Object,
      default: null
    },
    mediaSize: {
      type: String,
      required: true
    }
  };
  const _sfc_main = defineComponent({
    name: "NuxtPicture",
    props: pictureProps,
    setup: (props, ctx) => {
      var _a, _b, _c;
      const $img = useImage();
      if (!$img) {
        return () => h("img", {
          src: props.src,
          ...props.imgAttrs
        });
      }
      const _base = useBaseImage(props);
      const isTransparent = computed(() => [
        "png",
        "webp",
        "gif"
      ].includes(originalFormat.value));
      const originalFormat = computed(() => getFileExtension(props.src));
      const format = computed(() => props.format || originalFormat.value === "svg" ? "svg" : "webp");
      const legacyFormat = computed(() => {
        if (props.legacyFormat) {
          return props.legacyFormat;
        }
        const formats = {
          webp: isTransparent.value ? "png" : "jpeg",
          svg: "png"
        };
        return formats[format.value] || originalFormat.value;
      });
      const nSources = computed(() => {
        if (format.value === "svg") {
          return [
            {
              srcset: props.src
            }
          ];
        }
        const formats = legacyFormat.value !== format.value ? [
          legacyFormat.value,
          format.value
        ] : [
          format.value
        ];
        return formats.map((format2) => {
          const { srcset, sizes, src } = $img.getSizes(props.src, {
            ..._base.options.value,
            sizes: props.sizes || $img.options.screens,
            modifiers: {
              ..._base.modifiers.value,
              format: format2
            }
          });
          return {
            src,
            type: `image/${format2}`,
            sizes,
            srcset
          };
        });
      });
      if (props.preload) {
        const srcKey = ((_a = nSources.value) == null ? void 0 : _a[1]) ? 1 : 0;
        const link = {
          rel: "preload",
          as: "image",
          imagesrcset: nSources.value[srcKey].srcset
        };
        if ((_c = (_b = nSources.value) == null ? void 0 : _b[srcKey]) == null ? void 0 : _c.sizes) {
          link.imagesizes = nSources.value[srcKey].sizes;
        }
        useHead({
          link: [
            link
          ]
        });
      }
      const imgAttrs = {
        ...props.imgAttrs
      };
      for (const key in ctx.attrs) {
        if (key in baseImageProps && !(key in imgAttrs)) {
          imgAttrs[key] = ctx.attrs[key];
        }
      }
      const srcDefault = nSources.value[0].srcset.split(" ")[0];
      return () => {
        var _a2;
        return h("picture", {
          key: nSources.value[0].src
        }, [
          ...((_a2 = nSources.value) == null ? void 0 : _a2[1]) ? [
            h("source", {
              type: nSources.value[1].type,
              sizes: props.mediaSize,
              srcset: nSources.value[1].srcset
            })
          ] : [],
          h("img", {
            ..._base.attrs.value,
            ...imgAttrs,
            src: srcDefault,
            sizes: props.mediaSize,
            srcset: nSources.value[0].srcset
          })
        ]);
      };
    }
  });
  _sfc_main.__file = "components/UI/UIPicture.vue";
  UIPicture = _export_sfc(_sfc_main, [
    [
      "__file",
      "/home/runner/work/vido/vido/components/UI/UIPicture.vue"
    ]
  ]);
});
export {
  UIPicture as U,
  __tla,
  favoritesStore as f
};
