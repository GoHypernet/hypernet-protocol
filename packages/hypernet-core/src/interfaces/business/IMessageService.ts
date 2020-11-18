import { EthereumAddress, MessagePayload } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 * @todo I think we can delete this entirely?
 */
export interface IMessageService {
  
  /**
   * @param message
   */
  messageRecieved(message: MessagePayload): Promise<void>;

  /**
   * @param destination
   * @param payload
   */
  sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void>;
}
