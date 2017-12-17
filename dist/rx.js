'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var require$$0 = _interopDefault(require('path'));
var require$$1 = _interopDefault(require('fs-extra'));
var vm = _interopDefault(require('vm'));
var jsYaml = _interopDefault(require('js-yaml'));
var LRU = _interopDefault(require('lru-cache'));
var revHash = _interopDefault(require('rev-hash'));
var lodash = _interopDefault(require('lodash.isequal'));
var findNpmPrefix = _interopDefault(require('find-npm-prefix'));
var rxjs = _interopDefault(require('rxjs'));
var eazyLogger = _interopDefault(require('eazy-logger'));
var md2vue = _interopDefault(require('md2vue'));
var prepack = _interopDefault(require('prepack'));
var chokidar = _interopDefault(require('chokidar'));
var express = _interopDefault(require('express'));
var vueServerRenderer = _interopDefault(require('vue-server-renderer'));
var vue = _interopDefault(require('vue'));
var vueMeta = _interopDefault(require('vue-meta'));
var vueRouter = _interopDefault(require('vue-router'));
var objectAssign = _interopDefault(require('object-assign'));
var uglifyJs = _interopDefault(require('uglify-js'));
var yamlFrontMatter = _interopDefault(require('yaml-front-matter'));
var buble = _interopDefault(require('buble'));
var vueify = _interopDefault(require('vueify'));
var vueTemplateCompiler = _interopDefault(require('vue-template-compiler'));
var rollup = _interopDefault(require('rollup'));
var rollupPluginVue = _interopDefault(require('rollup-plugin-vue'));
var rollupPluginJson = _interopDefault(require('rollup-plugin-json'));
var rollupPluginBuble = _interopDefault(require('rollup-plugin-buble'));
var rollupPluginReplace = _interopDefault(require('rollup-plugin-replace'));
var rollupPluginCommonjs = _interopDefault(require('rollup-plugin-commonjs'));
var rollupPluginNodeResolve = _interopDefault(require('rollup-plugin-node-resolve'));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var logger = eazyLogger.Logger({
  prefix: '{blue:[}{magenta:Dokiv}{blue:]}',
  useLevelPrefixes: true
});

var logger_1 = logger;

var vueEnv = null;
var nodeEnv = null;

var set = function () {
  vueEnv = process.env.VUE_ENV;
  nodeEnv = process.env.NODE_ENV;
  process.env.VUE_ENV = 'browser';
  process.env.NODE_ENV = 'production';
};

var restore = function () {
  process.env.VUE_ENV = vueEnv;
  process.env.NODE_ENV = nodeEnv;
};

var prodEnv = {
	set: set,
	restore: restore
};

var lrucCache = new LRU();

/**
 * compile markdown to precompiled vue component
 */
var md2vue_1 = function compileVue (ref) {
  var title = ref.title;
  var markdown = ref.markdown;
  var componentName = ref.componentName;

  var hash = revHash(markdown);
  var cache = lrucCache.get(hash) || {};
  var hit = cache.code &&
    (cache.title === title &&
      cache.name === componentName);

  if (hit) {
    return Promise.resolve(cache.code)
  }

  var id = 0;
  // FIXME
  var customMarkups = function () {
    var uid = componentName + "-" + (id++);
    return ("\n<input id=\"" + uid + "\" type=\"checkbox\" tabindex=\"-1\" aria-hidden=\"true\"/>\n<label for=\"" + uid + "\" aria-hidden=\"true\"></label>\n<div class=\"vue-demo-tools\">\n  <div>\n    <a @click=\"$code.open($event)\" title=\"在 Codepen 中打开\"><c-icon type=\"feather\" name=\"codepen\" class=\"vue-demo-tools__icon\"/></a>\n    <a @click=\"$code.copy($event)\" title=\"复制代码\"><c-icon type=\"feather\" name=\"copy\" class=\"vue-demo-tools__icon\"/></a>\n  </div>\n</div>")
  };

  var documentInfo = {
    // eslint-disable-next-line
    metaInfo: new Function(("return { title: \"" + title + "\" }"))
  };

  var conf = {
    target: 'js',
    highlight: 'highlight.js',
    documentInfo: documentInfo,
    componentName: componentName,
    customMarkups: customMarkups
  };

  return Promise.resolve(prodEnv.set())
    .then(function () { return md2vue(markdown, conf); })
    .then(function (raw) {
      prodEnv.restore();
      var code = "(function(){\n  var " + componentName + " = null;\n  " + (prepack.prepack(raw).code) + ";\n  return " + componentName + ";\n})()";
      lrucCache.set(hash, { title: title, code: code, name: componentName });
      return code
    })
};

