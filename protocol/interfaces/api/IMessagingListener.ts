export interface IMessagingListener {
    onMessageRecieved(callback: (message: Message)=>void): void;
}