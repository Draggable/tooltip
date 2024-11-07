import pkg from './package.json'

export const isProduction = process.env.NODE_ENV === 'production'
export const shortName = pkg.name.replace(/^@.*\//, '')
export const camelCaseName = shortName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
export const version = pkg.version
export const pkgName = pkg.name

export const bannerTemplate = `
/**
${pkg.name} - ${pkg.homepage}
Version: ${pkg.version}
Author: ${pkg.author}
*/

`
