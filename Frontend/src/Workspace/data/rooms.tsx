import React from 'react';
import { Sparkles, Code, Megaphone, Globe, Rocket, LifeBuoy } from 'lucide-react';

/**
 * RoomData インターフェースは
 * アプリ内で表示される "ルーム" （組織）
 * を表す型です。
 */
export interface RoomData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  totalCoins: number;
}

/**
 * TransactionData インターフェースは
 * 送金履歴を表す型です。
 */
export interface TransactionData {
  id: string;
  senderName: string;
  amount: number;
  timestamp: string;
}

/**
 * ProjectData インターフェースは
 * 投稿（プロジェクト成果）を表す型です。
 */
export interface ProjectData {
  id: string;
  authorName: string;
  roomId: string;
  roomName: string;
  content: string;
  timestamp: string;
  totalReceived: number; // 受け取った通貨の総額
  transactions?: TransactionData[]; // 送金履歴
}

/**
 * モックデータ: ルームの一覧。実際にはAPI等から取得しますが
 * サンプルとしてアプリに組み込んでいます。
 */
export const ROOM_DATA: RoomData[] = [
  {
    id: 'r1',
    name: 'Design Studio',
    description: 'UI/UXからブランディングまで、クリエイティブの心臓部。日々のデザインへの賞賛を。',
    icon: <Sparkles size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 24,
    totalCoins: 12500,
  },
  {
    id: 'r2',
    name: 'Engineering',
    description: 'フロントエンド、バックエンドの技術共有とコードレビューへの感謝を伝えるルーム。',
    icon: <Code size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 86,
    totalCoins: 8900,
  },
  {
    id: 'r3',
    name: 'Marketing',
    description: '市場調査やプロモーションの成果を報告する場所。マーケターの功績を称えよう。',
    icon: <Megaphone size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 15,
    totalCoins: 3200,
  },
  {
    id: 'r4',
    name: 'All Hands',
    description: '全社員が参加するパブリックルーム。会社全体への貢献や大きな感謝をここで伝えましょう。',
    icon: <Globe size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 240,
    totalCoins: 45000,
  },
  {
    id: 'r5',
    name: 'Project Alpha',
    description: '極秘の新規事業プロジェクトチーム。日々の泥臭い検証作業にコインを。',
    icon: <Rocket size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 8,
    totalCoins: 1200,
  },
  {
    id: 'r6',
    name: 'Support',
    description: 'お客様の声を第一に。CSチームの丁寧な対応に感謝の気持ちを可視化。',
    icon: <LifeBuoy size={64} style={{ transition: 'all 0.3s ease' }} />,
    members: 32,
    totalCoins: 5600,
  },
];

/**
 * モックデータ: 投稿一覧。実際にはAPI等から取得しますが
 * サンプルとしてアプリに組み込んでいます。
 */
export const PROJECT_DATA: ProjectData[] = [
  {
    id: 'p1',
    authorName: '高橋太郎',
    roomId: 'r2',
    roomName: 'Engineering',
    content: 'フロントエンドの新しいUIコンポーネントライブラリを完成させました。全社で使えます。',
    timestamp: '2026-03-11 14:30',
    totalReceived: 350,
    transactions: [
      { id: 't1', senderName: '鈴木花子', amount: 100, timestamp: '2026-03-11 14:45' },
      { id: 't2', senderName: '佐藤次郎', amount: 150, timestamp: '2026-03-11 15:00' },
      { id: 't3', senderName: '山田明子', amount: 100, timestamp: '2026-03-11 15:15' },
    ],
  },
  {
    id: 'p2',
    authorName: '鈴木花子',
    roomId: 'r1',
    roomName: 'Design Studio',
    content: 'アプリのビジュアルリブランディングカンプを3案完成させました。来週プレゼンします。',
    timestamp: '2026-03-11 13:45',
    totalReceived: 250,
    transactions: [
      { id: 't4', senderName: '高橋太郎', amount: 100, timestamp: '2026-03-11 14:00' },
      { id: 't5', senderName: '佐藤次郎', amount: 150, timestamp: '2026-03-11 14:15' },
    ],
  },
  {
    id: 'p3',
    authorName: '佐藤次郎',
    roomId: 'r3',
    roomName: 'Marketing',
    content: '四半期の営業成績が目標を150%達成しました🎉',
    timestamp: '2026-03-11 12:00',
    totalReceived: 500,
    transactions: [
      { id: 't6', senderName: '鈴木花子', amount: 200, timestamp: '2026-03-11 12:30' },
      { id: 't7', senderName: '高橋太郎', amount: 200, timestamp: '2026-03-11 12:45' },
      { id: 't8', senderName: '山田明子', amount: 100, timestamp: '2026-03-11 13:00' },
    ],
  },
  {
    id: 'p4',
    authorName: '山田明子',
    roomId: 'r2',
    roomName: 'Engineering',
    content: 'バックエンドのレスポンス時間を50%削減する最適化が完了。全テスト合格です。',
    timestamp: '2026-03-10 18:20',
    totalReceived: 400,
    transactions: [
      { id: 't9', senderName: '高橋太郎', amount: 200, timestamp: '2026-03-10 18:45' },
      { id: 't10', senderName: '佐藤次郎', amount: 200, timestamp: '2026-03-10 19:00' },
    ],
  },
  {
    id: 'p5',
    authorName: '高橋太郎',
    roomId: 'r4',
    roomName: 'All Hands',
    content: '新入社員研修プログラムの改善版が完成。来月から導入予定です。',
    timestamp: '2026-03-10 10:15',
    totalReceived: 300,
    transactions: [
      { id: 't11', senderName: '鈴木花子', amount: 100, timestamp: '2026-03-10 10:45' },
      { id: 't12', senderName: '佐藤次郎', amount: 100, timestamp: '2026-03-10 11:00' },
      { id: 't13', senderName: '山田明子', amount: 100, timestamp: '2026-03-10 11:30' },
    ],
  },
];
