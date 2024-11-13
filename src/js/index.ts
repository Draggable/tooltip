import styles from '../css/tooltip.module.css'

console.log(styles)

interface SmartTooltipOptions {
  triggerName: string
}

const defaultOptions = {
  triggerName: 'tooltip',
}

export class SmartTooltip {
  private readonly options: SmartTooltipOptions
  private readonly tooltip: HTMLDivElement
  private activeTriggerType: string | null = null

  constructor(options: SmartTooltipOptions = defaultOptions) {
    this.options = options
    this.tooltip = document.createElement('div')
    this.tooltip.className = styles.tooltip
    document.body.appendChild(this.tooltip)

    this.setupEventListeners()
  }

  private setupEventListeners() {
    const triggerName = `data-${this.options.triggerName}`
    // Handle hover-based tooltips
    document.addEventListener('mouseover', e => {
      const trigger = (e.target as Element).closest(`[${triggerName}]`)
      if (this.activeTriggerType !== 'click' && trigger?.getAttribute(`${triggerName}-type`) !== 'click') {
        const content = trigger?.getAttribute(`${triggerName}`)
        if (content) {
          this.show(trigger as HTMLElement, content)
          this.activeTriggerType = 'hover'
        }
      }
    })

    document.addEventListener('mouseout', e => {
      const trigger = (e.target as Element).closest(`[${triggerName}]`)
      if (this.activeTriggerType !== 'click' && trigger?.getAttribute(`${triggerName}-type`) !== 'click') {
        this.hide()
      }
    })

    // Handle click-based tooltips
    document.addEventListener('click', e => {
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
    })
  }

  private isVisible(): boolean {
    return this.tooltip.classList.contains(styles.visible)
  }

  calculatePosition(trigger: Element) {
    const triggerRect = trigger.getBoundingClientRect()
    const tooltipRect = this.tooltip.getBoundingClientRect()
    const spacing = 12 // Space between tooltip and trigger

    // Try positions in order of preference
    const positions = [
      {
        name: 'top',
        x: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        y: triggerRect.top - tooltipRect.height - spacing,
      },
      {
        name: 'bottom',
        x: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        y: triggerRect.bottom + spacing,
      },
      {
        name: 'right',
        x: triggerRect.right + spacing,
        y: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
      {
        name: 'left',
        x: triggerRect.left - tooltipRect.width - spacing,
        y: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
      },
    ]

    // Find first position that fits in viewport
    for (const pos of positions) {
      if (this.fitsInViewport(pos.x, pos.y, tooltipRect.width, tooltipRect.height)) {
        return pos
      }
    }

    // If no position fits perfectly, default to top
    return positions[0]
  }

  fitsInViewport(x: number, y: number, width: number, height: number): boolean {
    return x >= 0 && y >= 0 && x + width <= window.innerWidth && y + height <= window.innerHeight
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
}

export default SmartTooltip
