module.exports = {
  pascalCase,
  kebabCase
}

/**
 * my-comp => MyComp
 */
function pascalCase (name) {
  return kebabCase(name)
    .replace(/-([0-9a-zA-Z])/g, (m, g1) => g1.toUpperCase())
    .replace(/^[a-z]/, m => m.toUpperCase())
}

/**
 * MyComp => my-comp
 */
function kebabCase (name) {
  return name
    .replace(/^[A-Z]/, m => m.toLowerCase())
    .replace(
      /([0-9a-zA-Z])[\b\s]*([0-9A-Z])/g,
      (m, g1, g2) => `${g1}-${g2.toLowerCase()}`
    )
}