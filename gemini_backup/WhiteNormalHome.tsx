import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Code, 
  Megaphone, 
  Globe, 
  Rocket, 
  LifeBuoy, 
  Bell, 
  User, 
  Coins,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// 1. スタイル定義 (CSS Modulesの代替として文字列で定義し、注入します)
// ============================================================================
const styles = `
/* -------------------------------------
   全体レイアウト・背景 (Glassmorphism基盤)
-------------------------------------- */
.appContainer {
  /* 大きさ設定 */
  min-height: 100vh;
  width: 100%;
  /* バックグラウンド設定 */
  background-color: #f5f5f7; /* Appleライクな明るいグレー */
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 配置基準設定 */
  position: relative;
  /* 装飾設定 */
  overflow-x: hidden;
  /* 文字設定 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1d1d1f;
}

/* 背景を彩るぼやけたオーブ（Glassmorphismを美しく見せるための光源） */
.ambientOrb1 {
  /* 大きさ設定 */
  width: 50vw;
  height: 50vw;
  /* バックグラウンド設定 */
  background: radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
  /* 配置基準設定 */
  position: fixed;
  top: -10vw;
  left: -10vw;
  /* 装飾設定 */
  border-radius: 50%;
  filter: blur(80px);
  /* アニメーション設定 */
  z-index: 0;
  pointer-events: none;
}

.ambientOrb2 {
  /* 大きさ設定 */
  width: 60vw;
  height: 60vw;
  /* バックグラウンド設定 */
  background: radial-gradient(circle, rgba(196, 181, 253, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  /* 配置基準設定 */
  position: fixed;
  bottom: -20vw;
  right: -10vw;
  /* 装飾設定 */
  border-radius: 50%;
  filter: blur(80px);
  /* アニメーション設定 */
  z-index: 0;
  pointer-events: none;
}

/* -------------------------------------
   ヘッダー (Glassmorphism)
-------------------------------------- */
.header {
  /* 大きさ設定 */
  width: 100%;
  height: 72px;
  /* 要素配置設定 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 余白設定 */
  padding: 0 5%;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.7);
  /* 装飾設定 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  /* 配置基準設定 */
  position: fixed;
  top: 0;
  left: 0;
  /* アニメーション設定 */
  z-index: 100;
}

.headerLogo {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 12px;
  /* 文字設定 */
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.headerActions {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 16px;
}

.iconButton {
  /* 大きさ設定 */
  width: 40px;
  height: 40px;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.5);
  /* 装飾設定 */
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  /* 文字設定 */
  color: #1d1d1f;
  /* アニメーション設定 */
  transition: all 0.2s ease;
  cursor: pointer;
}

.iconButton:hover {
  /* バックグラウンド設定 */
  background: #ffffff;
  /* 装飾設定 */
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

/* -------------------------------------
   メインコンテンツ & Bento Grid
-------------------------------------- */
.mainContent {
  /* 大きさ設定 */
  width: 100%;
  max-width: 1200px;
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  /* 余白設定 */
  padding: 120px 24px 80px;
  /* 配置基準設定 */
  position: relative;
  /* アニメーション設定 */
  z-index: 10;
}

.pageTitle {
  /* 文字設定 */
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  /* 余白設定 */
  margin-bottom: 8px;
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 12px;
}

.pageSubtitle {
  /* 文字設定 */
  font-size: 1.1rem;
  color: #86868b;
  font-weight: 500;
  /* 余白設定 */
  margin-bottom: 40px;
}

.bentoGrid {
  /* 要素配置設定 */
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  /* 大きさ設定 */
  width: 100%;
}

@media (min-width: 768px) {
  .bentoGrid {
    /* 要素配置設定 */
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(220px, auto);
  }
  .size-large {
    /* 要素配置設定 */
    grid-column: span 2;
    grid-row: span 2;
  }
  .size-wide {
    /* 要素配置設定 */
    grid-column: span 2;
  }
}

/* -------------------------------------
   Room Card (Bento Grid Item)
-------------------------------------- */
.roomCard {
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 大きさ設定 */
  height: 100%;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.6);
  /* 装飾設定 */
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 32px;
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
  /* 余白設定 */
  padding: 32px;
  /* 配置基準設定 */
  position: relative;
  overflow: hidden;
  /* アニメーション設定 */
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease, background 0.4s ease;
  cursor: pointer;
}

/* ホバー時の Micro-interaction */
.roomCard:hover {
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.9);
  /* 装飾設定 */
  box-shadow: 0 20px 50px -10px rgba(0,0,0,0.1);
  /* アニメーション設定 */
  transform: translateY(-8px) scale(1.01);
}

.roomCard:active {
  /* アニメーション設定 */
  transform: translateY(0) scale(0.98);
}

/* カード内の黒いアイコンボックス */
.cardIconBox {
  /* 大きさ設定 */
  width: 56px;
  height: 56px;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* バックグラウンド設定 */
  background: #1d1d1f; /* かっこよさを演出する黒 */
  /* 文字設定 */
  color: #ffffff;
  /* 装飾設定 */
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  /* アニメーション設定 */
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ホバーでアイコンが少し回転して浮き上がる遊び心 */
.roomCard:hover .cardIconBox {
  /* アニメーション設定 */
  transform: scale(1.1) rotate(8deg);
}

.cardHeader {
  /* 要素配置設定 */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* 余白設定 */
  margin-bottom: 24px;
}

.cardTitle {
  /* 文字設定 */
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  /* 余白設定 */
  margin-bottom: 8px;
}

.cardDesc {
  /* 文字設定 */
  font-size: 1rem;
  color: #86868b;
  line-height: 1.5;
  /* 余白設定 */
  margin-bottom: 24px;
}

.cardFooter {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 16px;
  /* 余白設定 */
  margin-top: auto;
}

.statBadge {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 6px;
  /* 余白設定 */
  padding: 6px 12px;
  /* バックグラウンド設定 */
  background: rgba(0, 0, 0, 0.04);
  /* 装飾設定 */
  border-radius: 20px;
  /* 文字設定 */
  font-size: 0.85rem;
  font-weight: 600;
  color: #515154;
}

/* 矢印アイコンのアニメーション */
.arrowIcon {
  /* 配置基準設定 */
  position: absolute;
  bottom: 32px;
  right: 32px;
  /* 文字設定 */
  color: #1d1d1f;
  /* アニメーション設定 */
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.roomCard:hover .arrowIcon {
  /* アニメーション設定 */
  opacity: 1;
  transform: translateX(0);
}

/* -------------------------------------
   Fade-in Up アニメーションクラス
-------------------------------------- */
.fadeInUp {
  /* アニメーション設定 */
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.fadeInUp.visible {
  /* アニメーション設定 */
  opacity: 1;
  transform: translateY(0);
}

/* -------------------------------------
   トースト通知 (アラートの代わり)
-------------------------------------- */
.toast {
  /* 配置基準設定 */
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 12px;
  /* バックグラウンド設定 */
  background: #1d1d1f;
  /* 文字設定 */
  color: white;
  font-weight: 600;
  /* 余白設定 */
  padding: 16px 24px;
  /* 装飾設定 */
  border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  /* アニメーション設定 */
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1000;
}

.toast.show {
  /* アニメーション設定 */
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
`;


