interface SmartTooltipOptions {
    triggerName: string;
}
export declare class SmartTooltip {
    readonly triggerName: string;
    private readonly tooltip;
    private activeTriggerType;
    private readonly spacing;
    constructor(options?: SmartTooltipOptions);
    private setupEventListeners;
    private readonly handleClick;
    private readonly handleMouseOver;
    private readonly handleMouseOut;
    private readonly handleResize;
    private readonly handleScroll;
    private isVisible;
    private calculatePosition;
    private fitsInViewport;
    private show;
    private hide;
    destroy(): void;
}
declare global {
    interface Window {
        SmartTooltip: typeof SmartTooltip;
    }
}
export default SmartTooltip;
