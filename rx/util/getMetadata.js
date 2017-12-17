const { readFileSync } = require('fs-extra')
const { basename, extname } = require('path')
const { loadFront } = require('yaml-front-matter')
const pascalCase = require('./pascalCase')

/**
 * extract front matters and document from markdown file
 */
module.exports = (file, markdown) => {
  if (typeof markdown === 'undefined') {
    markdown = readFileSync(file, 'utf-8')
  }

  let {
    body,
    route,
    layout = 'default',
    title
  } = loadFront(markdown, 'body')

  route = route.replace(/^\//, '')

  const [group, name] = route.split('/')
  const pageName = name || basename(file, extname(file))
  const componentName = pascalCase(`${group}-${pageName}`)

  const isMain = group === 'index' && !name

  return {
    layout,
    fullPath: isMain ? '/' : `/${route}`,

    title,
    componentName,
    markdown: body
  }
}
