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
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  LogOut
} from 'lucide-react';

// ============================================================================
// 1. スタイル定義 (CSS Modulesの代替)
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
  background-color: #f5f5f7;
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

/* 背景を彩るぼやけたオーブ */
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
   ログイン画面
-------------------------------------- */
.authContainer {
  /* 大きさ設定 */
  min-height: 100vh;
  width: 100%;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 余白設定 */
  padding: 24px;
  /* 配置基準設定 */
  position: relative;
  /* アニメーション設定 */
  z-index: 10;
}

.authCard {
  /* 大きさ設定 */
  width: 100%;
  max-width: 420px;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.6);
  /* 装飾設定 */
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 32px;
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.1);
  /* 余白設定 */
  padding: 48px 32px;
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.authLogo {
  /* 余白設定 */
  margin-bottom: 24px;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 大きさ設定 */
  width: 64px;
  height: 64px;
  /* バックグラウンド設定 */
  background: #1d1d1f;
  /* 装飾設定 */
  border-radius: 20px;
  /* 文字設定 */
  color: white;
}

.authTitle {
  /* 文字設定 */
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  /* 余白設定 */
  margin-bottom: 8px;
  text-align: center;
}

.authDesc {
  /* 文字設定 */
  font-size: 0.95rem;
  color: #86868b;
  text-align: center;
  line-height: 1.5;
  /* 余白設定 */
  margin-bottom: 32px;
}

.inputGroup {
  /* 大きさ設定 */
  width: 100%;
  /* 余白設定 */
  margin-bottom: 16px;
  /* 配置基準設定 */
  position: relative;
}

.inputIcon {
  /* 配置基準設定 */
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  /* 文字設定 */
  color: #86868b;
}

.textInput {
  /* 大きさ設定 */
  width: 100%;
  /* 余白設定 */
  padding: 16px 16px 16px 48px;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.8);
  /* 装飾設定 */
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  /* 文字設定 */
  font-size: 1rem;
  color: #1d1d1f;
  /* アニメーション設定 */
  transition: all 0.2s ease;
}

.textInput:focus {
  /* 装飾設定 */
  outline: none;
  border-color: #1d1d1f;
  box-shadow: 0 0 0 4px rgba(29, 29, 31, 0.1);
}

.primaryButton {
  /* 大きさ設定 */
  width: 100%;
  /* 余白設定 */
  padding: 16px;
  margin-top: 8px;
  /* バックグラウンド設定 */
  background: #1d1d1f;
  /* 文字設定 */
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  /* 装飾設定 */
  border: none;
  border-radius: 16px;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  /* アニメーション設定 */
  transition: all 0.2s ease;
  cursor: pointer;
}

.primaryButton:hover {
  /* 装飾設定 */
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(29, 29, 31, 0.2);
}

.primaryButton:active {
  /* 装飾設定 */
  transform: translateY(0);
}

/* -------------------------------------
   メインコンテンツ & 均一なグリッド
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

.uniformGrid {
  /* 要素配置設定 */
  display: grid;
  /* 全てのカードが最小300pxの同じ幅で、画面幅に応じて列数が自動調整される */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  /* 大きさ設定 */
  width: 100%;
}

/* -------------------------------------
   Room Card (均一サイズ・巨大アイコン版)
-------------------------------------- */
.roomCard {
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
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
  padding: 24px;
  /* 配置基準設定 */
  position: relative;
  overflow: hidden;
  /* アニメーション設定 */
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease, background 0.4s ease;
  cursor: pointer;
}

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

