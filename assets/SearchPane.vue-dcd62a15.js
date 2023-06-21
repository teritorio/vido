import { d as defineComponent, o as openBlock, e as createElementBlock, Z as renderSlot, n as normalizeClass, m as withKeys, c as computed, a as unref, q as createBlock, I as Icon, f as createVNode, g as createBaseVNode, z as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, r as ref, a6 as toRefs, a8 as useRouter, w as withCtx, V as markRaw, k as watch, bf as useFocus, bg as refDebounced, y as withDirectives, ab as vModelText, a1 as withModifiers, _ as __vitePreload, bh as flexsearch_bundleExports, __tla as __tla_0 } from "./vendor-ec6df5a6.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink, a as useStoryStore, __tla as __tla_1 } from "./MobileOverlay.vue2-9ee3486c.js";
import { B as BaseEmpty, __tla as __tla_2 } from "./BaseEmpty.vue-13015f26.js";
import { o as onKeyboardShortcut, u as useCommandStore, __tla as __tla_3 } from "./bundle-main-427f68c0.js";
import { __tla as __tla_4 } from "./__resolved__virtual__histoire-support-plugins-client-653ca2b1.js";
import { __tla as __tla_5 } from "./GenericMountStory.vue2-0b8efc3d.js";
import "./config-23d2cc81.js";
let _sfc_main;
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
  })()
]).then(async () => {
  function pipeline(a, b, c, d) {
    if (a && (b && (a = replace(a, b)), this.matcher && (a = replace(a, this.matcher)), this.stemmer && 1 < a.length && (a = replace(a, this.stemmer)), d && 1 < a.length && (a = collapse(a)), c || "" === c)) {
      const b2 = a.split(c);
      return this.filter ? filter$1(b2, this.filter) : b2;
    }
    return a;
  }
  const regex_whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
  const regex_normalize = /[\u0300-\u036f]/g;
  function normalize(a) {
    return a.normalize && (a = a.normalize("NFD").replace(regex_normalize, "")), a;
  }
  function replace(a, b) {
    for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), !!a); c += 2)
      ;
    return a;
  }
  function regex(a) {
    return new RegExp(a, "g");
  }
  function collapse(a) {
    let b = "", c = "";
    for (let d, e = 0, f = a.length; e < f; e++)
      (d = a[e]) !== c && (b += c = d);
    return b;
  }
  function filter$1(a, b) {
    const c = a.length, d = [];
    for (let e = 0, f = 0; e < c; e++) {
      const c2 = a[e];
      c2 && !b[c2] && (d[f++] = c2);
    }
    return d;
  }
  const regex_a = regex("[\xE0\xE1\xE2\xE3\xE4\xE5]"), regex_e = regex("[\xE8\xE9\xEA\xEB]"), regex_i = regex("[\xEC\xED\xEE\xEF]"), regex_o = regex("[\xF2\xF3\xF4\xF5\xF6\u0151]"), regex_u = regex("[\xF9\xFA\xFB\xFC\u0171]"), regex_y = regex("[\xFD\u0177\xFF]"), regex_n = regex("\xF1"), regex_c = regex("[\xE7c]"), regex_s = regex("\xDF"), regex_and = regex(" & "), pairs$1 = [
    regex_a,
    "a",
    regex_e,
    "e",
    regex_i,
    "i",
    regex_o,
    "o",
    regex_u,
    "u",
    regex_y,
    "y",
    regex_n,
    "n",
    regex_c,
    "k",
    regex_s,
    "s",
    regex_and,
    " and "
  ];
  function encode$2(a) {
    return a = "" + a, pipeline.call(this, normalize(a).toLowerCase(), !a.normalize && pairs$1, regex_whitespace, false);
  }
  const regex_strip = /[^a-z0-9]+/, soundex = {
    b: "p",
    v: "f",
    w: "f",
    z: "s",
    x: "s",
    \u00DF: "s",
    d: "t",
    n: "m",
    c: "k",
    g: "k",
    j: "k",
    q: "k",
    i: "e",
    y: "e",
    u: "o"
  };
  function encode$1(a) {
    a = encode$2.call(this, a).join(" ");
    const b = [];
    if (a) {
      const c = a.split(regex_strip), d = c.length;
      for (let e, f = 0, g = 0; f < d; f++)
        if ((a = c[f]) && (!this.filter || !this.filter[a])) {
          e = a[0];
          let c2 = soundex[e] || e, d2 = c2;
          for (let b2 = 1; b2 < a.length; b2++) {
            e = a[b2];
            const f2 = soundex[e] || e;
            f2 && f2 !== d2 && (c2 += f2, d2 = f2);
          }
          b[g++] = c2;
        }
    }
    return b;
  }
  const charset = {
    encode,
    rtl: false,
    tokenize: ""
  };
  const regex_ae = regex("ae"), regex_oe = regex("oe"), regex_sh = regex("sh"), regex_th = regex("th"), regex_ph = regex("ph"), regex_pf = regex("pf"), pairs = [
    regex_ae,
    "a",
    regex_oe,
    "o",
    regex_sh,
    "s",
    regex_th,
    "t",
    regex_ph,
    "f",
    regex_pf,
    "f",
    regex("(?![aeo])h(?![aeo])"),
    "",
    regex("(?!^[aeo])h(?!^[aeo])"),
    ""
  ];
  function encode(a, b) {
    return a && (a = encode$1.call(this, a).join(" "), 2 < a.length && (a = replace(a, pairs)), !b && (1 < a.length && (a = collapse(a)), a && (a = a.split(" ")))), a;
  }
  const filter = [
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "also",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "both",
    "but",
    "by",
    "can",
    "cannot",
    "can't",
    "come",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "dont",
    "down",
    "during",
    "each",
    "even",
    "few",
    "first",
    "for",
    "from",
    "further",
    "get",
    "go",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "hed",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "hes",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "id",
    "if",
    "ill",
    "im",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
    "itself",
    "i've",
    "just",
    "know",
    "let's",
    "like",
    "make",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "new",
    "no",
    "nor",
    "not",
    "now",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "our's",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "say",
    "see",
    "shan't",
    "she",
    "she'd",
    "shell",
    "shes",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "time",
    "to",
    "too",
    "until",
    "up",
    "us",
    "very",
    "want",
    "was",
    "wasn't",
    "way",
    "we",
    "wed",
    "well",
    "were",
    "weren't",
    "we've",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "whom",
    "who's",
    "why",
    "why's",
    "will",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "your",
    "you're",
    "your's",
    "yourself",
    "yourselves",
    "you've"
  ];
  const stemmer = {
    ational: "ate",
    iveness: "ive",
    fulness: "ful",
    ousness: "ous",
    ization: "ize",
    tional: "tion",
    biliti: "ble",
    icate: "ic",
    ative: "",
    alize: "al",
    iciti: "ic",
    entli: "ent",
    ousli: "ous",
    alism: "al",
    ation: "ate",
    aliti: "al",
    iviti: "ive",
    ement: "",
    enci: "ence",
    anci: "ance",
    izer: "ize",
    alli: "al",
    ator: "ate",
    logi: "log",
    ical: "ic",
    ance: "",
    ence: "",
    ness: "",
    able: "",
    ible: "",
    ment: "",
    eli: "e",
    bli: "ble",
    ful: "",
    ant: "",
    ent: "",
    ism: "",
    ate: "",
    iti: "",
    ous: "",
    ive: "",
    ize: "",
    al: "",
    ou: "",
    er: "",
    ic: ""
  };
  const matcher = {};
  const language = {
    filter,
    stemmer,
    matcher
  };
  const _sfc_main$4 = defineComponent({
    __name: "BaseListItem",
    props: {
      isActive: {
        type: Boolean
      }
    },
    emits: [
      "navigate"
    ],
    setup(__props, { emit }) {
      function handleNavigate() {
        emit("navigate");
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("a", {
          class: normalizeClass([
            "istoire-base-list-ite htw-flex htw-items-center htw-gap-2 htw-text-gray-900 dark:htw-text-gray-100",
            [
              _ctx.$attrs.class,
              __props.isActive ? "active htw-bg-primary-500 hover:htw-bg-primary-600 htw-text-white dark:htw-text-black" : "hover:htw-bg-primary-100 dark:hover:htw-bg-primary-900"
            ]
          ]),
          onClick: _cache[0] || (_cache[0] = ($event) => handleNavigate()),
          onKeyup: [
            _cache[1] || (_cache[1] = withKeys(($event) => handleNavigate(), [
              "enter"
            ])),
            _cache[2] || (_cache[2] = withKeys(($event) => handleNavigate(), [
              "space"
            ]))
          ]
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 34);
      };
    }
  });
  const _hoisted_1$3 = [
    "src",
    "alt"
  ];
  const _sfc_main$3 = defineComponent({
    __name: "BaseIcon",
    props: {
      icon: null
    },
    setup(__props) {
      const props = __props;
      const isUrl = computed(() => props.icon.startsWith("http") || props.icon.startsWith("data:image") || props.icon.startsWith(".") || props.icon.startsWith("/"));
      return (_ctx, _cache) => {
        return unref(isUrl) ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: __props.icon,
          alt: __props.icon,
          class: "histoire-base-icon"
        }, null, 8, _hoisted_1$3)) : (openBlock(), createBlock(unref(Icon), {
          key: 1,
          icon: __props.icon,
          class: "histoire-base-icon"
        }, null, 8, [
          "icon"
        ]));
      };
    }
  });
  const BaseIcon = _export_sfc(_sfc_main$3, [
    [
      "__scopeId",
      "data-v-74182813"
    ]
  ]);
  const _hoisted_1$2 = {
    class: "htw-flex-1"
  };
  const _hoisted_2 = {
    class: "htw-flex"
  };
  const _hoisted_3 = {
    class: "htw-ml-auto htw-opacity-40"
  };
  const _hoisted_4 = {
    key: 0,
    class: "htw-flex htw-items-center htw-gap-0.5 htw-opacity-60"
  };
  const _sfc_main$2 = defineComponent({
    __name: "SearchItemContent",
    props: {
      result: null,
      selected: {
        type: Boolean
      }
    },
    setup(__props) {
      const defaultIcons = {
        story: "carbon:cube",
        variant: "carbon:cube"
      };
      const kindLabels = {
        story: "Story",
        variant: "Variant",
        command: "Command"
      };
      return (_ctx, _cache) => {
        var _a;
        return openBlock(), createElementBlock(Fragment, null, [
          createVNode(BaseIcon, {
            icon: __props.result.icon ?? defaultIcons[__props.result.kind],
            class: normalizeClass([
              "htw-w-4 htw-h-4",
              [
                !__props.selected ? [
                  __props.result.iconColor ? "bind-icon-color" : {
                    "htw-text-primary-500": __props.result.kind === "story",
                    "htw-text-gray-500": __props.result.kind === "variant"
                  }
                ] : [],
                {
                  "colorize-black": __props.selected
                }
              ]
            ])
          }, null, 8, [
            "icon",
            "class"
          ]),
          createBaseVNode("div", _hoisted_1$2, [
            createBaseVNode("div", _hoisted_2, [
              createTextVNode(toDisplayString(__props.result.title) + " ", 1),
              createBaseVNode("span", _hoisted_3, toDisplayString(kindLabels[__props.result.kind]), 1)
            ]),
            ((_a = __props.result.path) == null ? void 0 : _a.length) ? (openBlock(), createElementBlock("div", _hoisted_4, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.result.path, (p, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "htw-flex htw-items-center htw-gap-0.5"
                }, [
                  index > 0 ? (openBlock(), createBlock(unref(Icon), {
                    key: 0,
                    icon: "carbon:chevron-right",
                    class: "htw-w-4 htw-h-4 htw-mt-0.5 htw-opacity-50"
                  })) : createCommentVNode("", true),
                  createBaseVNode("span", null, toDisplayString(p), 1)
                ]);
              }), 128))
            ])) : createCommentVNode("", true)
          ])
        ], 64);
      };
    }
  });
  const _hoisted_1$1 = [
    "data-selected"
  ];
  const _sfc_main$1 = defineComponent({
    __name: "SearchItem",
    props: {
      result: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    emits: {
      close: () => true
    },
    setup(__props, { emit }) {
      const props = __props;
      useCssVars((_ctx) => ({
        "a8c1277e": __props.result.iconColor
      }));
      const el = ref();
      const { selected } = toRefs(props);
      useScrollOnActive(selected, el);
      const router = useRouter();
      onKeyboardShortcut([
        "enter"
      ], () => {
        if (!props.selected)
          return;
        action();
      });
      function action(fromClick = false) {
        if ("route" in props.result && !fromClick) {
          router.push(props.result.route);
        }
        if ("onActivate" in props.result) {
          props.result.onActivate();
        }
        emit("close");
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          ref_key: "el",
          ref: el,
          class: "histoire-search-item",
          "data-test-id": "search-item",
          "data-selected": unref(selected) ? "" : void 0
        }, [
          "route" in __props.result ? (openBlock(), createBlock(BaseListItemLink, {
            key: 0,
            to: __props.result.route,
            "is-active": unref(selected),
            class: "htw-px-6 htw-py-4 htw-gap-4",
            onNavigate: _cache[0] || (_cache[0] = ($event) => action(true))
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                result: __props.result,
                selected: unref(selected)
              }, null, 8, [
                "result",
                "selected"
              ])
            ]),
            _: 1
          }, 8, [
            "to",
            "is-active"
          ])) : createCommentVNode("", true),
          "onActivate" in __props.result ? (openBlock(), createBlock(_sfc_main$4, {
            key: 1,
            "is-active": unref(selected),
            class: "htw-px-6 htw-py-4 htw-gap-4",
            onNavigate: _cache[1] || (_cache[1] = ($event) => action(true))
          }, {
            default: withCtx(() => [
              createVNode(_sfc_main$2, {
                result: __props.result,
                selected: unref(selected)
              }, null, 8, [
                "result",
                "selected"
              ])
            ]),
            _: 1
          }, 8, [
            "is-active"
          ])) : createCommentVNode("", true)
        ], 8, _hoisted_1$1);
      };
    }
  });
  const SearchItem = _export_sfc(_sfc_main$1, [
    [
      "__scopeId",
      "data-v-6c8e9661"
    ]
  ]);
  let searchData$1 = {
    "index": {
      "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1}',
      "text.cfg": '{"doc":0,"opt":1}',
      "text.map": '[{"t":[0,1,2,3,4,38,39,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"ta":[0,1,2,3,4,38,39,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"tat":[0,1,2,3,4,38,39],"tate":[0,1,2,3,4,38,39],"f":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,64,65,66,74,75,76,77,78,79,82,83,84,85],"fe":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,64,65,66,74,75,76,77,78,79],"fel":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,64,65,66,74,75,76,77,78,79],"felt":[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,64,65,66,74,75,76,77,78,79],"fo":[24,25,26],"fom":[24,25,26],"fome":[24,25,26],"r":[27,28,29,30,31,32,33],"ro":[27,28,29,30,31,32,33],"rot":[27,28,29,30,31,32,33],"rote":[27,28,29,30,31,32,33],"s":[34,35,36,37,42,43],"st":[34,35,36,37],"sta":[34,35,36,37],"star":[34,35,36,37],"stars":[34,35,36,37],"m":[40,41,44,45],"mo":[40,41],"mom":[40,41],"momp":[40,41],"mompe":[40,41],"momper":[40,41],"se":[42,43],"sel":[42,43],"sele":[42,43],"selek":[42,43],"selekt":[42,43],"me":[44,45],"mem":[44,45],"memo":[44,45],"k":[46,47,48,49,50,51,52,53,54,55,56],"ka":[46,47,48,49,50],"kat":[46,47,48,49,50],"kate":[46,47,48,49,50],"katek":[46,47,48,49,50],"kateko":[46,47,48,49,50],"katekor":[46,47,48,49,50],"katekore":[46,47,48,49,50],"kr":[51,52,53,54,55,56],"kro":[51,52,53,54,55,56],"krop":[51,52,53,54,55,56],"e":[57,58,59,60,86,87,88],"et":[57,58,59,60],"ete":[57,58,59,60],"etem":[57,58,59,60],"l":[61,62,63],"le":[61,62,63],"lem":[61,62,63],"lemk":[61,62,63],"felts":[64,65,66,74,75,76,77,78,79],"p":[67,68,69,70,71,72,73,80,81],"po":[67,68,69,70,71,72,73,80,81],"pos":[71,72,73,80,81],"fa":[82,83,84,85],"faf":[82,83,84,85],"fafo":[82,83,84,85],"fafor":[82,83,84,85],"fafore":[82,83,84,85],"faforet":[82,83,84,85],"faforete":[82,83,84,85],"ek":[86,87,88],"eko":[86,87,88],"ekom":[86,87,88],"te":[89,90,91,92,93,94],"ter":[89,90,91,92,93,94],"tere":[89,90,91,92,93,94],"teret":[89,90,91,92,93,94],"tereto":[89,90,91,92,93,94],"teretor":[89,90,91,92,93,94],"teretore":[89,90,91,92,93,94],"teretoreo":[89,90,91,92,93,94],"tal":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"talf":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"talfe":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"talfem":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111],"talfemt":[95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111]},{"r":[0,1,2,3,4,20,21,38,39,40,41],"ra":[0,1,2,3,4,38,39,40,41],"ram":[0,1,2,3,4,38,39,40,41],"ramk":[0,1,2,3,4,38,39,40,41],"ramke":[0,1,2,3,4,38,39,40,41],"t":[6,7,8,13,14,15,22,25,26,28,29,35,43,45,47,49,52,62,65,71,72,73,80,81],"te":[6,7,8,13,14,15,25,26,28,29,35,43,45,47,49,52,62,65,71,72,73,97],"tef":[6,7,8,25,26,28,29,35,43,45,47,49,52,62,65],"tefa":[6,7,8,25,26,28,29,35,43,45,47,49,52,62,65],"tefao":[6,7,8,25,26,28,29,35,43,45,47,49,52,62,65],"tefaol":[6,7,8,25,26,28,29,35,43,45,47,49,52,62,65],"tefaolt":[6,7,8,25,26,28,29,35,43,45,47,49,52,62,65],"m":[9,30,31,32,33,36,37,66,100],"mo":[9,36,37],"l":[10,53,57,58,59,60,104,105],"la":[10,53,63],"lap":[10],"lape":[10],"lapel":[10],"s":[11,48,50],"st":[11],"sta":[11],"star":[11],"start":[11],"a":[12,54,55],"at":[12],"atr":[12],"tes":[13,14,15,97],"tesk":[13,14,15],"teskr":[13,14,15],"teskre":[13,14,15],"teskrep":[13,14,15],"teskrept":[13,14,15],"teskrepte":[13,14,15],"teskrepteo":[13,14,15],"teskrepteom":[13,14,15],"e":[16,19,56,82,83,84,85,89,90,91,92,93,94,110],"em":[16,19],"ema":[16],"emal":[16],"fep":[17],"feps":[17],"fepse":[17],"fepset":[17],"fepsete":[17],"fa":[18],"fak":[18],"fake":[18],"fakep":[18],"fakepo":[18],"fakepok":[18],"ems":[19],"emst":[19],"emsta":[19],"emstak":[19],"emstakr":[19],"emstakra":[19],"emstakram":[19],"ro":[20,21],"rot":[20,21],"rote":[20,21],"to":[22],"tof":[22],"tofm":[22],"tofml":[22],"tofmlo":[22],"tofmloa":[22],"tofmloat":[22],"k":[23,67,68,69,70,74,75,76,77,78,79],"ko":[23],"kor":[23],"kort":[23],"korte":[23],"kortem":[23],"kortema":[23],"kortemat":[23],"kortemate":[23],"kortemates":[23],"me":[30,31,32,33],"mes":[30,31,32,33],"mese":[30,31,32,33],"mesem":[30,31,32,33],"mesemk":[30,31,32,33],"mor":[36],"more":[36],"mom":[37],"mome":[37],"se":[48,50],"sel":[48,50],"sele":[48,50],"selek":[48,50],"selekt":[48,50],"selekte":[48,50],"selektet":[48,50],"lar":[53,63],"lark":[53,63],"larke":[53,63],"ak":[54,55],"akt":[54,55],"akte":[54,55],"aktef":[54,55],"aktefe":[54,55],"aktefet":[54,55],"aktefete":[54,55],"aktefetes":[54,55],"et":[56],"etk":[56],"etke":[56],"le":[57,58,59,60,104,105],"les":[57,58,59,60],"lest":[57,58,59,60],"ma":[66,100],"mam":[66],"mame":[66],"ka":[67,68,69,70],"kar":[67,68,69,70],"kart":[67,68,69,70],"tek":[71,72,73],"kr":[74,75,76,77,78,79],"kro":[74,75,76,77,78,79],"krop":[74,75,76,77,78,79],"ta":[80,81],"tap":[80,81],"tapl":[80,81],"taple":[80,81],"ek":[82,83,84,85,89,90,91,92,93,94,110],"eko":[82,83,84,85,89,90,91,92,93,94],"ekom":[82,83,84,85,89,90,91,92,93,94],"p":[86,87,88,96,98,99,107,108],"po":[86,87,88,98,107,108],"pot":[86,87,88],"poto":[86,87,88],"potom":[86,87,88],"pa":[96,99],"pak":[96],"pakr":[96],"pakro":[96],"pakrom":[96],"pakromt":[96],"test":[97],"por":[98,107,108],"port":[98,107,108],"porte":[98,107,108],"porter":[98,107,108],"pat":[99],"pate":[99],"patem":[99],"patemk":[99],"mar":[100],"mark":[100],"marke":[100],"markem":[100],"f":[101,102,103,109,111],"fo":[101,102,103,111],"fom":[101,102,103],"fomt":[101,102,103],"let":[104],"lete":[104],"leter":[104],"lem":[105],"leme":[105],"tr":[106],"tro":[106],"trop":[106],"fe":[109],"fet":[109],"ekt":[110],"fol":[111]},{"te":[1,2,3,4,32,33,39,41,58,68,81,83,87,88],"tef":[1,2,3,4,32,33,39,41,58,68,72,81,83,87,88,90],"tefa":[1,2,3,4,39,41,58,68,72,81,83,87,88,90],"tefao":[1,2,3,4,39,41,58,68,72,81,83,87,88,90],"tefaol":[1,2,3,4,39,41,58,68,72,81,83,87,88,90],"tefaolt":[1,2,3,4,39,41,58,68,72,81,83,87,88,90],"l":[7,8,28,29,55,69,70,73,77],"le":[7,8,69,70,73],"les":[7,8],"lest":[7,8],"fa":[9,103],"fal":[9],"falo":[9],"e":[11,65,76,105],"em":[11,65,76,94],"emt":[11],"s":[14,75,101,104,106],"so":[14],"sor":[14],"sort":[14],"tet":[15],"teta":[15],"tetal":[15],"tetals":[15],"k":[20,85,96,97,98,111],"kp":[20],"kps":[20],"p":[21],"pt":[21],"ptf":[21],"tes":[25,91],"tesk":[25],"teskt":[25],"teskto":[25],"tesktop":[25],"m":[26,60,79],"mo":[26],"mop":[26],"mope":[26],"mopel":[26],"mopele":[26],"la":[28,29,55,59,77],"lap":[28,29,77],"lape":[28,29,77],"lapel":[28,29,77],"f":[30,31,92,93,108],"fe":[30,31,102,108],"fel":[30,31],"felt":[30,31],"felts":[30,31],"t":[32,33,41,58,68,83,87,88],"tefe":[32,33],"tefek":[32,33],"tefeko":[32,33],"tefekol":[32,33],"tefekolt":[32,33],"tefekolte":[32,33],"ko":[49,50,85,96,97,98,111],"kom":[49,50,111],"komp":[49,50],"kompa":[49,50],"kompak":[49,50],"kompakt":[49,50],"lar":[55,59],"lark":[55,59],"larke":[55,59],"ka":[56,78],"kas":[56],"kase":[56],"kases":[56],"ma":[60,79],"mam":[60,79],"mame":[60,79],"emp":[65,76],"empt":[65,76],"empte":[65,76],"lek":[69,70,73],"lekt":[69,70,73],"sa":[75,106],"sam":[75],"samt":[75],"samta":[75],"samtar":[75],"samtart":[75],"kar":[78],"kart":[78],"a":[84],"ak":[84],"akt":[84],"akte":[84],"aktef":[84],"aktefe":[84],"kol":[85,96,97,98],"kolo":[85,96,97,98],"kolor":[85,96,97,98],"kolore":[85],"koloret":[85],"test":[91],"fo":[92,93],"fom":[92,93],"fomt":[92,93],"fomta":[92,93],"fomtaf":[92,93],"fomtafe":[92,93],"fomtafes":[92,93],"fomtafeso":[92,93],"fomtafesom":[92,93],"fomtafesome":[92,93],"ema":[94],"emak":[94],"emake":[94],"se":[101],"ses":[101],"sese":[101],"fek":[102],"fekt":[102],"fam":[103],"fame":[103],"famel":[103],"famele":[103],"sp":[104],"spa":[104],"spak":[104],"spake":[104],"spakem":[104],"spakemk":[104],"ek":[105],"ekt":[105],"sat":[106],"sato":[106],"satof":[106],"r":[107],"ra":[107],"rat":[107],"rate":[107],"rateo":[107],"rateos":[107],"fet":[108],"komf":[111],"komfe":[111],"komfek":[111]},{"s":[2,4],"st":[2],"sta":[2],"star":[2],"start":[2],"e":[3],"em":[3],"emt":[3],"sa":[4],"sam":[4],"same":[4],"o":[7],"om":[7],"ome":[7],"m":[8],"ma":[8],"mam":[8],"mame":[8],"t":[11,20,70],"ta":[11],"tat":[11],"tate":[11],"tr":[20],"tra":[20],"trak":[20],"trake":[20],"p":[28],"po":[28],"pop":[28],"popo":[28],"popop":[28],"tet":[29],"teta":[29],"tetal":[29],"tetals":[29],"l":[30,31,32,33,88],"la":[30,31,32,33],"lap":[30,31,32,33],"lape":[30,31,32,33],"lapel":[30,31,32,33],"k":[60,91],"kr":[60],"kro":[60],"krop":[60],"krops":[60],"te":[70],"tef":[70],"tefa":[70],"tefao":[70],"tefaol":[70],"tefaolt":[70],"le":[88],"lem":[88],"lemk":[88],"ko":[91],"kol":[91],"kolo":[91],"kolor":[91],"tes":[93],"test":[93]},{"p":[30,32],"po":[30,32],"pop":[30,32],"popo":[30,32],"popop":[30,32],"t":[31],"te":[31],"tet":[31,33],"teta":[31,33],"tetal":[31,33],"tetals":[31,33],"k":[93],"ko":[93],"kol":[93],"kolo":[93],"kolor":[93]},{},{},{},{}]',
      "text.ctx": "[{}]"
    },
    "idMap": {
      "0": {
        "id": "components-fields-daterange-story-vue",
        "kind": "story"
      },
      "1": {
        "id": "components-fields-daterange-story-vue:components-fields-daterange-story-vue-0",
        "kind": "variant"
      },
      "2": {
        "id": "components-fields-daterange-story-vue:components-fields-daterange-story-vue-1",
        "kind": "variant"
      },
      "3": {
        "id": "components-fields-daterange-story-vue:components-fields-daterange-story-vue-2",
        "kind": "variant"
      },
      "4": {
        "id": "components-fields-daterange-story-vue:components-fields-daterange-story-vue-3",
        "kind": "variant"
      },
      "5": {
        "id": "components-fields-field-story-vue",
        "kind": "story"
      },
      "6": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-0",
        "kind": "variant"
      },
      "7": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-1",
        "kind": "variant"
      },
      "8": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-2",
        "kind": "variant"
      },
      "9": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-3",
        "kind": "variant"
      },
      "10": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-4",
        "kind": "variant"
      },
      "11": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-5",
        "kind": "variant"
      },
      "12": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-6",
        "kind": "variant"
      },
      "13": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-7",
        "kind": "variant"
      },
      "14": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-8",
        "kind": "variant"
      },
      "15": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-9",
        "kind": "variant"
      },
      "16": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-10",
        "kind": "variant"
      },
      "17": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-11",
        "kind": "variant"
      },
      "18": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-12",
        "kind": "variant"
      },
      "19": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-13",
        "kind": "variant"
      },
      "20": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-14",
        "kind": "variant"
      },
      "21": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-15",
        "kind": "variant"
      },
      "22": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-16",
        "kind": "variant"
      },
      "23": {
        "id": "components-fields-field-story-vue:components-fields-field-story-vue-17",
        "kind": "variant"
      },
      "24": {
        "id": "components-fields-phone-story-vue",
        "kind": "story"
      },
      "25": {
        "id": "components-fields-phone-story-vue:components-fields-phone-story-vue-0",
        "kind": "variant"
      },
      "26": {
        "id": "components-fields-phone-story-vue:components-fields-phone-story-vue-1",
        "kind": "variant"
      },
      "27": {
        "id": "components-fields-routesfield-story-vue",
        "kind": "story"
      },
      "28": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-0",
        "kind": "variant"
      },
      "29": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-1",
        "kind": "variant"
      },
      "30": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-2",
        "kind": "variant"
      },
      "31": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-3",
        "kind": "variant"
      },
      "32": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-4",
        "kind": "variant"
      },
      "33": {
        "id": "components-fields-routesfield-story-vue:components-fields-routesfield-story-vue-5",
        "kind": "variant"
      },
      "34": {
        "id": "components-fields-stars-story-vue",
        "kind": "story"
      },
      "35": {
        "id": "components-fields-stars-story-vue:components-fields-stars-story-vue-0",
        "kind": "variant"
      },
      "36": {
        "id": "components-fields-stars-story-vue:components-fields-stars-story-vue-1",
        "kind": "variant"
      },
      "37": {
        "id": "components-fields-stars-story-vue:components-fields-stars-story-vue-2",
        "kind": "variant"
      },
      "38": {
        "id": "components-filters-daterange-story-vue",
        "kind": "story"
      },
      "39": {
        "id": "components-filters-daterange-story-vue:components-filters-daterange-story-vue-0",
        "kind": "variant"
      },
      "40": {
        "id": "components-filters-numberrange-story-vue",
        "kind": "story"
      },
      "41": {
        "id": "components-filters-numberrange-story-vue:components-filters-numberrange-story-vue-0",
        "kind": "variant"
      },
      "42": {
        "id": "components-filters-select-story-vue",
        "kind": "story"
      },
      "43": {
        "id": "components-filters-select-story-vue:components-filters-select-story-vue-0",
        "kind": "variant"
      },
      "44": {
        "id": "components-home-menu-story-vue",
        "kind": "story"
      },
      "45": {
        "id": "components-home-menu-story-vue:components-home-menu-story-vue-0",
        "kind": "variant"
      },
      "46": {
        "id": "components-menu-category-story-vue",
        "kind": "story"
      },
      "47": {
        "id": "components-menu-category-story-vue:components-menu-category-story-vue-0",
        "kind": "variant"
      },
      "48": {
        "id": "components-menu-category-story-vue:components-menu-category-story-vue-1",
        "kind": "variant"
      },
      "49": {
        "id": "components-menu-category-story-vue:components-menu-category-story-vue-2",
        "kind": "variant"
      },
      "50": {
        "id": "components-menu-category-story-vue:components-menu-category-story-vue-3",
        "kind": "variant"
      },
      "51": {
        "id": "components-menu-group-story-vue",
        "kind": "story"
      },
      "52": {
        "id": "components-menu-group-story-vue:components-menu-group-story-vue-0",
        "kind": "variant"
      },
      "53": {
        "id": "components-menu-group-story-vue:components-menu-group-story-vue-1",
        "kind": "variant"
      },
      "54": {
        "id": "components-menu-group-story-vue:components-menu-group-story-vue-2",
        "kind": "variant"
      },
      "55": {
        "id": "components-menu-group-story-vue:components-menu-group-story-vue-3",
        "kind": "variant"
      },
      "56": {
        "id": "components-menu-group-story-vue:components-menu-group-story-vue-4",
        "kind": "variant"
      },
      "57": {
        "id": "components-menu-itemlist-story-vue",
        "kind": "story"
      },
      "58": {
        "id": "components-menu-itemlist-story-vue:components-menu-itemlist-story-vue-0",
        "kind": "variant"
      },
      "59": {
        "id": "components-menu-itemlist-story-vue:components-menu-itemlist-story-vue-1",
        "kind": "variant"
      },
      "60": {
        "id": "components-menu-itemlist-story-vue:components-menu-itemlist-story-vue-2",
        "kind": "variant"
      },
      "61": {
        "id": "components-menu-link-story-vue",
        "kind": "story"
      },
      "62": {
        "id": "components-menu-link-story-vue:components-menu-link-story-vue-0",
        "kind": "variant"
      },
      "63": {
        "id": "components-menu-link-story-vue:components-menu-link-story-vue-1",
        "kind": "variant"
      },
      "64": {
        "id": "components-poiscard-fields-story-vue",
        "kind": "story"
      },
      "65": {
        "id": "components-poiscard-fields-story-vue:components-poiscard-fields-story-vue-0",
        "kind": "variant"
      },
      "66": {
        "id": "components-poiscard-fields-story-vue:components-poiscard-fields-story-vue-1",
        "kind": "variant"
      },
      "67": {
        "id": "components-poiscard-poicard-story-vue",
        "kind": "story"
      },
      "68": {
        "id": "components-poiscard-poicard-story-vue:components-poiscard-poicard-story-vue-0",
        "kind": "variant"
      },
      "69": {
        "id": "components-poiscard-poicardlight-story-vue",
        "kind": "story"
      },
      "70": {
        "id": "components-poiscard-poicardlight-story-vue:components-poiscard-poicardlight-story-vue-0",
        "kind": "variant"
      },
      "71": {
        "id": "components-poiscard-poisdeck-story-vue",
        "kind": "story"
      },
      "72": {
        "id": "components-poiscard-poisdeck-story-vue:components-poiscard-poisdeck-story-vue-0",
        "kind": "variant"
      },
      "73": {
        "id": "components-poiscard-poisdeck-story-vue:components-poiscard-poisdeck-story-vue-1",
        "kind": "variant"
      },
      "74": {
        "id": "components-poisdetails-fieldsgroup-story-vue",
        "kind": "story"
      },
      "75": {
        "id": "components-poisdetails-fieldsgroup-story-vue:components-poisdetails-fieldsgroup-story-vue-0",
        "kind": "variant"
      },
      "76": {
        "id": "components-poisdetails-fieldsgroup-story-vue:components-poisdetails-fieldsgroup-story-vue-1",
        "kind": "variant"
      },
      "77": {
        "id": "components-poisdetails-fieldsgroup-story-vue:components-poisdetails-fieldsgroup-story-vue-2",
        "kind": "variant"
      },
      "78": {
        "id": "components-poisdetails-fieldsgroup-story-vue:components-poisdetails-fieldsgroup-story-vue-3",
        "kind": "variant"
      },
      "79": {
        "id": "components-poisdetails-fieldsgroup-story-vue:components-poisdetails-fieldsgroup-story-vue-4",
        "kind": "variant"
      },
      "80": {
        "id": "components-poislist-poistable-story-vue",
        "kind": "story"
      },
      "81": {
        "id": "components-poislist-poistable-story-vue:components-poislist-poistable-story-vue-0",
        "kind": "variant"
      },
      "82": {
        "id": "components-ui-favoriteicon-story-vue",
        "kind": "story"
      },
      "83": {
        "id": "components-ui-favoriteicon-story-vue:components-ui-favoriteicon-story-vue-0",
        "kind": "variant"
      },
      "84": {
        "id": "components-ui-favoriteicon-story-vue:components-ui-favoriteicon-story-vue-1",
        "kind": "variant"
      },
      "85": {
        "id": "components-ui-favoriteicon-story-vue:components-ui-favoriteicon-story-vue-2",
        "kind": "variant"
      },
      "86": {
        "id": "components-ui-iconbutton-story-vue",
        "kind": "story"
      },
      "87": {
        "id": "components-ui-iconbutton-story-vue:components-ui-iconbutton-story-vue-0",
        "kind": "variant"
      },
      "88": {
        "id": "components-ui-iconbutton-story-vue:components-ui-iconbutton-story-vue-1",
        "kind": "variant"
      },
      "89": {
        "id": "components-ui-teritorioicon-story-vue",
        "kind": "story"
      },
      "90": {
        "id": "components-ui-teritorioicon-story-vue:components-ui-teritorioicon-story-vue-0",
        "kind": "variant"
      },
      "91": {
        "id": "components-ui-teritorioicon-story-vue:components-ui-teritorioicon-story-vue-1",
        "kind": "variant"
      },
      "92": {
        "id": "components-ui-teritorioicon-story-vue:components-ui-teritorioicon-story-vue-2",
        "kind": "variant"
      },
      "93": {
        "id": "components-ui-teritorioicon-story-vue:components-ui-teritorioicon-story-vue-3",
        "kind": "variant"
      },
      "94": {
        "id": "components-ui-teritorioicon-story-vue:components-ui-teritorioicon-story-vue-4",
        "kind": "variant"
      },
      "95": {
        "id": "tailwind",
        "kind": "story"
      },
      "96": {
        "id": "tailwind:background-color",
        "kind": "variant"
      },
      "97": {
        "id": "tailwind:text-color",
        "kind": "variant"
      },
      "98": {
        "id": "tailwind:border-color",
        "kind": "variant"
      },
      "99": {
        "id": "tailwind:padding",
        "kind": "variant"
      },
      "100": {
        "id": "tailwind:margin",
        "kind": "variant"
      },
      "101": {
        "id": "tailwind:font-size",
        "kind": "variant"
      },
      "102": {
        "id": "tailwind:font-weight",
        "kind": "variant"
      },
      "103": {
        "id": "tailwind:font-family",
        "kind": "variant"
      },
      "104": {
        "id": "tailwind:letter-spacing",
        "kind": "variant"
      },
      "105": {
        "id": "tailwind:line-height",
        "kind": "variant"
      },
      "106": {
        "id": "tailwind:drop-shadow",
        "kind": "variant"
      },
      "107": {
        "id": "tailwind:border-radius",
        "kind": "variant"
      },
      "108": {
        "id": "tailwind:border-width",
        "kind": "variant"
      },
      "109": {
        "id": "tailwind:width",
        "kind": "variant"
      },
      "110": {
        "id": "tailwind:height",
        "kind": "variant"
      },
      "111": {
        "id": "tailwind:full-config",
        "kind": "variant"
      }
    }
  };
  const searchData = markRaw(searchData$1);
  function useSelection(list) {
    const selectedIndex = ref(0);
    watch(list, () => {
      selectedIndex.value = 0;
    });
    function selectNext() {
      selectedIndex.value++;
      if (selectedIndex.value > list.value.length - 1) {
        selectedIndex.value = 0;
      }
    }
    function selectPrevious() {
      selectedIndex.value--;
      if (selectedIndex.value < 0) {
        selectedIndex.value = list.value.length - 1;
      }
    }
    return {
      selectedIndex: computed(() => selectedIndex.value),
      selectNext,
      selectPrevious
    };
  }
  const _hoisted_1 = {
    key: 1,
    class: "htw-max-h-[400px] htw-overflow-y-auto htw-rounded-b-lg"
  };
  _sfc_main = defineComponent({
    __name: "SearchPane",
    props: {
      shown: {
        type: Boolean,
        default: false
      }
    },
    emits: {
      close: () => true
    },
    setup(__props, { emit }) {
      const props = __props;
      const DocSearchData = () => __vitePreload(() => import("./search-docs-data-68085d47.js").then(async (m) => {
        await m.__tla;
        return m;
      }), true ? ["assets/search-docs-data-68085d47.js","assets/vendor-ec6df5a6.js"] : void 0);
      function close() {
        emit("close");
      }
      const input = ref();
      const { focused } = useFocus(input, {
        initialValue: true
      });
      watch(() => props.shown, (value) => {
        if (value) {
          requestAnimationFrame(() => {
            focused.value = true;
            input.value.select();
          });
        }
      });
      const searchInputText = ref("");
      const rateLimitedSearch = refDebounced(searchInputText, 50);
      const storyStore = useStoryStore();
      let titleSearchIndex;
      let titleIdMap;
      function createIndex() {
        return new flexsearch_bundleExports.Document({
          preset: "match",
          document: {
            id: "id",
            index: [
              "text"
            ]
          },
          worker: true,
          charset,
          language,
          tokenize: "forward"
        });
      }
      async function loadSearchIndex(data) {
        titleSearchIndex = createIndex();
        for (const key of Object.keys(data.index)) {
          await titleSearchIndex.import(key, data.index[key]);
        }
        titleIdMap = data.idMap;
      }
      loadSearchIndex(searchData);
      let docSearchIndex;
      let docIdMap;
      async function loadDocSearchIndex() {
        async function load(data) {
          docSearchIndex = createIndex();
          for (const key of Object.keys(data.index)) {
            await docSearchIndex.import(key, data.index[key]);
          }
          docIdMap = data.idMap;
          if (rateLimitedSearch.value) {
            searchOnDocField(rateLimitedSearch.value);
          }
        }
        const searchDataModule = await DocSearchData();
        load(searchDataModule.searchData);
        searchDataModule.onUpdate((searchData2) => {
          load(searchData2);
        });
      }
      loadDocSearchIndex();
      const titleResults = ref([]);
      watch(rateLimitedSearch, async (value) => {
        const list = [];
        const raw = await titleSearchIndex.search(value);
        let rank = 0;
        for (const field of raw) {
          for (const id of field.result) {
            const idMapData = titleIdMap[id];
            if (!idMapData)
              continue;
            switch (idMapData.kind) {
              case "story": {
                list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank));
                rank++;
                break;
              }
              case "variant": {
                const [storyId] = idMapData.id.split(":");
                const story = storyStore.getStoryById(storyId);
                const variant = storyStore.getVariantById(idMapData.id);
                list.push(variantResultFactory(story, variant, rank));
                rank++;
                break;
              }
            }
          }
        }
        titleResults.value = list;
      });
      const docsResults = ref([]);
      async function searchOnDocField(query) {
        if (docSearchIndex) {
          const list = [];
          const raw = await docSearchIndex.search(query);
          let rank = 0;
          for (const field of raw) {
            for (const id of field.result) {
              const idMapData = docIdMap[id];
              if (!idMapData)
                continue;
              switch (idMapData.kind) {
                case "story": {
                  list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank, "docs"));
                  rank++;
                  break;
                }
              }
            }
          }
          docsResults.value = list;
        }
      }
      watch(rateLimitedSearch, searchOnDocField);
      function storyResultFactory(story, rank, type = "title") {
        return {
          kind: "story",
          rank,
          id: `story:${story.id}`,
          title: story.title,
          route: {
            name: "story",
            params: {
              storyId: story.id
            },
            query: {
              ...type === "docs" ? {
                tab: "docs"
              } : {}
            }
          },
          path: story.file.path.slice(0, -1),
          icon: story.icon,
          iconColor: story.iconColor
        };
      }
      function variantResultFactory(story, variant, rank, type = "title") {
        return {
          kind: "variant",
          rank,
          id: `variant:${story.id}:${variant.id}`,
          title: variant.title,
          route: {
            name: "story",
            params: {
              storyId: story.id
            },
            query: {
              variantId: variant.id,
              ...type === "docs" ? {
                tab: "docs"
              } : {}
            }
          },
          path: [
            ...story.file.path ?? [],
            story.title
          ],
          icon: variant.icon,
          iconColor: variant.iconColor
        };
      }
      const commandResults = computed(() => {
        return [];
      });
      useCommandStore();
      const results = computed(() => {
        const list = [
          ...commandResults.value,
          ...titleResults.value
        ];
        const seen = {};
        for (const r of titleResults.value) {
          seen[r.id] = true;
        }
        for (const r of docsResults.value) {
          if (!seen[r.id]) {
            list.push(r);
          }
        }
        return list;
      });
      const { selectedIndex, selectNext, selectPrevious } = useSelection(results);
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock(Fragment, null, [
          createBaseVNode("div", {
            class: "histoire-search-pane htw-flex htw-items-center htw-gap-4 htw-pl-6 htw-border htw-border-transparent focus-visible:htw-border-primary-500",
            onClick: _cache[4] || (_cache[4] = ($event) => focused.value = true)
          }, [
            createVNode(unref(Icon), {
              icon: "carbon:search",
              class: "flex-none htw-w-4 htw-h-4"
            }),
            withDirectives(createBaseVNode("input", {
              ref_key: "input",
              ref: input,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchInputText.value = $event),
              placeholder: "Search for stories, variants...",
              class: "htw-bg-transparent htw-w-full htw-flex-1 htw-pl-0 htw-pr-6 htw-py-4 htw-outline-none",
              onKeydown: [
                _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => unref(selectNext)(), [
                  "prevent"
                ]), [
                  "down"
                ])),
                _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(selectPrevious)(), [
                  "prevent"
                ]), [
                  "up"
                ])),
                _cache[3] || (_cache[3] = withKeys(($event) => close(), [
                  "escape"
                ]))
              ]
            }, null, 544), [
              [
                vModelText,
                searchInputText.value
              ]
            ])
          ]),
          unref(rateLimitedSearch) && !unref(results).length ? (openBlock(), createBlock(BaseEmpty, {
            key: 0,
            class: "no-animation"
          }, {
            default: withCtx(() => [
              createTextVNode(" No results ")
            ]),
            _: 1
          })) : unref(results).length ? (openBlock(), createElementBlock("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(results), (result, index) => {
              return openBlock(), createBlock(SearchItem, {
                key: result.id,
                result,
                selected: index === unref(selectedIndex),
                onClose: _cache[5] || (_cache[5] = ($event) => close())
              }, null, 8, [
                "result",
                "selected"
              ]);
            }), 128))
          ])) : createCommentVNode("", true)
        ], 64);
      };
    }
  });
});
export {
  __tla,
  _sfc_main as default
};
