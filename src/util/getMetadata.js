import { readFileSync } from 'fs-extra'
import { basename, extname } from 'path'
import { loadFront } from 'yaml-front-matter'
import pascalCase from './pascalCase'

/**
 * extract front matters and document from markdown file
 */
export default (file, markdown) => {
  if (typeof markdown === 'undefined') {
    markdown = readFileSync(file, 'utf-8')
  }

  if (markdown.trim() === '') {
    return 'Empty markdown: '
  }

  let {
    route,
    title,
    highlight,
    body = '# Not Found',
    layout = 'default',
    meta = {}
  } = loadFront(markdown, 'body')

  meta.title = meta.title || title

  if (!meta.title) {
    return 'Field `title` or `meta.title` is not defined: '
  }

  if (!route) {
    return 'Field `route` is not defined: '
  }

  route = route.replace(/^\//, '')

  const [group, name] = route.split('/')
  const pageName = name || basename(file, extname(file))
  const componentName = pascalCase(`doc-${layout}-${group}-${pageName}`)

  const isMain = group === 'index' && !name

  return {
    layout,
    fullPath: isMain ? '/' : `/${route}`,
    highlight,

    meta,
    componentName,
    markdown: body
  }
}