/* 組織アイコンを大きく見せるエリア */
.largeIconArea {
  /* 大きさ設定 */
  width: 100%;
  height: 160px;
  /* バックグラウンド設定 */
  background: linear-gradient(135deg, #1d1d1f 0%, #434344 100%);
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 装飾設定 */
  border-radius: 20px;
  /* 余白設定 */
  margin-bottom: 24px;
  /* 文字設定 */
  color: #ffffff;
  /* 配置基準設定 */
  position: relative;
  /* アニメーション設定 */
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ホバー時にアイコンエリア内のアイコンが浮き上がる */
.roomCard:hover .largeIconArea > svg {
  /* アニメーション設定 */
  transform: scale(1.15) rotate(5deg);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  font-size: 0.95rem;
  color: #86868b;
  line-height: 1.5;
  /* 余白設定 */
  margin-bottom: 24px;
  /* 要素配置設定 */
  flex-grow: 1; /* 高さを揃えるための設定 */
}

.cardFooter {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 余白設定 */
  margin-top: auto;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 16px;
}

.statsGroup {
  /* 要素配置設定 */
  display: flex;
  gap: 12px;
}

.statBadge {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 4px;
  /* 文字設定 */
  font-size: 0.85rem;
  font-weight: 600;
  color: #515154;
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
// サイズを均一化するため size プロパティを廃止
interface RoomData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  totalCoins: number;
}

const ROOM_DATA: RoomData[] = [
  { 
    id: 'r1', 
    name: 'Design Studio', 
    description: 'UI/UXからブランディングまで、クリエイティブの心臓部。日々のデザインへの賞賛を。', 
    icon: <Sparkles size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 24, 
    totalCoins: 12500
  },
  { 
    id: 'r2', 
    name: 'Engineering', 
    description: 'フロントエンド、バックエンドの技術共有とコードレビューへの感謝を伝えるルーム。', 
    icon: <Code size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 86, 
    totalCoins: 8900
  },
  { 
    id: 'r3', 
    name: 'Marketing', 
    description: '市場調査やプロモーションの成果を報告する場所。マーケターの功績を称えよう。', 
    icon: <Megaphone size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 15, 
    totalCoins: 3200
  },
  { 
    id: 'r4', 
    name: 'All Hands', 
    description: '全社員が参加するパブリックルーム。会社全体への貢献や大きな感謝をここで伝えましょう。', 
    icon: <Globe size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 240, 
    totalCoins: 45000
  },
  { 
    id: 'r5', 
    name: 'Project Alpha', 
    description: '極秘の新規事業プロジェクトチーム。日々の泥臭い検証作業にコインを。', 
    icon: <Rocket size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 8, 
    totalCoins: 1200
  },
  { 
    id: 'r6', 
    name: 'Support', 
    description: 'お客様の声を第一に。CSチームの丁寧な対応に感謝の気持ちを可視化。', 
    icon: <LifeBuoy size={64} style={{ transition: 'all 0.3s ease' }} />, 
    members: 32, 
    totalCoins: 5600
  },
];


// ============================================================================
// 3. 内部処理・アニメーション用カスタムフック
// ============================================================================

/**
 * スクロールに合わせて要素がフワッと浮かび上がる「Fade-in Up」を実現するフック。
 */
function useFadeInUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
// 4. コンポーネント定義 (極力扱いやすいように部品化)
// ============================================================================

/**
 * ログイン / 新規登録画面 コンポーネント
 */
const LoginScreen: React.FC<{ onLogin: () => void, showToast: (msg: string) => void }> = ({ onLogin, showToast }) => {
  const { ref, isVisible } = useFadeInUp();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    showToast("認証に成功しました。TrusTokenRewardsへようこそ。");
    // 本来はここでAPI通信などを行い、成功したら画面遷移する
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="authContainer">
      <div ref={ref} className={`authCard fadeInUp ${isVisible ? 'visible' : ''}`}>
        <div className="authLogo">
          <ShieldCheck size={36} />
        </div>
        <h2 className="authTitle">TrusTokenRewards</h2>
        <p className="authDesc">
          仕事の価値を、目に見える形へ。<br />
          あなたの貢献に対する「感謝」と「信頼」を<br />トークンとして受け取りましょう。
        </p>

        <form style={{ width: '100%' }} onSubmit={handleAuth}>
          <div className="inputGroup">
            <Mail className="inputIcon" size={20} />
            <input type="email" placeholder="メールアドレス" className="textInput" required />
          </div>
          <div className="inputGroup">
            <Lock className="inputIcon" size={20} />
            <input type="password" placeholder="パスワード" className="textInput" required />
          </div>

          <button type="submit" className="primaryButton">
            <span>Login / Register</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * 組織（ルーム）を表示する均一サイズのカードコンポーネント。
 */
const RoomCard: React.FC<{ room: RoomData; onClick: (name: string) => void }> = ({ room, onClick }) => {
  const { ref, isVisible } = useFadeInUp();

  return (
    <div 
      ref={ref}
      className={`roomCard fadeInUp ${isVisible ? 'visible' : ''}`}
      onClick={() => onClick(room.name)}
    >
      {/* 組織アイコンを大きく表示するエリア */}
      <div className="largeIconArea">
        {room.icon}
      </div>
      
      <h3 className="cardTitle">{room.name}</h3>
      <p className="cardDesc">{room.description}</p>

      <div className="cardFooter">
        <div className="statsGroup">
          <div className="statBadge">
            <User size={16} />
            <span>{room.members}</span>
          </div>
        </div>
        <div className="statBadge" style={{ color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '12px' }}>
          <Coins size={16} />
          <span>{room.totalCoins.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ホーム画面（ルーム一覧） コンポーネント
 */
const HomeScreen: React.FC<{ onLogout: () => void, showToast: (msg: string) => void }> = ({ onLogout, showToast }) => {
  const handleRoomClick = (roomName: string) => {
    showToast(`「${roomName}」ルームに入室します🚀`);
  };

  return (
    <>
      <header className="header">
        <div className="headerLogo">
          <ShieldCheck color="#1d1d1f" size={28} />
          <span>TrusTokenRewards</span>
        </div>
        <div className="headerActions">
          <button className="iconButton" onClick={() => showToast('通知はありません')}>
            <Bell size={18} />
          </button>
          <button className="iconButton" onClick={() => showToast('プロフィール設定を開きます')}>
            <User size={18} />
          </button>
          <button className="iconButton" style={{ background: '#ffeeee', color: '#e63946', borderColor: 'rgba(230,57,70,0.2)' }} onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="mainContent">
        <div style={{ marginBottom: '40px' }}>
          <h1 className="pageTitle">
            Discover Rooms
          </h1>
          <p className="pageSubtitle">
            参加している組織のルーム。日々の仕事への感謝をトークンに乗せて贈りましょう。
          </p>
        </div>

        {/* 全て同じサイズで並ぶ均一グリッド */}
        <div className="uniformGrid">
          {ROOM_DATA.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onClick={handleRoomClick} 
            />
          ))}
        </div>
      </main>
    </>
  );
};


// ============================================================================
// 5. アプリケーション本体 (状態管理とルーティング)
// ============================================================================
export default function App() {
  // 画面遷移を管理するState ('login' または 'home')
  const [currentScreen, setCurrentScreen] = useState<'login' | 'home'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // トースト（通知メッセージ）を表示する関数
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <>
      {/* CSSの注入 */}
      <style>{styles}</style>

      <div className="appContainer">
        {/* 背景の装飾 (Glassmorphismを映えさせる) */}
        <div className="ambientOrb1"></div>
        <div className="ambientOrb2"></div>

        {/* Stateによる画面の切り替え (内部ルーティング) */}
        {currentScreen === 'login' ? (
          <LoginScreen 
            onLogin={() => setCurrentScreen('home')} 
            showToast={showToast} 
          />
        ) : (
          <HomeScreen 
            onLogout={() => {
              setCurrentScreen('login');
              showToast('ログアウトしました');
            }} 
            showToast={showToast} 
          />
        )}

        {/* 全画面共通で使えるトースト通知 */}
        <div className={`toast ${toastMessage ? 'show' : ''}`}>
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      </div>
    </>
  );
}