export interface IStateChannelListener {
    onChannelUpdated(callback: ()=>void): void;
}