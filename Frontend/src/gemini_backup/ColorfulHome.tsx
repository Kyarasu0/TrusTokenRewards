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
  LogOut,
  Plus,
  Zap,
  Ticket
} from 'lucide-react';

// ============================================================================
// 1. スタイル定義 (CSS Modules 形式のコメントルール準拠)
// ============================================================================
const styles = `
/* -------------------------------------
   全体レイアウト・背景 (オリジナリティ溢れるメッシュ背景)
-------------------------------------- */
.appContainer {
  /* 大きさ設定 */
  min-height: 100vh;
  width: 100%;
  /* バックグラウンド設定 */
  background-color: #ffffff;
  background-image: 
    radial-gradient(at 0% 0%, rgba(100, 220, 255, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(255, 100, 200, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(255, 200, 100, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(100, 100, 255, 0.15) 0px, transparent 50%);
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 配置基準設定 */
  position: relative;
  /* 装飾設定 */
  overflow-x: hidden;
  /* 文字設定 */
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1d1d1f;
}

/* 微細なノイズテクスチャで質感を向上 */
.appContainer::before {
  content: "";
  /* 配置基準設定 */
  position: fixed;
  top: 0; left: 0;
  /* 大きさ設定 */
  width: 100%; height: 100%;
  /* バックグラウンド設定 */
  background-image: url("https://grainy-gradients.vercel.app/noise.svg");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
}

/* -------------------------------------
   ヘッダー (洗練されたナビゲーション)
-------------------------------------- */
.header {
  /* 大きさ設定 */
  width: 100%;
  height: 80px;
  /* 要素配置設定 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 余白設定 */
  padding: 0 40px;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.4);
  /* 装飾設定 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  /* 配置基準設定 */
  position: fixed;
  top: 0;
  z-index: 100;
}

.headerLogo {
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 10px;
  /* 文字設定 */
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #000, #555);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  /* 配置基準設定 */
  position: relative;
  z-index: 10;
}

.authCard {
  /* 大きさ設定 */
  width: 440px;
  /* バックグラウンド設定 */
  background: #ffffff;
  /* 装飾設定 */
  border-radius: 40px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.12);
  /* 余白設定 */
  padding: 60px 40px;
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
}

/* -------------------------------------
   ホーム：未ログイン状態のカード
-------------------------------------- */
.loginPromptCard {
  /* 大きさ設定 */
  width: 100%;
  /* 余白設定 */
  padding: 60px;
  margin-bottom: 40px;
  /* バックグラウンド設定 */
  background: linear-gradient(135deg, #1d1d1f 0%, #333 100%);
  /* 装飾設定 */
  border-radius: 40px;
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  /* 文字設定 */
  color: #fff;
}

.loginPromptTitle {
  /* 文字設定 */
  font-size: 2rem;
  font-weight: 800;
  /* 余白設定 */
  margin-bottom: 16px;
}

.loginPromptButton {
  /* 余白設定 */
  padding: 16px 32px;
  margin-top: 24px;
  /* バックグラウンド設定 */
  background: #fff;
  /* 文字設定 */
  color: #000;
  font-weight: 700;
  /* 装飾設定 */
  border-radius: 100px;
  border: none;
  cursor: pointer;
  /* アニメーション設定 */
  transition: transform 0.2s ease;
}

.loginPromptButton:hover {
  /* アニメーション設定 */
  transform: scale(1.05);
}

/* -------------------------------------
   メイングリッド (均一サイズ)
-------------------------------------- */
.mainContent {
  /* 大きさ設定 */
  width: 100%;
  max-width: 1280px;
  /* 余白設定 */
  padding: 120px 40px 80px;
  /* 配置基準設定 */
  position: relative;
  z-index: 5;
}

.uniformGrid {
  /* 要素配置設定 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

/* -------------------------------------
   ルームカード (Bento要素 × アイコン巨大化)
-------------------------------------- */
.roomCard {
  /* 配置基準設定 */
  position: relative;
  /* 大きさ設定 */
  height: 480px;
  /* バックグラウンド設定 */
  background: rgba(255, 255, 255, 0.7);
  /* 装飾設定 */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 48px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  /* 余白設定 */
  padding: 32px;
  /* 要素配置設定 */
  display: flex;
  flex-direction: column;
  /* アニメーション設定 */
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  overflow: hidden;
}

.roomCard:hover {
  /* 装飾設定 */
  transform: translateY(-12px);
  box-shadow: 0 40px 80px rgba(0,0,0,0.1);
  background: #ffffff;
}

/* 付箋・吹き出しスタイルの報酬表示 (Rewards) */
.rewardSticker {
  /* 配置基準設定 */
  position: absolute;
  top: 20px;
  right: -10px;
  /* バックグラウンド設定 */
  background: #FFEF5E; /* ポップなイエロー */
  /* 余白設定 */
  padding: 8px 24px;
  /* 装飾設定 */
  box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
  transform: rotate(5deg);
  border-radius: 4px;
  /* 要素配置設定 */
  display: flex;
  align-items: center;
  gap: 6px;
  /* アニメーション設定 */
  z-index: 20;
}

.rewardSticker::after {
  content: "";
  /* 配置基準設定 */
  position: absolute;
  bottom: -5px;
  left: 10px;
  /* 大きさ設定 */
  width: 10px; height: 10px;
  /* バックグラウンド設定 */
  background: #FFEF5E;
  transform: rotate(45deg);
}

.rewardText {
  /* 文字設定 */
  font-weight: 800;
  font-size: 0.9rem;
  color: #333;
}

/* 巨大アイコンエリア */
.iconShowcase {
  /* 大きさ設定 */
  width: 100%;
  height: 240px;
  /* 余白設定 */
  margin-bottom: 24px;
  /* 要素配置設定 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 装飾設定 */
  border-radius: 36px;
  /* バックグラウンド設定 */
  background: #f1f1f1;
  /* 配置基準設定 */
  position: relative;
  overflow: hidden;
}

/* ホバー時の背景色の変化アニメーション */
.roomCard:nth-child(1n):hover .iconShowcase { background: #E3F2FD; }
.roomCard:nth-child(2n):hover .iconShowcase { background: #F3E5F5; }
.roomCard:nth-child(3n):hover .iconShowcase { background: #E8F5E9; }

.iconShowcase svg {
  /* アニメーション設定 */
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.roomCard:hover .iconShowcase svg {
  /* アニメーション設定 */
  transform: scale(1.4) rotate(-5deg);
}

/* -------------------------------------
   入力フォーム等の共通部品
-------------------------------------- */
.inputField {
  /* 余白設定 */
  padding: 16px 20px;
  margin-bottom: 12px;
  /* バックグラウンド設定 */
  background: #f5f5f7;
  /* 装飾設定 */
  border: none;
  border-radius: 12px;
  /* 文字設定 */
  font-size: 1rem;
}

.submitBtn {
  /* 余白設定 */
  padding: 18px;
  /* バックグラウンド設定 */
  background: #000;
  /* 文字設定 */
  color: #fff;
  font-weight: 700;
  /* 装飾設定 */
  border-radius: 12px;
  border: none;
  cursor: pointer;
  /* アニメーション設定 */
  transition: opacity 0.2s ease;
}

.submitBtn:hover { opacity: 0.8; }

/* -------------------------------------
   アニメーション用
-------------------------------------- */
.fadeUp {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.fadeUp.show {
  opacity: 1;
  transform: translateY(0);
}
`;

