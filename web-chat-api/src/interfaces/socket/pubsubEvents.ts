import SocketEvent from "../../enums/SocketEvent.enum.js";
import { IChat } from "../chat.interface.js";
import { IMessage } from "../message.interface.js";
import { Edge } from "../modelConnection.interface.js";
import { IUser } from "../user.interface.js";

export type PubsubEvents = {
  [SocketEvent.messageAdded]: { messageAdded: Edge<IMessage>; chatId: string };
  [SocketEvent.chatChanged]: { chatChanged: IChat };
  [SocketEvent.messageChanged]: { messageChanged: Edge<IMessage> };
  [SocketEvent.messageTyping]: {
    messageTyping: {
      typingUser: IUser;
      isTyping: boolean;
    };
    chatId: string;
  };
};
