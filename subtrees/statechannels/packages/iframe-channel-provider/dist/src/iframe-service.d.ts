export declare enum UIElementNames {
    Styles = "channelProviderUiStyles",
    Container = "channelProviderUiContainer",
    IFrame = "channelProviderUi"
}
export declare const cssStyles: string;
export declare class IFrameService {
    protected get container(): HTMLDivElement | null;
    protected get iframe(): HTMLIFrameElement | null;
    protected get styles(): HTMLStyleElement | null;
    protected url: string;
    setUrl(url: string): void;
    mount(): Promise<void>;
    unmount(): void;
    setVisibility(visible: boolean): void;
    getTarget(): Promise<Window>;
}
//# sourceMappingURL=iframe-service.d.ts.map