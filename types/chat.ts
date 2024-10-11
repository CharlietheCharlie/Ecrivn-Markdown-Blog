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
  unreadMessages: { [key: string]: boolean };
  rooms: TRoom[];
  messages: { [key: string]: TMessage };
};


export type { TMessage, TRoom, TUser, TChatState };