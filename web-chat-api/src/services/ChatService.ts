import { DefaultEventsMap, Server, Socket } from "socket.io";
import Chat from "../models/Chat.model";
import SocketEvent from "../enums/SocketEvent.enum";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import { toObjectId } from "../utils/mongoose";
import User from "../models/User.model";
import Contact from "../models/Contact.model";

class ChatService {
  getChatList = async ({
    userId,
    first = 10,
    after,
  }: {
    userId: string;
    sort?: any;
    first?: number;
    after?: string;
  }): Promise<IModelConnection<IChat>> => {
    const filter = { users: userId } as any;

    if (after) {
      filter._id = { $lt: toObjectId(after) };
    }

    const docs = await Chat.find(filter)
      .populate("users")
      .sort({ updatedAt: -1 })
      .limit(first + 1);

    const hasNextPage = docs.length > first;
    const sliced = hasNextPage ? docs.slice(0, first) : docs;

    const edges = sliced.map((doc) => ({
      cursor: doc._id.toString(),
      node: doc,
    }));

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? edges[0].cursor : null,
        hasNextPage,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
      },
    };
  };

  createChat = async (users: string[]) => {
    const nicknames = new Map<string, string>();

    for (let userId of users) {
      const user = await User.findById(userId);

      if (user) nicknames.set(userId, user.fullname);
    }

    const chat = await Chat.create({ users, nicknames });

    if (users.length == 2)
      await Contact.findOneAndUpdate({ users }, { chatId: chat.id });

    return chat;
  };
}

const chatService = new ChatService();

export default chatService;
