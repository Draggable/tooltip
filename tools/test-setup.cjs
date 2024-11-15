const { snapshot } = require('node:test')
const { basename, join, dirname } = require('node:path')
const { JSDOM } = require('jsdom')

const { window } = new JSDOM('<!DOCTYPE html><p>Hello World</p>', { pretendToBeVisual: true })

window.document.elementsFromPoint = function elementsFromPoint() {
  return []
}

// jsdom does not provide this method
window.Element.prototype.animate = () => ({
  finished: Promise.resolve(),
  addEventListener: () => {},
  removeEventListener: () => {},
})

global.window = window
global.document = window.document
global.navigator = window.navigator

snapshot.setResolveSnapshotPath(testFile => join(dirname(testFile), '__snapshots__', `${basename(testFile)}.snapshot`))
