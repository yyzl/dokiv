const path = require('path')
const fs = require('fs-extra')
const { loadFront } = require('yaml-front-matter')

const { pascalCase } = require('./util')

module.exports = getMetadata

/**
 * extract front matters and document from markdown file
 */
async function getMetadata (file, ext = '.md') {
  const markdown = await fs.readFile(file, 'utf-8')
  let {
    body,
    route,
    layout = 'default',
    title
  } = loadFront(markdown, 'body')

  route = route.replace(/^\//, '')

  const [group, name] = route.split('/')
  const pageName = name || path.basename(file, ext)
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
