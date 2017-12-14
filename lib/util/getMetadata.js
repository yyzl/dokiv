const { readFile } = require('fs-extra')
const { basename, extname } = require('path')
const { loadFront } = require('yaml-front-matter')
const { pascalCase } = require('./case')

/**
 * extract front matters and document from markdown file
 */
module.exports = async (file) => {
  const markdown = await readFile(file, 'utf-8')

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

  return {
    title,
    layout,
    componentName,
    category: group,
    path: pageName,
    fullPath: `/${route}`,
    isMain: group === 'index' && !name,
    markdown: body
  }
}
