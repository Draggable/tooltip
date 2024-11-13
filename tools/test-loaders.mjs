export function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.css')) {
    return {
      url: new URL('./mock.css', import.meta.url).href,
      shortCircuit: true, // Signals intentional end of resolution
    }
  }
  return defaultResolve(specifier, context, defaultResolve)
}

export function load(url, context, defaultLoad) {
  if (url.endsWith('.css')) {
    return {
      format: 'module',
      source: `
      export default {
        visible: 'visible',
        tooltip: 'tooltip'
      };
      `,
      shortCircuit: true, // Signals intentional end of loading
    }
  }
  return defaultLoad(url, context, defaultLoad)
}