// ============================================================================
// 2. データ定義
// ============================================================================
const ROOM_DATA = [
  { id: 1, name: "Design Unit", icon: <Sparkles size={100} />, color: "#FF5ACD", reward: "2,400 TTR" },
  { id: 2, name: "Dev Squad", icon: <Code size={100} />, color: "#5AD2FF", reward: "1,850 TTR" },
  { id: 3, name: "Marketing", icon: <Megaphone size={100} />, color: "#FFB85A", reward: "920 TTR" },
  { id: 4, name: "Alpha Project", icon: <Rocket size={100} />, color: "#7A5AFF", reward: "5,000 TTR" },
  { id: 5, name: "Global HR", icon: <Globe size={100} />, color: "#5AFF9B", reward: "310 TTR" },
  { id: 6, name: "Customer Care", icon: <LifeBuoy size={100} />, color: "#FF5A5A", reward: "1,100 TTR" },
];

// ============================================================================
// 3. コンポーネント
// ============================================================================

/**
 * ログイン/新規登録画面
 */
const AuthPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="authContainer">
      <div className="authCard fadeUp show">
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>Join TrusToken</h2>
        <p style={{ color: '#86868b', marginBottom: '32px' }}>信頼を可視化する新しい報酬体験</p>
        
        <input type="email" placeholder="メールアドレス" className="inputField" />
        <input type="password" placeholder="パスワード" className="inputField" />
        
        <button className="submitBtn" onClick={onComplete}>ログイン / 新規登録</button>
        
        <p style={{ marginTop: '24px', fontSize: '0.8rem', textAlign: 'center', color: '#86868b' }}>
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

