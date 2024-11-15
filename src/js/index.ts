import styles from '../css/tooltip.module.css'

interface SmartTooltipOptions {
  triggerName: string
}

interface Position {
  name: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  x: number
  y: number
}

const defaultOptions = {
  triggerName: 'tooltip',
}

/**
 * The `SmartTooltip` class provides functionality to display tooltips on HTML elements.
 * Tooltips can be triggered by mouse hover or click events and are positioned optimally
 * within the viewport to avoid overflow.
 *
 * @example
 * ```typescript
 * const tooltip = new SmartTooltip({
 *   triggerName: 'tooltip'
 * });
 * ```
 *
 * @remarks
 * The tooltip content is specified using a data attribute on the trigger element.
 * The tooltip can be triggered by elements with the specified `triggerName` data attribute.
 *
 * @param {SmartTooltipOptions} options - Configuration options for the tooltip.
 *
 * @property {string} triggerName - The name of the data attribute used to trigger the tooltip.
 * @property {HTMLDivElement} tooltip - The tooltip element.
 * @property {string | null} activeTriggerType - The type of the currently active trigger ('click' or 'hover').
 * @property {number} spacing - The spacing between the tooltip and the trigger element.
 *
 * @method setupEventListeners - Sets up event listeners for mouseover, mouseout, click, resize, and scroll events.
 * @method handleClick - Handles click events to show or hide the tooltip.
 * @method handleMouseOver - Handles mouseover events to show the tooltip.
 * @method handleMouseOut - Handles mouseout events to hide the tooltip.
 * @method handleResize - Handles window resize events to hide the tooltip.
 * @method handleScroll - Handles window scroll events to hide the tooltip.
 * @method isVisible - Checks if the tooltip is currently visible.
 * @method calculatePosition - Calculates the optimal position for the tooltip relative to the trigger element.
 * @method fitsInViewport - Checks if the tooltip fits within the viewport and is not obstructed by other elements.
 * @method show - Displays the tooltip with the specified content.
 * @method hide - Hides the tooltip.
 * @method destroy - Removes event listeners and the tooltip element from the DOM.
 */
export class SmartTooltip {
  readonly triggerName: string
  private readonly tooltip: HTMLDivElement
  private activeTriggerType: string | null = null
  private readonly spacing = 12

  constructor(options: SmartTooltipOptions = defaultOptions) {
    this.triggerName = `data-${options.triggerName}`
    this.tooltip = document.createElement('div')
    this.tooltip.className = `d-tooltip ${styles.tooltip}`
    document.body.appendChild(this.tooltip)

    this.setupEventListeners()
  }

