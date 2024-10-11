type TMessage = {
  sender: string;
  message: string;
  timestamp: string;
};

type TRoom = {
  recipientId: string;
  recipientName: string;
  recipientImage: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadMessages: boolean;
};

type TUser = {
  id: string;
  name: string;
  image: string;
};

type TChatState = {
  messages: { [key: string]: TMessage[] };
  unreadMessages: { [key: string]: boolean };
  recipient: TUser | null;
  rooms: TRoom[];
  message: string;
};


export type { TMessage, TRoom, TUser, TChatState };