// ============================================================================
// 2. モックデータ定義 (組織/ルーム情報)
// ============================================================================
type RoomSize = 'normal' | 'wide' | 'large';

interface RoomData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  totalCoins: number;
  size: RoomSize;
}

const ROOM_DATA: RoomData[] = [
  { 
    id: 'r1', 
    name: 'Design Studio', 
    description: 'UI/UXからブランディングまで、クリエイティブの心臓部。日々のデザインの共有と感謝を。', 
    icon: <Sparkles size={28} />, 
    members: 24, 
    totalCoins: 12500,
    size: 'large' // Bento Gridで大きく表示
  },
  { 
    id: 'r2', 
    name: 'Engineering', 
    description: 'フロントエンド、バックエンドの技術共有ルーム。', 
    icon: <Code size={24} />, 
    members: 86, 
    totalCoins: 8900,
    size: 'normal'
  },
  { 
    id: 'r3', 
    name: 'Marketing', 
    description: '市場調査やプロモーションの成果を報告する場所。', 
    icon: <Megaphone size={24} />, 
    members: 15, 
    totalCoins: 3200,
    size: 'normal'
  },
  { 
    id: 'r4', 
    name: 'All Hands', 
    description: '全社員が参加するパブリックルーム。会社全体への貢献や大きな感謝をここで伝えましょう。', 
    icon: <Globe size={24} />, 
    members: 240, 
    totalCoins: 45000,
    size: 'wide' // Bento Gridで横長に表示
  },
  { 
    id: 'r5', 
    name: 'Project Alpha', 
    description: '極秘の新規事業プロジェクトチーム。', 
    icon: <Rocket size={24} />, 
    members: 8, 
    totalCoins: 1200,
    size: 'normal'
  },
  { 
    id: 'r6', 
    name: 'Support', 
    description: 'お客様の声を第一に。CSチームのルーム。', 
    icon: <LifeBuoy size={24} />, 
    members: 32, 
    totalCoins: 5600,
    size: 'normal'
  },
];


