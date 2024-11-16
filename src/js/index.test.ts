import { test, describe } from 'node:test'
import assert from 'node:assert'
import SmartTooltip from './index.ts'

const MouseEvent = window.MouseEvent

describe('SmartTooltip', () => {
  let trigger: HTMLElement

  test('beforeEach', () => {
    // Setup DOM elements
    document.body.innerHTML = ''
    trigger = document.createElement('div')
    trigger.setAttribute('data-tooltip', 'Test tooltip')
    document.body.appendChild(trigger)
    new SmartTooltip()
  })

  test('should initialize with default options', () => {
    const instance = new SmartTooltip()
    assert.equal(instance.triggerName, 'data-tooltip')
  })

  test('should initialize with custom options', () => {
    const instance = new SmartTooltip({ triggerName: 'custom-tooltip' })
    assert.equal(instance.triggerName, 'data-custom-tooltip')
  })

  test('should show tooltip on hover', () => {
    trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    const tooltipElement = document.querySelector('div[class*="tooltip"]')
    assert.ok(tooltipElement?.classList.contains('visible'))
    assert.equal(tooltipElement?.textContent, 'Test tooltip')
  })

  test('should show tooltip on touchstart', () => {
    trigger.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }))
    const tooltipElement = document.querySelector('div[class*="tooltip"]')
    assert.ok(tooltipElement?.classList.contains('visible'))
    assert.equal(tooltipElement?.textContent, 'Test tooltip')
  })

  test('should hide tooltip on mouseout', () => {
    trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    trigger.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    const tooltipElement = document.querySelector('div[class*="tooltip"]')
    assert.ok(!tooltipElement?.classList.contains('visible'))
  })

  test('should hide tooltip on touchend', () => {
    trigger.dispatchEvent(new MouseEvent('touchstart', { bubbles: true }))
    trigger.dispatchEvent(new MouseEvent('touchend', { bubbles: true }))
    const tooltipElement = document.querySelector('div[class*="tooltip"]')
    assert.ok(!tooltipElement?.classList.contains('visible'))
  })

  test('should toggle tooltip on click for click-type triggers', () => {
    trigger.setAttribute('data-tooltip-type', 'click')
    trigger.click()
    const tooltipElement = document.querySelector('div[class*="tooltip"]')
    assert.ok(tooltipElement?.classList.contains('visible'))
    trigger.click()
    assert.ok(!tooltipElement?.classList.contains('visible'))
  })

  test('should calculate correct position', () => {
    // Mock getBoundingClientRect
    trigger.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    })

    trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    const tooltipElement = document.querySelector('div[class*="tooltip"]') as HTMLElement
    assert.ok(tooltipElement?.style.top)
    assert.ok(tooltipElement?.style.left)
    assert.ok(tooltipElement?.dataset.position)
  })

  test('should fit tooltip in viewport', () => {
    const instance = new SmartTooltip()
    const rect: DOMRect = {
      x: 400,
      y: 400,
      width: 250,
      height: 50,
      top: 400,
      right: 400,
      bottom: 400,
      left: 400,
      toJSON: () => ({}),
    }
    assert.ok(instance['fitsInViewport']({ name: 'top', x: 100, y: 100 }, rect))
    assert.ok(!instance['fitsInViewport']({ name: 'top', x: -100, y: -100 }, rect))
  })
})
