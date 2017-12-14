const globby = require('globby')
const md2vue = require('./md2vue')
const getMetadata = require('./getMetadata')

/**
 *  get router info and urls
 */
module.exports = async function getDocsInfo (glob) {
  const pages = await extractDocumentInfo(glob)
  const routers = []
  const urls = []

  for (let page of pages) {
    const {
      component,
      layout,
      fullPath,
      isMain
    } = page

    if (isMain) {
      urls.unshift('/')
      routers.unshift(`{
        path: "/",
        component: (${component}),
        meta: { layout: "${layout}" }
      }`)
    } else {
      urls.push(fullPath)
      routers.push(`{
        path: "${fullPath}",
        component: (${component}),
        meta: { layout: "${layout}" }
      }`)
    }
  }

  routers.push(`{ path: "*", redirect: "/" }`)
  return { urls, routers }
}

/**
 * extract metadata from files
 */
async function extractDocumentInfo (glob) {
  const pages = []

  for (let file of await globby(glob)) {
    const metadata = await getMetadata(file)
    const compCode = await md2vue(metadata)
    metadata.component = compCode
    pages.push(metadata)
  }

  return pages
}