/**
 * ルームカード
 */
const RoomCard: React.FC<{ room: typeof ROOM_DATA[0], onInteraction: () => void }> = ({ room, onInteraction }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`roomCard fadeUp ${isVisible ? 'show' : ''}`}
      onClick={onInteraction}
    >
      {/* 報酬タグ (付箋スタイル) */}
      <div className="rewardSticker">
        <Zap size={14} fill="#000" />
        <span className="rewardText">{room.reward}</span>
      </div>

      <div className="iconShowcase" style={{ color: room.color }}>
        {room.icon}
      </div>

      <h3 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{room.name}</h3>
      <p style={{ color: '#86868b', marginTop: '8px', fontSize: '0.95rem', lineHeight: '1.6' }}>
        このルームでの貢献はトークンとして評価され、あなたの信頼スコアを向上させます。
      </p>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 700 }}>
        <span>Enter Room</span>
        <ArrowRight size={18} />
      </div>
    </div>
  );
};

// ============================================================================
// 4. メインアプリケーション
// ============================================================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'home' | 'auth'>('home');

  const handleInteraction = () => {
    if (!isLoggedIn) {
      setView('auth');
    } else {
      // 本来は詳細ページへ
      alert("ルームに入室します");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="appContainer">
        
        {/* ナビゲーション */}
        <header className="header">
          <div className="headerLogo" onClick={() => setView('home')} style={{cursor:'pointer'}}>
            <ShieldCheck size={28} color="#000" />
            <span>TrusTokenRewards</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {!isLoggedIn ? (
              <button className="submitBtn" style={{ padding: '10px 24px' }} onClick={() => setView('auth')}>Login</button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="iconField" style={{ background: '#f5f5f7', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Bell size={20}/></div>
                <div className="iconField" style={{ background: '#f5f5f7', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setIsLoggedIn(false)}><LogOut size={20}/></div>
              </div>
            )}
          </div>
        </header>

        {view === 'auth' ? (
          <AuthPage onComplete={() => { setIsLoggedIn(true); setView('home'); }} />
        ) : (
          <main className="mainContent">
            {/* 未ログイン時のプロンプト */}
            {!isLoggedIn && (
              <div className="loginPromptCard fadeUp show">
                <Ticket size={48} style={{ marginBottom: '20px' }} />
                <h2 className="loginPromptTitle">あなたの信頼を報酬に変えよう</h2>
                <p style={{ opacity: 0.8, maxWidth: '500px' }}>
                  現在ゲストとして表示されています。組織のルームに参加し、トークンを受け取るにはログインが必要です。
                </p>
                <button className="loginPromptButton" onClick={() => setView('auth')}>
                  今すぐログインして参加する
                </button>
              </div>
            )}

            <div style={{ marginBottom: '48px' }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Your Communities</h1>
              <p style={{ fontSize: '1.2rem', color: '#86868b' }}>所属している組織の一覧</p>
            </div>

            {/* 均一なBento Grid */}
            <div className="uniformGrid">
              {ROOM_DATA.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onInteraction={handleInteraction} 
                />
              ))}
            </div>
          </main>
        )}

      </div>
    </>
  );
}