// ============================================================================
// 3. 内部処理・アニメーション用カスタムフック
// ============================================================================

/**
 * スクロールに合わせて要素がフワッと浮かび上がる「Fade-in Up」を実現するフック。
 * 難しい計算はブラウザのIntersectionObserverに任せています。
 */
function useFadeInUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 画面に少しでも要素が入ったら(threshold: 0.1)表示フラグを立てる
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 一度表示されたら監視を終了する（スクロールを戻してもアニメーションを繰り返さないため）
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isVisible };
}


// ============================================================================
// 4. コンポーネント定義
// ============================================================================

/**
 * 組織（ルーム）を表示するBento Grid用のカードコンポーネント。
 * ホバー時のMicro-interactionが含まれます。
 */
const RoomCard: React.FC<{ room: RoomData; onClick: (name: string) => void }> = ({ room, onClick }) => {
  // アニメーションフックを利用して、カード自身にFade-in処理を付与
  const { ref, isVisible } = useFadeInUp();

  return (
    <div 
      ref={ref}
      // isVisibleがtrueになったら .visible クラスを付与してCSSアニメーションを発火
      // room.size に応じてBento Grid内の占有エリアを変更
      className={`roomCard fadeInUp size-${room.size} ${isVisible ? 'visible' : ''}`}
      onClick={() => onClick(room.name)}
    >
      <div>
        <div className="cardHeader">
          <div className="cardIconBox">
            {room.icon}
          </div>
          <button className="iconButton" style={{ width: '32px', height: '32px' }} onClick={(e) => {
            e.stopPropagation(); // 親のカードクリックイベントを止める
            alert("組織の詳細メニューを開きます");
          }}>
            <Building2 size={16} />
          </button>
        </div>
        
        <h3 className="cardTitle">{room.name}</h3>
        <p className="cardDesc">{room.description}</p>
      </div>

      <div className="cardFooter">
        <div className="statBadge">
          <User size={14} />
          <span>{room.members}</span>
        </div>
        <div className="statBadge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
          <Coins size={14} />
          {/* カンマ区切りでコイン数を表示 */}
          <span>{room.totalCoins.toLocaleString()}</span>
        </div>
      </div>

      <ArrowRight className="arrowIcon" size={24} />
    </div>
  );
};


/**
 * メインアプリケーションコンポーネント
 */
export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // トースト（通知メッセージ）を表示する関数
  const showToast = (message: string) => {
    setToastMessage(message);
    // 3秒後に自動で消す
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRoomClick = (roomName: string) => {
    // 実際はここで router.push(`/rooms/${roomId}`) などの画面遷移処理が入ります
    showToast(`「${roomName}」ルームに入室します🚀`);
  };

  return (
    <>
      {/* CSSの注入 */}
      <style>{styles}</style>

      <div className="appContainer">
        {/* 背景の装飾 (Glassmorphismを映えさせる) */}
        <div className="ambientOrb1"></div>
        <div className="ambientOrb2"></div>

        {/* ヘッダー */}
        <header className="header">
          <div className="headerLogo">
            <Coins color="#1d1d1f" size={28} />
            <span>KudosCoin</span>
          </div>
          <div className="headerActions">
            <button className="iconButton" onClick={() => showToast('通知はありません')}>
              <Bell size={18} />
            </button>
            <button className="iconButton" style={{ background: '#1d1d1f', color: 'white' }} onClick={() => showToast('プロフィール設定を開きます')}>
              <User size={18} />
            </button>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="mainContent">
          <div style={{ marginBottom: '40px' }}>
            <h1 className="pageTitle">
              Your Rooms
            </h1>
            <p className="pageSubtitle">
              参加している組織のルーム。日々の仕事への感謝をコインに乗せて贈りましょう。
            </p>
          </div>

          {/* Bento Grid レイアウト */}
          <div className="bentoGrid">
            {ROOM_DATA.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={handleRoomClick} 
              />
            ))}
          </div>
        </main>

        {/* トースト通知 (alertの代わりとなる洗練されたUI) */}
        <div className={`toast ${toastMessage ? 'show' : ''}`}>
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      </div>
    </>
  );
}