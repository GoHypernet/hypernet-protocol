import {Message} from "@interfaces/objects";

export interface IStateChannelRepository {
    push_message(message: Message): void;
}