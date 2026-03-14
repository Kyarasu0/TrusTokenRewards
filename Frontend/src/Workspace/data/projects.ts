export interface TransactionData {
  id: string;
  senderName: string;
  content: string;
  timestamp: string;
  amount: number;
  txID: string;
}

export interface ProjectDetailData {
  id: number;
  authorName: string;
  roomName: string;
  content: string;
  timestamp: string;
  totalReceived: number;
  transactions: TransactionData[];
}