/**
 * https://github.com/tools-rx/watch-rx/
 *
 * Copyright (c) 2016 Dave F. Baskin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */



var Observable = rxjs.Observable;

var GlobResultFile = function GlobResultFile () {};

var prototypeAccessors = { fullname: { configurable: true },basename: { configurable: true },dirname: { configurable: true },extname: { configurable: true },hasName: { configurable: true } };

prototypeAccessors.fullname.get = function () {
  if (this.hasName) {
    return require$$0.resolve(this.basedir || '', this.name).replace(/\\/g, '/')
  }
};

prototypeAccessors.basename.get = function () {
  if (this.hasName) {
    return require$$0.basename(this.name)
  }
};

prototypeAccessors.dirname.get = function () {
  if (this.hasName) {
    return require$$0.dirname(this.fullname).replace(/\\/g, '/')
  }
};

prototypeAccessors.extname.get = function () {
  if (this.hasName) {
    return require$$0.extname(this.name)
  }
};

prototypeAccessors.hasName.get = function () {
  return (!!this.basedir && !!this.name) || !!this.name
};

Object.defineProperties( GlobResultFile.prototype, prototypeAccessors );

var watcherCache = new Map();
var rxWatch = function watchRx (pattern, ref) {
  var basedir = ref.basedir;

  return Observable
    .create(function (observer) {
      var isFinished = false;
      var watcher = null;
      var key = "@@" + ([].concat(pattern).join('@'));
      var cache = watcherCache.get(key);

      if (cache) {
        watcher = cache;
      } else {
        watcher = chokidar.watch(pattern);
        // watcher.removeAllListeners()
        watcherCache.set(key, watcher);
      }

      var nextItem = function (event) { return function (name) { return observer.next(Object.assign(new GlobResultFile(), {
        event: event,
        basedir: basedir,
        name: name.replace(/\\/g, '/')
      })); }; };

      ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(function (event) {
        watcher.on(event, nextItem(event));
      });

      watcher.on('error', function (err) {
        isFinished = true;
        observer.error(err);
        closeWatcher();
      });

      return function () {
        if (!isFinished) {
          closeWatcher();
        }
      }

      // Node doesn't exit after closing watchers
      // https://github.com/paulmillr/chokidar/issues/434
      function closeWatcher () {
        watcher.close();
        watcherCache.delete(key);
      }
    })
};

function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault$1(vue);
var VueMeta = _interopDefault$1(vueMeta);
var VueRouter = _interopDefault$1(vueRouter);
var objectAssign$1 = _interopDefault$1(objectAssign);

Vue.use(VueMeta);
Vue.use(VueRouter);
Object.assign = objectAssign$1;

function createApp (ref) {
  var url = ref.url;
  var routes = ref.routes;
  var mode = ref.mode; if ( mode === void 0 ) { mode = 'hash'; }
  var el = ref.el;
  var template = ref.template;
  var data = ref.data; if ( data === void 0 ) { data = {}; }
  var render = ref.render;
  var staticRenderFns = ref.staticRenderFns;
  var layouts = ref.layouts;
  var plugins = ref.plugins;

  var routerConfig = {
    mode: mode,
    routes: routes,
    scrollBehavior: function () { return ({ x: 0, y: 0 }); }
  };

  if (url) {
    data.url = url;
  }

  Object.keys(layouts).forEach(function (key) {
    layouts && Vue.component(("layout-" + key), layouts[key]);
  });

  plugins.forEach(function (plugin) { return plugin && plugin.install && Vue.use(plugin); });

  var router = new VueRouter(routerConfig);
  var app = new Vue({
    template: template,
    router: router,
    data: data,
    render: render,
    staticRenderFns: staticRenderFns
  });

  router.onReady(function () {
    app.$mount('#app');
  });

  return { app: app, router: router }
}

if (typeof window !== 'undefined' && window.window === window) {
  window.Vue = Vue;
}

var ssr = createApp;

var server = express();
var renderer = vueServerRenderer
  .createRenderer({ template: '<!--vue-ssr-outlet-->' });

