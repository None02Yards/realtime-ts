export interface MockChat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
    isRecent?: boolean; 
  isPinned?: boolean; 
}
