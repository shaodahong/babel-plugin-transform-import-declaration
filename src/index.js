import { declare } from '@babel/helper-plugin-utils'
import { types as t } from '@babel/core'
import { addDefault, addSideEffect } from '@babel/helper-module-imports'

function transformFilename(filename) {
  return filename.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

export default declare((api, options) => {
  api.assertVersion(7)

  const { libraryName, module, style } = options

  return {
    name: 'transform-module',

    visitor: {
      ImportDeclaration(path) {
        const { source, specifiers } = path.node

        // exclude
        // import { Component } from 'module1'
        if (!t.isStringLiteral(source, { value: module })) {
          return
        }

        // exclude
        // import Default from 'module'
        // import * as Default from 'module'
        if (
          t.isImportNamespaceSpecifier(specifiers[0]) ||
          t.isImportDefaultSpecifier(specifiers[0])
        ) {
          return
        }

        const dirName = libraryName ? `${libraryName}/` : ''

        const newImports = specifiers.map(item => {
          const importedName = transformFilename(item.imported.name)
          if (style) {
            addSideEffect(
              path,
              typeof style === 'function'
                ? style(importedName)
                : `${module}/${dirName}${importedName}/style`,
            )
          }
          return t.ImportDeclaration(
            [t.ImportNamespaceSpecifier(item.local)],
            t.StringLiteral(`${module}/${dirName}${importedName}`),
          )
        })
        path.replaceWithMultiple(newImports)
      },

      ExportNamedDeclaration(path) {
        const { source, specifiers } = path.node

        if (!t.isStringLiteral(source, { value: module })) {
          return
        }

        path.node.source = null

        const dirName = libraryName ? `${libraryName}/` : ''

        specifiers.forEach(spec => {
          const exportedName = transformFilename(spec.local.name)
          spec.local = addDefault(path, `${module}/${dirName}${exportedName}`)
        })
      },
    },
  }
})