var devServer = {
  started: false,
  reset: function reset (ref) {
    var hash = ref.hash;
    var port = ref.port;
    var staticDir = ref.staticDir;
    var ssrConfig = ref.ssrConfig;

    var ref$1 = ssr(ssrConfig);
    var app = ref$1.app;
    var router = ref$1.router;
    this.app = app;
    this.router = router;
    this.hash = hash;
    this.staticDir = staticDir;

    if (this.started === false) {
      this.serveFavico();
      this.serveStatic();
      this.serveOthers();
    }

    if (!this.port) {
      var port$1 = new Date().getFullYear();
      this.port = port$1;
      server.listen(port$1);
      logger_1.info('Server listening on port: ', port$1);
    }
  },

  serveStatic: function serveStatic () {
    var this$1 = this;

    server.use('/static', function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      express.static(this$1.staticDir).apply(void 0, args);
    });
  },

  serveFavico: function serveFavico () {
    server.use('/favicon.ico', function (_, res) { return res.end(''); });
  },

  serveOthers: function serveOthers () {
    var this$1 = this;

    server.get('*', function (req, res) {
      var url = req.url;
      var ref = this$1;
      var app = ref.app;
      var router = ref.router;
      var hash = ref.hash;
      router.push(url);
      router.onReady(function () {
        if (!router.getMatchedComponents().length) {
          return res.status(404).end('<pre>Not found</pre>')
        }

        var stream = renderer.renderToStream(app);

        stream.once('data', function (_) { return res.write(getResponseHead(app, hash)); });
        stream.on('data', function (chunk) { return res.write(chunk); });
        stream.on('end', function (_) { return res.end(getResponseTail(app, hash)); });
        stream.on('error', function (error) {
          console.log(error);
          res.status(500).end(("<pre>" + (error.stack) + "</pre>"));
        });
        res.set('Content-Type', 'text/html');
      });
    });
  }
};

function getResponseHead (app, hash) {
  var ref = app.$meta().inject();
  var title = ref.title;
  var htmlAttrs = ref.htmlAttrs;
  var bodyAttrs = ref.bodyAttrs;
  var link = ref.link;
  var style = ref.style;
  var script = ref.script;
  var noscript = ref.noscript;
  var meta = ref.meta;

  var arr = [title, link, style, script, noscript, meta];
  return ("<!doctype html>\n<html data-vue-meta-server-rendered " + (htmlAttrs.text()) + ">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n    " + (arr.map(function (it) { return it.text(); }).join('')) + "\n    <link rel=\"stylesheet\" href=\"/static/style." + (hash.style || 'xxx') + ".css\">\n  </head>\n  <body " + (bodyAttrs.text()) + ">")
}

function getResponseTail (app, hash) {
  return ("<script src=\"/static/vendor." + (hash.vendor) + ".js\"></script>\n    <script src=\"/static/app." + (hash.app) + ".js\"></script>\n  </body>\n</html>")
}

/**
 * generate bundle of pages
 */
var bundlePages = function (ref) {
  var code = ref.code; if ( code === void 0 ) code = [];
  var routers = ref.routers; if ( routers === void 0 ) routers = [];
  var mode = ref.mode; if ( mode === void 0 ) mode = 'hash';

  var routersCode = "var routes = [" + (routers.join(',\n')) + "];";

  var appConfig = "{\n    el: \"#app\",\n    mode: \"" + mode + "\",\n    routes: routes,\n    render: function (h) {\n      var layout = this.$route.meta.layout || 'default'\n      return h('layout-' + layout)\n    },\n    data: {},\n    layouts: Layout,\n    plugins: Plugins\n  }";

  var client = "\n    ;(function (){\n    " + (code.join(';')) + "\n    " + routersCode + "\n    createApp(" + appConfig + ");\n    }());\n  ";

  var ssr = "\n    " + (code.join(';')) + "\n    " + routersCode + "\n    module.exports = " + appConfig + ";\n  ";

  var isProd = process.env.DOC_ENV === 'production';
  var browser = isProd ? uglifyJs.minify(client).code : client;

  return {
    ssr: ssr,
    browser: browser
  }
};

var kebabCase = function kebabCase (name) {
  return name
    .replace(/^[A-Z]/, function (m) { return m.toLowerCase(); })
    .replace(
      /([0-9a-zA-Z])[\b\s]*([0-9A-Z])/g,
      function (m, g1, g2) { return (g1 + "-" + (g2.toLowerCase())); }
    )
};

