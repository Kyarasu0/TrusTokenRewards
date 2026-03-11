import { useState, useEffect, useRef } from 'react';

/**
 * カスタムフック: 要素がスクロールで表示されたときに
 * フェードイン＆アップするアニメーション用の状態を提供します。
 *
 * - ref: 対象となるDOM要素にアタッチする
 * - isVisible: 要素が交差した（画面内に入った）かどうか
 *
 * 使用例:
 * const { ref, isVisible } = useFadeInUp();
 * <div ref={ref} className={`${fadeStyles.fadeInUp} ${isVisible ? fadeStyles.visible : ''}`}>...
 *
 */
export function useFadeInUp() {
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
