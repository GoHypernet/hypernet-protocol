

export interface IMessagingRepository {
    sendMessage(destination: Adddress, message: Message)
}