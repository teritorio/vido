import { bi as joinURL, aU as defineNuxtPlugin, bj as withoutBase, bk as useRuntimeConfig, bl as reactive, ba as h, bm as useState, bn as isReadonly, bo as callWithNuxt, bp as isEqual, bq as navigateTo, br as stringifyParsedURL, bs as stringifyQuery, bt as parseURL, bu as parseQuery, bv as clearError, bw as useRequestEvent, bx as config$1, by as library$1, bz as faArrowLeft, bA as faBars, bB as faBiking, bC as faCheckCircle, bD as faChevronDown, bE as faChevronUp, bF as faChevronRight, bG as faCircle, bH as faCircle$1, bI as faHiking, bJ as faInfo, bK as faMinus, bL as faPlus, bM as faSearch, bN as faStar, bO as faStar$1, bP as faExternalLinkAlt, bQ as faMap, bR as faEye, bS as faTrash, bT as faTimes, bU as faFilter, bV as faSpinner, bW as faLink, bX as faShareAlt, bY as faMapMarkerAlt, bZ as faLayerGroup, b_ as faHome, b$ as faGripLines, c0 as faRoute, c1 as faCompass, c2 as faCity, c3 as faClipboardCheck, c4 as faFileDownload, c5 as faBookOpen, c6 as faPrint, c7 as faFacebook, c8 as faInstagram, c9 as faWhatsapp, ca as faTwitter, cb as faArrowCircleDown, cc as faPhone, cd as faFileCsv, ce as faFilePdf, cf as faSquareParking, cg as faHouseFlag, ch as faFlagCheckered, ci as faCopy, cj as faCog, ck as faEnvelope, cl as vueTouchEvents, cm as useScreen, cn as useGrid, bc as computed, co as convert, cp as createGtm, cq as VueMatomo, cr as x, cs as plugin, ct as vueuse_head_plugin_D7WGfuP1A0, cu as composition_sLxaNGmlSL, cv as i18n_yfWm7jX06p, cw as vuetify_7h9QAQEssH, as as _export_sfc, cx as useNuxtApp, cy as provide, cz as useRoute, cA as useError, cB as onErrorCaptured, ax as openBlock, av as createBlock, aw as withCtx, cC as Suspense, cD as isNuxtError, cE as showError, cF as onServerPrefetch, S as defineAsyncComponent, _ as __vitePreload, cG as $fetch, cH as normalizePlugins, cI as createSSRApp, cJ as createApp, cK as createNuxtApp, cL as applyPlugins, cM as appRootId, cN as nextTick, __tla as __tla_0 } from "./vendor-cc850437.js";
import { p as property_translations_PIWCHHX3IP, __tla as __tla_1 } from "./property-translations-9fdfb1f5.js";
let entry$1;
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
  const appConfig = {
    "rootId": "nuxt-test",
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": "",
    "head": {
      "meta": [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        }
      ],
      "link": [],
      "style": [],
      "script": [],
      "noscript": []
    },
    "layoutTransition": false,
    "pageTransition": false,
    "keepalive": false,
    "rootTag": "div"
  };
  const baseURL = () => appConfig.baseURL;
  const buildAssetsDir = () => appConfig.buildAssetsDir;
  const buildAssetsURL = (...path) => joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
  const publicAssetsURL = (...path) => {
    const publicBase = appConfig.baseURL;
    return path.length ? joinURL(publicBase, ...path) : publicBase;
  };
  {
    globalThis.__buildAssetsURL = buildAssetsURL;
    globalThis.__publicAssetsURL = publicAssetsURL;
  }
  const components = {};
  const components_plugin_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
    for (const name in components) {
      nuxtApp.vueApp.component(name, components[name]);
      nuxtApp.vueApp.component("Lazy" + name, components[name]);
    }
  });
  const globalMiddleware = [];
  function getRouteFromPath(fullPath) {
    if (typeof fullPath === "object") {
      fullPath = stringifyParsedURL({
        pathname: fullPath.path || "",
        search: stringifyQuery(fullPath.query || {}),
        hash: fullPath.hash || ""
      });
    }
    const url = parseURL(fullPath.toString());
    return {
      path: url.pathname,
      fullPath,
      query: parseQuery(url.search),
      hash: url.hash,
      params: {},
      name: void 0,
      matched: [],
      redirectedFrom: void 0,
      meta: {},
      href: fullPath
    };
  }
  const router_PJLmOmdFeM = defineNuxtPlugin((nuxtApp) => {
    const initialURL = withoutBase(window.location.pathname, useRuntimeConfig().app.baseURL) + window.location.search + window.location.hash;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      error: []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    const baseURL2 = useRuntimeConfig().app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (result) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (true) {
          window.history[replace ? "replaceState" : "pushState"]({}, "", joinURL(baseURL2, to.fullPath));
          if (!nuxtApp.isHydrating) {
            await callWithNuxt(nuxtApp, clearError);
          }
        }
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        if (!hooks.error.length) {
          console.warn("No error handlers registered to handle middleware errors. You can register an error handler with `router.onError()`", err);
        }
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const router = {
      currentRoute: route,
      isReady: () => Promise.resolve(),
      options: {},
      install: () => Promise.resolve(),
      push: (url) => handleNavigation(url, false),
      replace: (url) => handleNavigation(url, true),
      back: () => window.history.go(-1),
      go: (delta) => window.history.go(delta),
      forward: () => window.history.go(1),
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", {
      functional: true,
      props: {
        to: String,
        custom: Boolean,
        replace: Boolean,
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          var _a;
          const route2 = router.resolve(props.to);
          return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, {
            href: props.to,
            navigate,
            route: route2
          }) : h("a", {
            href: props.to,
            onClick: (e) => {
              e.preventDefault();
              return navigate();
            }
          }, slots);
        };
      }
    });
    {
      window.addEventListener("popstate", (event) => {
        const location = event.target.location;
        router.replace(location.href.replace(location.origin, ""));
      });
    }
    nuxtApp._route = route;
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    const initialLayout = useState("_layout");
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout.value;
        }
        nuxtApp._processingMiddleware = true;
        const middlewareEntries = /* @__PURE__ */ new Set([
          ...globalMiddleware,
          ...nuxtApp._middleware.global
        ]);
        for (const middleware of middlewareEntries) {
          const result = await callWithNuxt(nuxtApp, middleware, [
            to,
            from
          ]);
          if (result || result === false) {
            return result;
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        const event = await callWithNuxt(nuxtApp, useRequestEvent);
        const options = {
          redirectCode: event.node.res.statusCode !== 200 ? event.node.res.statusCode || 302 : 302
        };
        await callWithNuxt(nuxtApp, navigateTo, [
          route.fullPath,
          options
        ]);
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  });
  const fs = new Proxy({}, {
    get(_, key) {
      throw new Error(`Module "fs" has been externalized for browser compatibility. Cannot access "fs.${key}" in client code.  See http://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
    }
  });
  let config = void 0;
  function vidos() {
    config = config || JSON.parse(fs.readFileSync({}.CONFIG || "vidos-config.json").toString());
    return config;
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
  function vidoConfigResolve(host, vidoHostConfig) {
    return {
      ...vidoHostConfig[host] || vidoHostConfig[""]
    };
  }
  function vidoConfig(headers) {
    let host;
    {
      host = window.location.host;
    }
    host = _optionalChain([
      host,
      "optionalAccess",
      (_) => _.split,
      "call",
      (_2) => _2(":"),
      "access",
      (_3) => _3[0]
    ]);
    const vidoHostConfig = vidos();
    if (!(host in vidoHostConfig) && !("" in vidoHostConfig)) {
      throw new Error(`Not configured host "${host}"`);
    }
    return vidoConfigResolve(host, vidoHostConfig);
  }
  const vido_config_M7tFtI8bDB = defineNuxtPlugin((nuxtApp) => {
    let config2;
    return {
      provide: {
        vidoConfigSet: (c) => {
          config2 = c;
        },
        vidoConfig: (headers) => config2 || vidoConfig()
      }
    };
  });
  const settings_ZJy0LLHwcO = defineNuxtPlugin((nuxtApp) => {
    const settings = {
      set(setSettings) {
        Object.assign(settings, setSettings);
      }
    };
    return {
      provide: {
        settings
      }
    };
  });
  config$1.autoAddCss = false;
  library$1.add(faArrowLeft, faBars, faBiking, faCheckCircle, faChevronDown, faChevronUp, faChevronRight, faCircle, faCircle$1, faHiking, faInfo, faMinus, faPlus, faSearch, faStar, faStar$1, faExternalLinkAlt, faMap, faEye, faTrash, faTimes, faFilter, faSpinner, faLink, faShareAlt, faMapMarkerAlt, faLayerGroup, faHome, faGripLines, faRoute, faCompass, faCity, faShareAlt, faClipboardCheck, faFileDownload, faBookOpen, faPrint, faFacebook, faInstagram, faWhatsapp, faTwitter, faArrowCircleDown, faPhone, faFileCsv, faFilePdf, faSquareParking, faHouseFlag, faFlagCheckered, faCopy, faCog, faEnvelope);
  const fontawesome_cn2c4tOOHz = defineNuxtPlugin((nuxtApp) => {
  });
  const touch_5RFx4YnLk6 = defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vueTouchEvents);
  });
  const device_PxhEqcDcOg = defineNuxtPlugin((nuxtApp) => {
    const screen = useScreen();
    const grid = useGrid("tailwind");
    return {
      provide: {
        device: computed(() => ({
          smallScreen: !grid.md,
          touch: screen.touch,
          phone: screen.touch && !grid.lg
        }))
      }
    };
  });
  class Google {
    constructor(nuxtApp, waitForConsent, googleTagManagerId) {
      const gtm = createGtm({
        id: googleTagManagerId,
        defer: true,
        compatibility: false,
        enabled: false
      });
      nuxtApp.vueApp.use(gtm);
      this.waitForConsent = waitForConsent;
      this.gtm = gtm;
      this.googleTagManagerId = googleTagManagerId;
      if (!waitForConsent) {
        this.gtm.init(googleTagManagerId);
      }
    }
    consent() {
      if (this.waitForConsent) {
        this.gtm.init(this.googleTagManagerId);
      }
    }
    track(event) {
      switch (event.type) {
        case "page": {
          this.gtm.push({
            event: "pageview",
            pageType: "PageView",
            pageTitle: event.title,
            pageLocation: event.location,
            pagePath: event.path,
            origin: event.origin
          });
          break;
        }
        case "menu": {
          this.gtm.push({
            event: "pageview",
            pageType: "PageView",
            pageTitle: event.title,
            pagePath: `/${convert(event.title)}-${event.menuItemId}/`
          });
          break;
        }
        case "category_event": {
          this.gtm.push({
            event: event.type,
            action: event.event,
            categoryId: event.categoryId,
            title: event.title
          });
          break;
        }
        case "notebook_event":
        case "search": {
          this.gtm.push({
            event: "pageview",
            pageType: "PageView",
            pageTitle: event.type,
            pagePath: `/${convert(event.type)}`
          });
          break;
        }
        case "search_result_event": {
          this.gtm.push({
            event: event.type,
            action: event.event,
            type: event.resultType,
            title: event.title
          });
          break;
        }
        case "popup": {
          this.gtm.push({
            event: "pageview",
            pageType: "PageView",
            pageTitle: event.title,
            pageLocation: event.location,
            pagePath: `/${event.title}-${event.poiId}`,
            poiId: event.poiId,
            categoryIds: event.categoryIds
          });
          break;
        }
        case "popup_event": {
          this.gtm.push({
            event: event.type,
            action: event.event,
            poiId: event.poiId,
            category: event.category,
            title: event.title
          });
          break;
        }
        case "map_control_event": {
          this.gtm.push({
            event: event.type,
            action: event.event
          });
          break;
        }
        case "favorites_event": {
          this.gtm.push({
            event: event.type,
            action: event.event
          });
          break;
        }
        case "external_link": {
          this.gtm.push({
            event: event.type,
            url: event.url,
            title: event.title
          });
          break;
        }
        case "details_event": {
          this.gtm.push({
            event: event.type,
            action: event.event,
            poiId: event.poiId,
            title: event.title
          });
          break;
        }
      }
    }
  }
  class Matomo {
    constructor(nuxtApp, waitForConsent, url, siteId) {
      nuxtApp.vueApp.use(VueMatomo, {
        host: url,
        siteId,
        requireConsent: waitForConsent,
        requireCookieConsent: waitForConsent
      });
    }
    consent() {
      let delai = 1e3;
      const timeout = () => {
        setTimeout(function() {
          set();
        }, delai);
        delai = delai * 2;
      };
      const set = () => {
        if (window.Matomo && window.Matomo.getAsyncTracker()) {
          window.Matomo.getAsyncTracker().setConsentGiven();
          window.Matomo.getAsyncTracker().setCookieConsentGiven();
        } else {
          timeout();
        }
      };
      set();
    }
    track(event) {
      const _paq = window._paq;
      switch (event.type) {
        case "page": {
          _paq.push([
            "setCustomDimension",
            1,
            event.origin
          ]);
          _paq.push([
            "setCustomUrl",
            event.path
          ]);
          _paq.push([
            "trackPageView",
            event.title
          ]);
          break;
        }
        case "menu": {
          _paq.push([
            "setCustomUrl",
            `/${convert(event.title)}-${event.menuItemId}/`
          ]);
          _paq.push([
            "trackPageView",
            event.title
          ]);
          break;
        }
        case "category_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event,
            event.title,
            event.categoryId
          ]);
          break;
        }
        case "notebook_event":
        case "search": {
          _paq.push([
            "setCustomUrl",
            `/${convert(event.type)}`
          ]);
          _paq.push([
            "trackPageView",
            event.type
          ]);
          break;
        }
        case "search_query": {
          _paq.push([
            "trackSiteSearch",
            event.query
          ]);
          break;
        }
        case "search_result_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event,
            event.title,
            event.resultType
          ]);
          break;
        }
        case "popup": {
          _paq.push([
            "setCustomUrl",
            `/${event.title}-${event.poiId}`
          ]);
          _paq.push([
            "trackPageView",
            event.title
          ]);
          break;
        }
        case "popup_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event,
            event.title,
            event.poiId
          ]);
          break;
        }
        case "map_control_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event
          ]);
          break;
        }
        case "favorites_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event
          ]);
          break;
        }
        case "external_link": {
          _paq.push([
            "trackLink",
            event.url
          ]);
          break;
        }
        case "details_event": {
          _paq.push([
            "trackEvent",
            event.type,
            event.event,
            event.title,
            event.poiId
          ]);
          break;
        }
      }
    }
  }
  const tracking_RJtqiU4YuV = defineNuxtPlugin((nuxtApp) => {
    const trackers = [];
    return {
      provide: {
        trackingInit: (config2) => {
          if (navigator.doNotTrack !== "1") {
            const googleTagManagerId = config2.GOOGLE_TAG_MANAGER_ID;
            if (googleTagManagerId) {
              trackers.push(new Google(nuxtApp, Boolean(config2.COOKIES_CONSENT), googleTagManagerId));
            }
            const matomoUrl = config2.MATOMO_URL;
            const matomoIdsite = config2.MATOMO_SITEID;
            if (matomoUrl && matomoIdsite) {
              trackers.push(new Matomo(nuxtApp, Boolean(config2.COOKIES_CONSENT), matomoUrl, matomoIdsite));
            }
          }
        },
        tracking_consent: () => {
          if (trackers.length > 0) {
            trackers.forEach((tracker) => {
              tracker.consent();
            });
          }
        },
        tracking: (event) => {
          {
            console.error("Tracking event", event);
          }
          trackers.forEach((tracker) => {
            tracker.track(event);
          });
        }
      }
    };
  });
  const piniaSharedState = defineNuxtPlugin(({ $pinia }) => {
    $pinia.use(x({
      enable: false
    }));
  });
  const _plugins = [
    plugin,
    components_plugin_KR1HBZs4kY,
    vueuse_head_plugin_D7WGfuP1A0,
    router_PJLmOmdFeM,
    composition_sLxaNGmlSL,
    i18n_yfWm7jX06p,
    vido_config_M7tFtI8bDB,
    settings_ZJy0LLHwcO,
    fontawesome_cn2c4tOOHz,
    touch_5RFx4YnLk6,
    device_PxhEqcDcOg,
    tracking_RJtqiU4YuV,
    property_translations_PIWCHHX3IP,
    piniaSharedState,
    vuetify_7h9QAQEssH
  ];
  function render() {
    return null;
  }
  const _sfc_main = {
    __name: "nuxt-root",
    setup(__props, { expose }) {
      expose();
      const ErrorComponent = defineAsyncComponent(() => __vitePreload(() => import("./error-component-f01d9fd0.js").then(async (m) => {
        await m.__tla;
        return m;
      }), true ? ["assets/error-component-f01d9fd0.js","assets/vendor-cc850437.js"] : void 0).then((r) => r.default || r));
      const IslandRenderer = () => null;
      const nuxtApp = useNuxtApp();
      const onResolve = nuxtApp.deferHydration();
      provide("_route", useRoute());
      const results = nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
      if (results && results.some((i) => i && "then" in i)) {
        console.error("[nuxt] Error in `vue:setup`. Callbacks must be synchronous.");
      }
      const error = useError();
      onErrorCaptured((err, target, info) => {
        nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
        if (isNuxtError(err) && (err.fatal || err.unhandled)) {
          const p = callWithNuxt(nuxtApp, showError, [
            err
          ]);
          onServerPrefetch(() => p);
        }
      });
      const { islandContext } = false;
      const __returned__ = {
        ErrorComponent,
        IslandRenderer,
        nuxtApp,
        onResolve,
        results,
        error,
        islandContext,
        defineAsyncComponent,
        onErrorCaptured,
        onServerPrefetch,
        provide,
        get callWithNuxt() {
          return callWithNuxt;
        },
        get useNuxtApp() {
          return useNuxtApp;
        },
        get isNuxtError() {
          return isNuxtError;
        },
        get showError() {
          return showError;
        },
        get useError() {
          return useError;
        },
        get useRoute() {
          return useRoute;
        },
        get AppComponent() {
          return render;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock(Suspense, {
      onResolve: $setup.onResolve
    }, {
      default: withCtx(() => [
        $setup.error ? (openBlock(), createBlock($setup["ErrorComponent"], {
          key: 0,
          error: $setup.error
        }, null, 8, [
          "error"
        ])) : $setup.islandContext ? (openBlock(), createBlock($setup["IslandRenderer"], {
          key: 1,
          context: $setup.islandContext
        }, null, 8, [
          "context"
        ])) : (openBlock(), createBlock($setup["AppComponent"], {
          key: 2
        }))
      ]),
      _: 1
    }, 8, [
      "onResolve"
    ]);
  }
  const RootComponent = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "/home/runner/work/vido/vido/node_modules/nuxt/dist/app/components/nuxt-root.vue"
    ]
  ]);
  if (!globalThis.$fetch) {
    globalThis.$fetch = $fetch.create({
      baseURL: baseURL()
    });
  }
  let entry;
  const plugins = normalizePlugins(_plugins);
  {
    if (import.meta.webpackHot) {
      import.meta.webpackHot.accept();
    }
    entry = async function initApp() {
      var _a;
      const isSSR = Boolean((_a = window.__NUXT__) == null ? void 0 : _a.serverRendered);
      const vueApp = isSSR ? createSSRApp(RootComponent) : createApp(RootComponent);
      const nuxt = createNuxtApp({
        vueApp
      });
      try {
        await applyPlugins(nuxt, plugins);
      } catch (err) {
        await nuxt.callHook("app:error", err);
        nuxt.payload.error = nuxt.payload.error || err;
      }
      try {
        await nuxt.hooks.callHook("app:created", vueApp);
        await nuxt.hooks.callHook("app:beforeMount", vueApp);
        vueApp.mount("#" + appRootId);
        await nuxt.hooks.callHook("app:mounted", vueApp);
        await nextTick();
      } catch (err) {
        await nuxt.callHook("app:error", err);
        nuxt.payload.error = nuxt.payload.error || err;
      }
    };
    entry().catch((error) => {
      console.error("Error while mounting app:", error);
    });
  }
  entry$1 = (ctx) => entry(ctx);
});
export {
  __tla,
  entry$1 as default
};
