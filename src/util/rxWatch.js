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

const path = require('path')
const chokidar = require('chokidar')
const { Observable } = require('rxjs')

class GlobResultFile {
  get fullname () {
    if (this.hasName) {
      return path.resolve(this.basedir || '', this.name).replace(/\\/g, '/')
    }
  }

  get file () {
    return this.fullname
  }

  get basename () {
    if (this.hasName) {
      return path.basename(this.name)
    }
  }

  get dirname () {
    if (this.hasName) {
      return path.dirname(this.fullname).replace(/\\/g, '/')
    }
  }

  get extname () {
    if (this.hasName) {
      return path.extname(this.name)
    }
  }

  get hasName () {
    return (!!this.basedir && !!this.name) || !!this.name
  }
}

const watcherCache = new Map()

module.exports = function watchRx (pattern, basedir) {
  return Observable
    .create((observer) => {
      let isFinished = false
      let watcher = null
      const key = `@@${[].concat(pattern).join('@')}`
      const cache = watcherCache.get(key)

      if (cache) {
        watcher = cache
      } else {
        watcher = chokidar.watch(pattern)
        watcherCache.set(key, watcher)
      }

      const nextItem = (event) => (name) => observer.next(Object.assign(new GlobResultFile(), {
        event,
        basedir,
        name: name.replace(/\\/g, '/')
      }));

      ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(event => {
        watcher.on(event, nextItem(event))
      })

      watcher.on('error', err => {
        isFinished = true
        observer.error(err)
        closeWatcher()
      })

      return () => {
        if (!isFinished) {
          closeWatcher()
        }
      }

      // Node doesn't exit after closing watchers
      // https://github.com/paulmillr/chokidar/issues/434
      function closeWatcher () {
        watcher.close()
        watcherCache.delete(key)
      }
    })
}
