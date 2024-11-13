interface SmartTooltipOptions {
    triggerName: string;
}
export declare class SmartTooltip {
    private readonly options;
    private readonly tooltip;
    private activeTriggerType;
    constructor(options?: SmartTooltipOptions);
    private setupEventListeners;
    private isVisible;
    calculatePosition(trigger: Element): {
        name: string;
        x: number;
        y: number;
    };
    fitsInViewport(x: number, y: number, width: number, height: number): boolean;
    private show;
    private hide;
}
export default SmartTooltip;
