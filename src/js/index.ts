import styles from '../css/tooltip.module.css'

interface SmartTooltipOptions {
  triggerName: string
}

interface Position {
  name: 'top' | 'bottom' | 'left' | 'right'
  x: number
  y: number
}

const defaultOptions = {
  triggerName: 'tooltip',
}

export class SmartTooltip {
  readonly triggerName: string
  private readonly tooltip: HTMLDivElement
  private activeTriggerType: string | null = null
  private readonly spacing = 12

  constructor(options: SmartTooltipOptions = defaultOptions) {
    this.triggerName = `data-${options.triggerName}`
    this.tooltip = document.createElement('div')
    this.tooltip.className = styles.tooltip
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
    ]

    return positions.find(pos => this.fitsInViewport(pos, tooltipRect)) || positions[0]
  }

  private fitsInViewport(pos: Position, tooltipRect: DOMRect): boolean {
    return (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x + tooltipRect.width <= window.innerWidth &&
      pos.y + tooltipRect.height <= window.innerHeight
    )
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

declare global {
  interface Window {
    SmartTooltip: typeof SmartTooltip
  }
}

if (window !== undefined) {
  window.SmartTooltip = SmartTooltip
}

export default SmartTooltip