var pascalCase = function pascalCase (name) {
  return kebabCase(name)
    .replace(/-([0-9a-zA-Z])/g, function (m, g1) { return g1.toUpperCase(); })
    .replace(/^[a-z]/, function (m) { return m.toUpperCase(); })
};

var getMetadata = createCommonjsModule(function (module) {
var readFileSync = require$$1.readFileSync;
var basename = require$$0.basename;
var extname = require$$0.extname;
var loadFront = yamlFrontMatter.loadFront;


/**
 * extract front matters and document from markdown file
 */
module.exports = function (file, markdown) {
  if (typeof markdown === 'undefined') {
    markdown = readFileSync(file, 'utf-8');
  }

  var ref = loadFront(markdown, 'body');
  var body = ref.body;
  var route = ref.route;
  var layout = ref.layout; if ( layout === void 0 ) layout = 'default';
  var title = ref.title;

  route = route.replace(/^\//, '');

  var ref$1 = route.split('/');
  var group = ref$1[0];
  var name = ref$1[1];
  var pageName = name || basename(file, extname(file));
  var componentName = pascalCase((group + "-" + pageName));

  var isMain = group === 'index' && !name;

  return {
    layout: layout,
    fullPath: isMain ? '/' : ("/" + route),

    title: title,
    componentName: componentName,
    markdown: body
  }
};
});

var compileVueWithoutStyle = createCommonjsModule(function (module) {
var compiler = vueify.compiler;
var parseComponent = vueTemplateCompiler.parseComponent;



compiler.applyConfig({
  extractCSS: true,
  customCompilers: {
    buble: function buble$1$$1 (content, cb) {
      var ref = buble.transform(content);
      var code = ref.code;
      var ret = code
        .replace(/\n{2,}/g, '\n')
        .replace(/^\s+/, '  ')
        .replace(/\s+$/, '');

      cb(null, ret);
    }
  }
});

module.exports = function (content, filePath) {
  if ( content === void 0 ) content = '';
  if ( filePath === void 0 ) filePath = '';

  var ref = parseComponent(content);
  var template = ref.template;
  var script = ref.script;
  var isPug = ['jade', 'pug'].includes(template.attrs.lang);
  script = !script ? 'module.exports = {}' : script.content;
  script = script.replace(/export default/, 'module.exports =');

  var sfc = "<template lang=\"" + (isPug ? 'pug' : 'html') + "\">" + (template.content) + "</template>\n<script lang=\"buble\">" + script + "</script>";

  return new Promise(function (resolve, reject) {
    prodEnv.set();
    compiler.compile(sfc, filePath, function (err, result) {
      prodEnv.restore();
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
};
});

var basename = require$$0.basename;
var readFile = require$$1.readFile;




var lruCache = new LRU();

var compileLayout = function compileLayoutFile (file, content) {
  var fileName = basename(file, '.vue');

  return readFile(file, 'utf-8')
    .then(function (content) {
      var hash = revHash(content);
      var cache = lruCache.get(hash);
      if (cache) {
        return cache
      }
      return compileVueWithoutStyle(content, pascalCase(fileName))
        .then(function (compiled) {
          var ret = "\n\"" + fileName + "\": (function () {\n  var module = { exports: {} }; \n  " + compiled + ";\n  return module.exports;\n}())";
          lruCache.set(hash, ret);
          return ret
        })
    })
};

var extname = require$$0.extname;
var basename$1 = require$$0.basename;

var readFile$1 = require$$1.readFile;











var lruCache$1 = new LRU();

var plugins = [
  rollupPluginVue(),
  rollupPluginNodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js', '.json']
  }),
  rollupPluginCommonjs(),
  rollupPluginReplace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  rollupPluginJson(),
  rollupPluginBuble()
];

var compilePlugin = function compilePlugin (file) {
  return readFile$1(file).then(function (content) {
    var hash = revHash(content);
    var cache = lruCache$1.get(hash);

    if (cache) {
      return cache
    }

    var name = pascalCase(basename$1(file, extname(file)));
    var inputOptions = {
      input: file,
      plugins: plugins
    };
    var outputOptions = {
      name: name,
      format: 'iife',
      sourcemap: false,
      strict: true
    };

    return rollup
      .rollup(inputOptions)
      .then(function (bundle) { return bundle.generate(outputOptions); })
      .then(function (ref) {
        var code = ref.code;

        var ret = { name: name, code: code };
        lruCache$1.set(hash, ret);
        return ret
      })
  })
};

var rx = createCommonjsModule(function (module) {
var join = require$$0.join;
var resolve = require$$0.resolve;

var existsSync = require$$1.existsSync;
var readFile = require$$1.readFile;
var writeFile = require$$1.writeFile;
var writeFileSync = require$$1.writeFileSync;
var emptyDir = require$$1.emptyDir;
var ensureDir = require$$1.ensureDir;
var ensureFileSync = require$$1.ensureFileSync;
var copy = require$$1.copy;









var Observable = rxjs.Observable;
var fromPromise = Observable.fromPromise;
var combineLatest = Observable.combineLatest;










var noop = function () {};
var sandBox = {
  console: new Proxy({}, {
    get: function get () {
      return noop
    }
  }),
  module: {}
};

process.env.DOCKIV_ENV = process.env.NODE_ENV;

var lruCache = new LRU();

var npmPrefix$ = fromPromise(findNpmPrefix(process.cwd()));
var configuration$ = npmPrefix$
  .map(function (prefix) { return [prefix, join(prefix, 'dokiv.yml')]; })
  .flatMap(function (ref) {
    var prefix = ref[0];
    var file = ref[1];

    if (existsSync(file) === false) {
      return Observable.throw("dokiv.yml " +
        "not found under current working directory!"
      )
    }
    return rxWatch(file, { basedir: prefix })
  })
  .flatMap(function (ref) {
    var event = ref.event;
    var fullname = ref.fullname;

    if (event === 'add' || event === 'change') {
      return readFile(fullname)
        .then(function (content) {
          var hash = revHash(content);
          var cache = lruCache.get(hash);
          if (cache) {
            return cache
          } else {
            var ret = jsYaml.safeLoad(content);
            lruCache.set(hash, ret);
            return ret
          }
        })
    }
    return Observable.throw('dokiv.yaml was removed!')
  })
  .distinctUntilChanged(lodash)
  .combineLatest(npmPrefix$)
  .flatMap(function (ref) {
    var conf = ref[0];
    var prefix = ref[1];

    var rootDir = conf.rootDir; if ( rootDir === void 0 ) rootDir = prefix;
    var output = conf.output; if ( output === void 0 ) output = resolve(prefix, 'dokiv');
    var documents = conf.documents; if ( documents === void 0 ) documents = [];

    conf.npmPrefix = prefix;
    conf.globs = {
      layouts: resolve(prefix, rootDir, 'layouts/*.vue'),
      plugins: resolve(prefix, rootDir, 'plugins/*.js'),
      documents: [].concat(documents).map(function (f) { return resolve(prefix, f); })
    };

    conf.output = resolve(prefix, output);
    conf.staticSource = resolve(prefix, rootDir, 'static');
    conf.staticOutput = resolve(prefix, output, 'static');

    // vendor bundle
    var bundle = resolve(__dirname, '../dist/bundle.js');
    return readFile(bundle)
      .then(function (content) {
        var hash = revHash(content);
        conf.vendor = { hash: hash, content: content };
        return conf
      })
  });

var vendorHash$ = configuration$
  // prepare files & dirs
  .switchMap(function (ref) {
    var staticSource = ref.staticSource;
    var staticOutput = ref.staticOutput;
    var output = ref.output;
    var vendor = ref.vendor;

    return emptyDir(output)
    .then(function () { return ensureDir(staticOutput); })
    .then(function () { return copy(staticSource, staticOutput); })
    .then(function () {
      var hash = vendor.hash;
      var content = vendor.content;
      writeFile((staticOutput + "/vendor." + hash + ".js"), content);
      return hash
    });
}
  );

var pluginBundle$ = configuration$
  .flatMap(function (conf) {
    var plugins = conf.globs.plugins;
    var npmPrefix = conf.npmPrefix;
    return rxWatch(plugins, { basedir: npmPrefix })
  })
  .map(function (ref) {
    var event = ref.event;
    var fullname = ref.fullname;

    return { event: event, file: fullname }
  })
  .scan(function (map, ref, index) {
    var event = ref.event;
    var file = ref.file;

    logger_1.info(("Plugin " + (event.replace(/e?$/, 'ed')) + ": " + file));

    if (index === 0) {
      map = new Map();
    }

    if (event === 'unlink') {
      map.delete(file);
    } else if (event === 'add' || event === 'change') {
      map.set(file, compilePlugin(file));
    }
    return map
  }, null)
  .flatMap(function (map) { return Promise.all(
      Array.from(map.keys())
        .map(function (file) { return map.get(file); })
    ); }
  )
  .map(function (data) {
    var code = data.map(function (ref) {
      var code = ref.code;

      return code;
    }).join('\n');
    code += "\nvar Plugins = [";
    code += data.map(function (ref) {
      var name = ref.name;

      return ("typeof " + name + " !== 'undefined' && " + name);
    }).join(',\n');
    code += '\n]';
    return code
  });

var layoutBundle$ = configuration$
  .flatMap(function (conf) {
    var layouts = conf.globs.layouts;
    var npmPrefix = conf.npmPrefix;
    return rxWatch(layouts, { basedir: npmPrefix })
  })
  .map(function (ref) {
    var event = ref.event;
    var fullname = ref.fullname;

    return { event: event, file: fullname }
  })
  .scan(function (map, ref, index) {
    var event = ref.event;
    var file = ref.file;

    logger_1.info(("Layout " + (event.replace(/e?$/, 'ed')) + ": " + file));
    if (index === 0) {
      map = new Map();
    }

    if (event === 'unlink') {
      map.delete(file);
    } else if (event === 'add' || event === 'change') {
      map.set(file, compileLayout(file));
    }
    return map
  }, null)
  .flatMap(function (map) { return Promise.all(
      Array.from(map.keys())
        .map(function (file) { return map.get(file); })
    ); }
  )
  .map(function (data) { return ("var Layout = {" + (data.join(',\n')) + "};"); });

var documents$ = configuration$
  .flatMap(function (conf) {
    var documents = conf.globs.documents;
    var npmPrefix = conf.npmPrefix;
    return rxWatch(documents, { basedir: npmPrefix })
  })
  .map(function (ref) {
    var event = ref.event;
    var fullname = ref.fullname;

    return { event: event, file: fullname }
  })
  .scan(function (map, ref, index) {
    var event = ref.event;
    var file = ref.file;

    logger_1.info(("File " + (event.replace(/e?$/, 'ed')) + ": " + file));
    if (index === 0) {
      map = new Map();
    }

    if (event === 'unlink') {
      map.delete(file);
    } else if (event === 'add' || event === 'change') {
      var metadata = getMetadata(file);
      map.set(file, {
        metadata: metadata,
        code$: md2vue_1(metadata)
      });
    }
    return map
  }, null)
  .switchMap(function (map) { return Promise.all(
      Array.from(map.keys())
        .map(function (file) { return map.get(file); })
        .map(function (ref) {
          var code$ = ref.code$;
          var metadata = ref.metadata;

          return code$.then(function (code) {
            metadata.component = code;
            return metadata
          })
        })
    ); }
  )
  .map(function (metadatas) {
    var urls = metadatas.map(function (i) { return i.fullPath; });
    var routers = metadatas.map(function (ref) {
      var component = ref.component;
      var layout = ref.layout;
      var fullPath = ref.fullPath;

      return ("{\n        path: \"" + fullPath + "\",\n        component: (" + component + "),\n        meta: { layout: \"" + layout + "\" }\n      }");
    })
      .concat('{ path: "*", redirect: "/" }');
    return { routers: routers, urls: urls }
  });

combineLatest([
  configuration$,
  vendorHash$,
  pluginBundle$,
  layoutBundle$,
  documents$
])
  .catch(function (e) { return logger_1.error(e); })
  .subscribe(function (ref) {
    var ref_0 = ref[0];
    var routerMode = ref_0.routerMode;
    var port = ref_0.port;
    var staticOutput = ref_0.staticOutput;
    var vendorHash = ref[1];
    var plugins = ref[2];
    var layouts = ref[3];
    var ref_4 = ref[4];
    var routers = ref_4.routers;
    var urls = ref_4.urls;
    var codes = ref_4.codes;

    var ref$1 = bundlePages({
      mode: routerMode,
      routers: routers,
      code: [plugins, layouts]
    });
    var ssr = ref$1.ssr;
    var browser = ref$1.browser;

    vm.runInNewContext(ssr, sandBox);

    var appHash = revHash(browser);
    ensureFileSync((staticOutput + "/app." + appHash + ".js"));
    writeFileSync((staticOutput + "/app." + appHash + ".js"), browser);

    var hash = {
      app: appHash,
      vendor: vendorHash
    };

    devServer.reset({
      hash: hash,
      port: port,
      staticDir: staticOutput,
      ssrConfig: sandBox.module.exports
    });
  });
});

module.exports = rx;
