# dokiv

Static site generator with Vue and Markdown.

This project is inspired by [nuxt.js](https://github.com/nuxt/nuxt.js/).

## Usage

```bash
# as global module
npm install -g dokiv
# as local dependency
npm install --save dokiv
```

Watch mode with live-reloading:

```bash
dokiv -w
# or
dokiv --watch
```

Generate static files:

```bash
dokiv
```

## Configuration

A `dokiv.yml` must be found under the root of your project.

You can take a look at [./dokiv.yml](./example/dokiv.yml).

* `highlight`: default code highlight theme, `highlight.js` or `prism` 
* `routerMode`: vue router mode, either`hash` or `history`
* `rootDir`: root directory of docs
* `output`: dest directory
* `documents`: [glob](https://github.com/isaacs/node-glob) to markdown pages, array or string
* `postcss`: postcss configuration
  * `postcss.entry`: string, path to CSS entry
  * `postcss.minify`: boolean, whether to minify output (always true in watch mode)
  * `postcss.sourcemap`: boolean, whether to use inline sourcemap (always true in watch mode)
  * `postcss.plugins`: array of PostCSS plugins (defaults to `postcss-import` and `postcss-cssnext`)
* `externals`: additional css/javascript urls


## Directory Structure

Suppose your `rootDir` is `docs`, following subdirs are required.

- `docs/static`: static contents
- `docs/plugins`: JavaScript modules, each can exposes an `install` method with constructor `Vue` injected, and a `routing` method where `router`（VueRouter instance） injected.
- `docs/layouts`: `.vue` files(single file Vue components) for various types of layouts

## Markdown Rule

```
---
layout: default
route: /post/2017/12/record
title: 'A record for Nov 12 2017'
# specify highlight theme for this file
highlight: 'prism'
meta:
  title: 'A record for Nov 12 2017'
  titleTemplate: '%s - Yay!'
---

# My record

lorem ipsum....
```

Note:

* `layout` and `route` are required.
* `title` or `meta.title` is required.
* more info about `meta`, click [here](https://github.com/declandewet/vue-meta).

Here is the markdown [demo](./example/content/index.md).

Click [here](https://github.com/AngusFu/dokiv-example) to get an example. 

## Reference

### En
- [Vue](https://vuejs.org/)
- [Vue-Router](https://router.vuejs.org/en/)
- [vue-meta](https://github.com/declandewet/vue-meta)
- [md2vue](https://github.com/AngusFu/md2vue)

### 中文
- [Vue](https://cn.vuejs.org/)
- [Vue-Router](https://router.vuejs.org/zh-cn/)