  private setupEventListeners() {
    document.addEventListener('mouseover', this.handleMouseOver)
    document.addEventListener('mouseout', this.handleMouseOut)
    document.addEventListener('click', this.handleClick)
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll, true)
  }

  private readonly handleClick = (e: Event): void => {
    const triggerName = this.triggerName
    const trigger = (e.target as Element).closest(`[${triggerName}][${triggerName}-type="click"]`)
    if (trigger) {
      if (this.isVisible()) {
        this.hide()
      } else {
        const content = trigger.getAttribute(`${triggerName}`)
        this.show(trigger as HTMLElement, content)
        this.activeTriggerType = 'click'
      }
    } else {
      this.hide()
    }
  }

  private readonly handleMouseOver = (e: Event): void => {
    const triggerName = this.triggerName
    const trigger = (e.target as Element).closest(`[${triggerName}]`)
    if (this.activeTriggerType !== 'click' && trigger?.getAttribute(`${triggerName}-type`) !== 'click') {
      const content = trigger?.getAttribute(`${triggerName}`)
      if (content) {
        this.show(trigger as HTMLElement, content)
        this.activeTriggerType = 'hover'
      }
    }
  }

  private readonly handleMouseOut = (e: Event): void => {
    const triggerName = this.triggerName
    const trigger = (e.target as Element).closest(`[${triggerName}]`)
    if (this.activeTriggerType !== 'click' && trigger?.getAttribute(`${triggerName}-type`) !== 'click') {
      this.hide()
    }
  }

  private readonly handleResize = (): void => {
    if (this.isVisible()) {
      this.hide()
    }
  }

  private readonly handleScroll = (): void => {
    if (this.isVisible()) {
      this.hide()
    }
  }

  private isVisible(): boolean {
    return this.tooltip.classList.contains(styles.visible)
  }

  /**
   * Calculates the optimal position for the tooltip relative to the trigger element.
   * It tries to find a position where the tooltip fits within the viewport.
   * If no position fits, it defaults to the first position in the list.
   *
   * @param {HTMLElement} trigger - The HTML element that triggers the tooltip.
   * @returns {Position} The calculated position for the tooltip.
   */
  private calculatePosition(trigger: HTMLElement): Position {
    const triggerRect = trigger.getBoundingClientRect()
    const tooltipRect = this.tooltip.getBoundingClientRect()

    const positions: Position[] = [
      {
        name: 'top',
        x: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        y: triggerRect.top - tooltipRect.height - this.spacing,
      },
      {
        name: 'bottom',
        x: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        y: triggerRect.bottom + this.spacing,
      },
      {
        name: 'left',
        x: triggerRect.left - tooltipRect.width - this.spacing,
        y: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
      {
        name: 'right',
        x: triggerRect.right + this.spacing,
        y: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
      // Corner positions
      {
        name: 'top-left',
        x: triggerRect.left,
        y: triggerRect.top - tooltipRect.height - this.spacing,
      },
      {
        name: 'top-right',
        x: triggerRect.right - tooltipRect.width,
        y: triggerRect.top - tooltipRect.height - this.spacing,
      },
      {
        name: 'bottom-left',
        x: triggerRect.left,
        y: triggerRect.bottom + this.spacing,
      },
      {
        name: 'bottom-right',
        x: triggerRect.right - tooltipRect.width,
        y: triggerRect.bottom + this.spacing,
      },
    ]

    return positions.find(pos => this.fitsInViewport(pos, tooltipRect)) || positions[0]
  }

  /**
   * Checks if the tooltip fits within the viewport and is not obstructed by other elements.
   *
   * @param pos - The position of the tooltip.
   * @param tooltipRect - The bounding rectangle of the tooltip.
   * @returns `true` if the tooltip fits within the viewport and is not obstructed, otherwise `false`.
   */
  private fitsInViewport(pos: Position, tooltipRect: DOMRect): boolean {
    // First check if tooltip is within viewport bounds
    const inViewport =
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x + tooltipRect.width <= window.innerWidth &&
      pos.y + tooltipRect.height <= window.innerHeight

    if (!inViewport) return false

    // Check if tooltip is obstructed by other elements
    const points = [
      [pos.x, pos.y], // Top-left
      [pos.x + tooltipRect.width, pos.y], // Top-right
      [pos.x, pos.y + tooltipRect.height], // Bottom-left
      [pos.x + tooltipRect.width, pos.y + tooltipRect.height], // Bottom-right
      [pos.x + tooltipRect.width / 2, pos.y + tooltipRect.height / 2], // Center
    ]

    // Get all elements at these points
    const elementsAtPoints = points.flatMap(([x, y]) => Array.from(document.elementsFromPoint(x, y)))

    // Filter out non-relevant elements
    const obstructingElements = elementsAtPoints.filter(element => {
      if (
        this.tooltip.contains(element) || // Exclude tooltip and its children
        element === this.tooltip ||
        element.classList.contains(styles.tooltip) || // Ignore other tooltips
        getComputedStyle(element).pointerEvents === 'none' // Ignore non-interactive elements
      ) {
        return false
      }
    })

    return obstructingElements.length === 0
  }

  private show(trigger: HTMLElement, content: string | null) {
    this.tooltip.innerHTML = content ?? ''
    this.tooltip.classList.add(styles.visible)

    const position = this.calculatePosition(trigger)
    this.tooltip.style.left = `${position.x}px`
    this.tooltip.style.top = `${position.y}px`
    this.tooltip.dataset.position = position.name
  }

  private hide() {
    this.tooltip.classList.remove(styles.visible)
    this.activeTriggerType = null
  }

  public destroy(): void {
    document.removeEventListener('mouseover', this.handleMouseOver)
    document.removeEventListener('mouseout', this.handleMouseOut)
    document.removeEventListener('click', this.handleClick)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll, true)
    this.tooltip.remove()
  }
}

export const Tooltip = SmartTooltip

declare global {
  interface Window {
    SmartTooltip: typeof SmartTooltip
  }
}

if (window !== undefined) {
  window.SmartTooltip = SmartTooltip
}

export default SmartTooltip
